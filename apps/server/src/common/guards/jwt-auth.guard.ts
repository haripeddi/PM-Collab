import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import {
  OAUTH_SCOPE_KEY,
  OAuthRouteScope,
} from '../decorators/oauth-scope.decorator';
import { REQUIRE_SESSION_AUTH_KEY } from '../decorators/require-session-auth.decorator';
import { JwtType } from '../../core/auth/dto/jwt-payload';
import { Reflector } from '@nestjs/core';
import { EnvironmentService } from '../../integrations/environment/environment.service';
import { addDays } from 'date-fns';
import { InjectKysely } from 'nestjs-kysely';
import { KyselyDB } from '@docmost/db/types/kysely.types';
import { WorkspaceRepo } from '../../database/repos/workspace/workspace.repo';
import { UserRepo } from '../../database/repos/user/user.repo';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private logger = new Logger('JwtAuthGuard');

  // Cached so the DISABLE_AUTH bypass only hits the database once per
  // process, not on every request.
  private bypassAuthPromise: Promise<any> | null = null;

  constructor(
    private reflector: Reflector,
    private environmentService: EnvironmentService,
    private workspaceRepo: WorkspaceRepo,
    private userRepo: UserRepo,
    @InjectKysely() private readonly db: KyselyDB,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (this.environmentService.isAuthDisabled()) {
      return this.bypassAuthentication(context);
    }

    return super.canActivate(context);
  }

  // DISABLE_AUTH=true skips login entirely and treats every request as the
  // workspace's first (owner) user. Local/embedded-preview use only — never
  // enable this for a deployment reachable by more than one real user.
  private async bypassAuthentication(
    context: ExecutionContext,
  ): Promise<boolean> {
    if (!this.bypassAuthPromise) {
      this.bypassAuthPromise = (async () => {
        const workspace = await this.workspaceRepo.findFirst();
        if (!workspace) {
          throw new UnauthorizedException('No workspace found');
        }

        const firstUserId = await this.db
          .selectFrom('users')
          .select('id')
          .where('workspaceId', '=', workspace.id)
          .where('deletedAt', 'is', null)
          .orderBy('createdAt', 'asc')
          .executeTakeFirst();

        if (!firstUserId) {
          throw new UnauthorizedException('No user found');
        }

        const user = await this.userRepo.findById(
          firstUserId.id,
          workspace.id,
        );

        return { user, workspace, authType: JwtType.ACCESS };
      })();
    }

    const req = context.switchToHttp().getRequest();
    req.user = await this.bypassAuthPromise;
    return true;
  }

  handleRequest(err: any, user: any, info: any, ctx: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    const requiresSession = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_SESSION_AUTH_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (requiresSession && user.authType !== JwtType.ACCESS) {
      this.logger.debug(
        `session-only endpoint ${ctx.getClass()?.name}.${ctx.getHandler()?.name} refused authType ${user.authType}`,
      );
      throw new ForbiddenException(
        'This action requires an interactive user session',
      );
    }

    if (user.oauth) {
      const required = this.reflector.getAllAndOverride<
        OAuthRouteScope | undefined
      >(OAUTH_SCOPE_KEY, [ctx.getHandler(), ctx.getClass()]);
      if (!required) {
        this.logger.warn(
          `oauth scope check: no @OAuthScope metadata on ${ctx.getClass()?.name}.${ctx.getHandler()?.name}`,
        );
        throw new ForbiddenException('OAuth tokens cannot access this endpoint');
      }
      const scopes: string[] = user.oauth.scopes ?? [];
      const satisfied =
        required === 'read'
          ? scopes.includes('read') || scopes.includes('write')
          : scopes.includes('write');
      if (!satisfied) {
        throw new ForbiddenException('insufficient_scope');
      }
    }

    this.setJoinedWorkspacesCookie(user, ctx);
    return user;
  }

  setJoinedWorkspacesCookie(user: any, ctx: ExecutionContext) {
    if (this.environmentService.isCloud()) {
      const req = ctx.switchToHttp().getRequest();
      const res = ctx.switchToHttp().getResponse();

      const workspaceId = user?.workspace?.id;
      let workspaceIds = [];
      try {
        workspaceIds = req.cookies.joinedWorkspaces
          ? JSON.parse(req.cookies.joinedWorkspaces)
          : [];
      } catch (err) {
        /* empty */
      }

      if (!workspaceIds.includes(workspaceId)) {
        workspaceIds.push(workspaceId);
      }

      res.setCookie('joinedWorkspaces', JSON.stringify(workspaceIds), {
        httpOnly: false,
        domain: '.' + this.environmentService.getSubdomainHost(),
        path: '/',
        expires: addDays(new Date(), 365),
        secure: this.environmentService.isHttps(),
      });
    }
  }
}
