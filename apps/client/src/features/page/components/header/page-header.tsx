import classes from "./page-header.module.css";
import PageHeaderMenu from "@/features/page/components/header/page-header-menu.tsx";
import { Badge, Group, Tooltip } from "@mantine/core";
import { IconExternalLink, IconWorld } from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { useGetSpaceBySlugQuery } from "@/features/space/queries/space-query.ts";
import { usePageQuery } from "@/features/page/queries/page-query.ts";
import { extractPageSlugId } from "@/lib";
import { buildPublicSpaceUrl } from "@/features/page/page.utils.ts";
import { isBetaPublicSpaces } from "@/lib/config.ts";
import { userAtom } from "@/features/user/atoms/current-user-atom.ts";
import { currentPageEditModeAtom } from "@/features/editor/atoms/editor-atoms.ts";
import { PageEditMode } from "@/features/user/types/user.types.ts";
import { FixedToolbar } from "@/features/editor/components/fixed-toolbar/fixed-toolbar";

interface Props {
  readOnly?: boolean;
}
export default function PageHeader({ readOnly }: Props) {
  const { t } = useTranslation();
  const { spaceSlug, pageSlug } = useParams();
  const { data: space } = useGetSpaceBySlugQuery(spaceSlug);
  const { data: page } = usePageQuery({
    pageId: extractPageSlugId(pageSlug),
  });
  const [user] = useAtom(userAtom);
  const [currentPageEditMode] = useAtom(currentPageEditModeAtom);
  const editorToolbarEnabled =
    user.settings?.preferences?.editorToolbar ?? false;
  const isEditMode = currentPageEditMode === PageEditMode.Edit;
  const showToolbar =
    editorToolbarEnabled && !readOnly && !page?.isBase && isEditMode;

  // Restricted pages are never publicly reachable, so the chip only shows on
  // pages the public site actually serves.
  const showPublicBadge =
    isBetaPublicSpaces() &&
    space?.isPublished &&
    page &&
    page.permissions?.hasRestriction !== true;

  return (
    <div className={classes.header} data-page-header="true">
      <Group justify="space-between" h="100%" px="md" wrap="nowrap" className={classes.group}>
        <Group gap="xs" wrap="nowrap" style={{ minWidth: 0, flexShrink: 0 }}>
          {showPublicBadge && (
            <Tooltip label={t("Open public page")} openDelay={250} withArrow>
              <Badge
                component="a"
                href={buildPublicSpaceUrl({
                  spaceSlug: space.slug,
                  pageSlugId: page.slugId,
                  pageTitle: page.title,
                })}
                target="_blank"
                rel="noopener"
                size="sm"
                variant="light"
                leftSection={<IconWorld size={12} />}
                rightSection={<IconExternalLink size={11} />}
                style={{ flexShrink: 0, cursor: "pointer" }}
              >
                {t("Public")}
              </Badge>
            </Tooltip>
          )}
        </Group>

        {showToolbar && (
          <div style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "center" }}>
            <FixedToolbar inline />
          </div>
        )}

        <Group justify="flex-end" h="100%" px="md" wrap="nowrap" gap="var(--mantine-spacing-xs)">
          <PageHeaderMenu readOnly={readOnly} />
        </Group>
      </Group>
    </div>
  );
}
