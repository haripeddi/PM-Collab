import classes from "@/features/editor/styles/editor.module.css";
import React, { useEffect } from "react";
import { TitleEditor } from "@/features/editor/title-editor";
import PageEditor from "@/features/editor/page-editor";
import { Popover, Tooltip } from "@mantine/core";
import { Info } from "lucide-react";
import { useAtom } from "jotai";
import { POPOVER_CLASSNAMES } from "@/features/editor/components/fixed-toolbar/toolbar-primitives";
import { userAtom } from "@/features/user/atoms/current-user-atom.ts";
import { CustomAvatar } from "@/components/ui/custom-avatar.tsx";
import { useTranslation } from "react-i18next";
import { IContributor } from "@/features/page/types/page.types.ts";
import { PageEditMode } from "@/features/user/types/user.types.ts";
import { useAsideTriggerProps } from "@/hooks/use-toggle-aside.tsx";
import { DeletedPageBanner } from "@/features/page/trash/components/deleted-page-banner.tsx";
import clsx from "clsx";
import { currentPageEditModeAtom } from "@/features/editor/atoms/editor-atoms.ts";
import { EmptyPageGetStarted } from "@/features/editor/components/empty-page/empty-page-get-started";

const MemoizedTitleEditor = React.memo(TitleEditor);
const MemoizedPageEditor = React.memo(PageEditor);
const MemoizedDeletedPageBanner = React.memo(DeletedPageBanner);

type PageUser = {
  id: string;
  name: string;
  avatarUrl: string;
};

// Module-level flag: survives component unmount/remount on page navigation,
// reset only on full page reload (i.e. a new app session).
let defaultEditModeApplied = false;

export interface FullEditorProps {
  pageId: string;
  slugId: string;
  title: string;
  content: string;
  spaceSlug: string;
  editable: boolean;
  creator?: PageUser;
  contributors?: IContributor[];
  canComment?: boolean;
}

export function FullEditor({
  pageId,
  title,
  slugId,
  content,
  spaceSlug,
  editable,
  creator,
  contributors,
  canComment,
}: FullEditorProps) {
  const [user] = useAtom(userAtom);
  const [currentPageEditMode, setCurrentPageEditMode] = useAtom(
    currentPageEditModeAtom,
  );
  const userPageEditMode =
    user.settings?.preferences?.pageEditMode ?? PageEditMode.Edit;

  // Apply the user's saved preference only once on initial load, not on every
  // page navigation — so the mode sticks across navigations within a session.
  useEffect(() => {
    if (!defaultEditModeApplied) {
      setCurrentPageEditMode(userPageEditMode as PageEditMode);
      defaultEditModeApplied = true;
    }
  }, [userPageEditMode, setCurrentPageEditMode]);

  return (
    <div
      className={`${classes.editor} flex flex-col w-full mx-auto px-4 max-w-[900px]`}
    >
      <MemoizedDeletedPageBanner slugId={slugId} />
      <MemoizedTitleEditor
        pageId={pageId}
        slugId={slugId}
        title={title}
        spaceSlug={spaceSlug}
        editable={editable}
      />
      <PageByline creator={creator} contributors={contributors} />
      <MemoizedPageEditor
        pageId={pageId}
        editable={editable}
        content={content}
        canComment={canComment}
      />
      <EmptyPageGetStarted pageId={pageId} editable={editable} />
    </div>
  );
}

type PageBylineProps = {
  creator?: PageUser;
  contributors?: IContributor[];
};

function PageByline({ creator, contributors }: PageBylineProps) {
  const { t } = useTranslation();
  const detailsTriggerProps = useAsideTriggerProps("details");

  const otherContributors = (contributors ?? []).filter(
    (c) => c.id !== creator?.id,
  );

  return (
    <div
      className={clsx(
        "print-hide flex items-center gap-3 mb-4",
        classes.byline,
      )}
      style={{ marginTop: "-0.5em" }}
    >
      {creator && (
        <Popover
          position="bottom-start"
          shadow="md"
          width={280}
          withArrow
          classNames={POPOVER_CLASSNAMES}
        >
          <Popover.Target>
            <button
              type="button"
              className="flex items-center gap-1.5 border-0 bg-transparent p-0 cursor-pointer"
              aria-label={t("Created by {{name}}", { name: creator.name })}
            >
              <CustomAvatar
                avatarUrl={creator.avatarUrl}
                name={creator.name}
                size={22}
              />
              <span className="text-sm text-[#7A818C]">
                {t("By {{name}}", { name: creator.name })}
              </span>
            </button>
          </Popover.Target>
          <Popover.Dropdown>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <CustomAvatar
                  avatarUrl={creator.avatarUrl}
                  name={creator.name}
                  size={36}
                />
                <div>
                  <p className="text-sm font-medium text-[#27282C]">
                    {creator.name}
                  </p>
                  <p className="text-xs text-[#7A818C]">
                    {otherContributors.length === 0
                      ? t("Owner, no contributors")
                      : t("Owner")}
                  </p>
                </div>
              </div>

              {otherContributors.length > 0 && (
                <>
                  <div className="border-t border-slate-100" />
                  <p className="text-xs font-medium text-[#7A818C] uppercase tracking-wide">
                    {t("Contributors")}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {otherContributors.map((contributor) => (
                      <div
                        className="flex items-center gap-3"
                        key={contributor.id}
                      >
                        <CustomAvatar
                          avatarUrl={contributor.avatarUrl}
                          name={contributor.name}
                          size={28}
                        />
                        <span className="text-sm text-[#353B46]">
                          {contributor.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Popover.Dropdown>
        </Popover>
      )}
      <Tooltip label={t("Details")} withArrow openDelay={250}>
        <button
          type="button"
          aria-label={t("Details")}
          {...detailsTriggerProps}
          className="flex items-center justify-center w-8 h-8 shrink-0 rounded-[10px] border-0 bg-transparent text-[#7A818C] hover:bg-slate-100 hover:text-[#353B46] transition-colors"
        >
          <Info className="w-[18px] h-[18px]" strokeWidth={1.75} />
        </button>
      </Tooltip>
    </div>
  );
}
