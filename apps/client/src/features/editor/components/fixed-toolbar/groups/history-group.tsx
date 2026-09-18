import { FC } from "react";
import type { Editor } from "@tiptap/react";
import { Tooltip } from "@mantine/core";
import { Undo2, Redo2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ToolbarState } from "../use-toolbar-state";
import { ToolbarIconButton } from "../toolbar-primitives";

interface Props {
  editor: Editor;
  state: ToolbarState;
}

export const HistoryGroup: FC<Props> = ({ editor, state }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-0.5">
      <Tooltip label={t("Undo")} withArrow>
        <ToolbarIconButton
          aria-label={t("Undo")}
          disabled={!state.canUndo}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="w-4 h-4" strokeWidth={2} />
        </ToolbarIconButton>
      </Tooltip>
      <Tooltip label={t("Redo")} withArrow>
        <ToolbarIconButton
          aria-label={t("Redo")}
          disabled={!state.canRedo}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="w-4 h-4" strokeWidth={2} />
        </ToolbarIconButton>
      </Tooltip>
    </div>
  );
};
