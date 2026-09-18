import { FC } from "react";
import type { Editor } from "@tiptap/react";
import { Tooltip } from "@mantine/core";
import { List, ListOrdered, ListTodo } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ToolbarState } from "../use-toolbar-state";
import { ToolbarIconButton } from "../toolbar-primitives";

interface Props {
  editor: Editor;
  state: ToolbarState;
}

export const ListsGroup: FC<Props> = ({ editor, state }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-0.5">
      <Tooltip label={t("Bullet List")} withArrow>
        <ToolbarIconButton
          aria-label={t("Bullet List")}
          aria-pressed={state.isBulletList}
          active={state.isBulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="w-4 h-4" strokeWidth={2} />
        </ToolbarIconButton>
      </Tooltip>
      <Tooltip label={t("Numbered List")} withArrow>
        <ToolbarIconButton
          aria-label={t("Numbered List")}
          aria-pressed={state.isOrderedList}
          active={state.isOrderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-4 h-4" strokeWidth={2} />
        </ToolbarIconButton>
      </Tooltip>
      <Tooltip label={t("To-do List")} withArrow>
        <ToolbarIconButton
          aria-label={t("To-do List")}
          aria-pressed={state.isTaskList}
          active={state.isTaskList}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <ListTodo className="w-4 h-4" strokeWidth={2} />
        </ToolbarIconButton>
      </Tooltip>
    </div>
  );
};
