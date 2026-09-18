import { FC } from "react";
import type { Editor } from "@tiptap/react";
import { Menu, Tooltip } from "@mantine/core";
import {
  Bold,
  ChevronDown,
  Code,
  IndentDecrease,
  IndentIncrease,
  Italic,
  RemoveFormatting,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ToolbarState } from "../use-toolbar-state";
import {
  MENU_CLASSNAMES,
  ToolbarIconButton,
} from "../toolbar-primitives";

interface Props {
  editor: Editor;
  state: ToolbarState;
}

export const InlineMarksGroup: FC<Props> = ({ editor, state }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-0.5">
      <Tooltip label={t("Bold")} withArrow>
        <ToolbarIconButton
          aria-label={t("Bold")}
          aria-pressed={state.isBold}
          active={state.isBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" strokeWidth={2} />
        </ToolbarIconButton>
      </Tooltip>
      <Tooltip label={t("Underline")} withArrow>
        <ToolbarIconButton
          aria-label={t("Underline")}
          aria-pressed={state.isUnderline}
          active={state.isUnderline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline className="w-4 h-4" strokeWidth={2} />
        </ToolbarIconButton>
      </Tooltip>
      <Tooltip label={t("Italic")} withArrow>
        <ToolbarIconButton
          aria-label={t("Italic")}
          aria-pressed={state.isItalic}
          active={state.isItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" strokeWidth={2} />
        </ToolbarIconButton>
      </Tooltip>
      <Menu shadow="md" position="bottom-start" withArrow={false} classNames={MENU_CLASSNAMES}>
        <Menu.Target>
          <ToolbarIconButton aria-label={t("More inline formatting")}>
            <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} />
          </ToolbarIconButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<Strikethrough className="w-4 h-4" strokeWidth={2} />}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            {t("Strikethrough")}
          </Menu.Item>
          <Menu.Item
            leftSection={<Code className="w-4 h-4" strokeWidth={2} />}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            {t("Inline code")}
          </Menu.Item>
          <Menu.Item
            leftSection={<Subscript className="w-4 h-4" strokeWidth={2} />}
            onClick={() => editor.chain().focus().toggleSubscript().run()}
          >
            {t("Subscript")}
          </Menu.Item>
          <Menu.Item
            leftSection={<Superscript className="w-4 h-4" strokeWidth={2} />}
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
          >
            {t("Superscript")}
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={<IndentIncrease className="w-4 h-4" strokeWidth={2} />}
            onClick={() => editor.chain().focus().indent().run()}
          >
            {t("Increase indent")}
          </Menu.Item>
          <Menu.Item
            leftSection={<IndentDecrease className="w-4 h-4" strokeWidth={2} />}
            onClick={() => editor.chain().focus().outdent().run()}
          >
            {t("Decrease indent")}
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={<RemoveFormatting className="w-4 h-4" strokeWidth={2} />}
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
          >
            {t("Clear formatting")}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};
