import { FC } from "react";
import { useAtomValue } from "jotai";
import type { Editor } from "@tiptap/react";
import { pageEditorAtom } from "@/features/editor/atoms/editor-atoms";
import { useToolbarState } from "./use-toolbar-state";
import { BlockTypeGroup } from "./groups/block-type-group";
import { InlineMarksGroup } from "./groups/inline-marks-group";
import { ColorGroup } from "./groups/color-group";
import { ListsGroup } from "./groups/lists-group";
import { AlignmentGroup } from "./groups/alignment-group";
import { MediaGroup } from "./groups/media-group";
import { QuickInsertsGroup } from "./groups/quick-inserts-group";
import { MoreInsertsGroup } from "./groups/more-inserts-group";
import { HistoryGroup } from "./groups/history-group";
import { AskAiGroup } from "./groups/ask-ai-group";
import { workspaceAtom } from "@/features/user/atoms/current-user-atom";

type FixedToolbarProps = {
  editor?: Editor | null;
  templateMode?: boolean;
  // Renders just the button-group row in normal flow, with no fixed
  // positioning/spacer of its own — for embedding inline in another fixed
  // bar (e.g. the page header row) instead of stacking a second 45px bar.
  inline?: boolean;
};

export const FixedToolbar: FC<FixedToolbarProps> = ({
  editor: editorProp,
  templateMode = false,
  inline = false,
}) => {
  const editorFromAtom = useAtomValue(pageEditorAtom);
  const editor = editorProp ?? editorFromAtom;
  const state = useToolbarState(editor);
  const workspace = useAtomValue(workspaceAtom);
  const isGenerativeAiEnabled = workspace?.settings?.ai?.generative === true;

  const divider = <div className="w-px h-5 mx-1 shrink-0 bg-slate-200" />;

  if (!editor || !state) {
    return null;
  }

  const toolbarGroups = (
    <>
      {/* {isGenerativeAiEnabled && (
        <>
          <AskAiGroup />
          {divider}
        </>
      )} */}
      <BlockTypeGroup editor={editor} />
      {divider}
      <InlineMarksGroup editor={editor} state={state} />
      {divider}
      <ColorGroup editor={editor} />
      {divider}
      <ListsGroup editor={editor} state={state} />
      {divider}
      <AlignmentGroup editor={editor} />
      {divider}
      <MediaGroup editor={editor} templateMode={templateMode} />
      {divider}
      <QuickInsertsGroup editor={editor} />
      <MoreInsertsGroup editor={editor} templateMode={templateMode} />
      {divider}
      <HistoryGroup editor={editor} state={state} />
    </>
  );

  if (inline) {
    return (
      <div
        className="flex items-center flex-nowrap gap-1 overflow-x-auto print:hidden [&>*]:shrink-0"
        role="toolbar"
        aria-label="Editor toolbar"
        onMouseDown={(e) => e.preventDefault()}
      >
        {toolbarGroups}
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed z-[99] flex items-center min-h-[45px] w-full bg-white border-b border-slate-200 overflow-x-auto print:hidden"
        style={{
          top: "calc(var(--app-shell-header-offset, 0rem) + 45px)",
          insetInlineStart: "var(--app-shell-navbar-offset, 0rem)",
          insetInlineEnd: "var(--app-shell-aside-offset, 0rem)",
        }}
        data-fixed-toolbar="true"
        role="toolbar"
        aria-label="Editor toolbar"
        onMouseDown={(e) => e.preventDefault()}
      >
        <div className="flex items-center flex-nowrap gap-1 px-2 py-1 mx-auto [&>*]:shrink-0">
          {toolbarGroups}
        </div>
      </div>
      <div className="h-[45px] print:hidden" aria-hidden />
    </>
  );
};
