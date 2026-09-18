import { FC } from "react";
import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { Menu } from "@mantine/core";
import {
  ChevronDown,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  ScanLine,
  SeparatorHorizontal,
  Type,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { MENU_CLASSNAMES, ToolbarTextButton } from "../toolbar-primitives";

interface Props {
  editor: Editor;
}

export const BlockTypeGroup: FC<Props> = ({ editor }) => {
  const { t } = useTranslation();

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      isHeading1: !!ctx.editor?.isActive("heading", { level: 1 }),
      isHeading2: !!ctx.editor?.isActive("heading", { level: 2 }),
      isHeading3: !!ctx.editor?.isActive("heading", { level: 3 }),
      isBlockquote: !!ctx.editor?.isActive("blockquote"),
      isCodeBlock: !!ctx.editor?.isActive("codeBlock"),
    }),
  });

  let label = t("Normal text");
  if (state.isHeading1) label = t("Heading 1");
  else if (state.isHeading2) label = t("Heading 2");
  else if (state.isHeading3) label = t("Heading 3");
  else if (state.isBlockquote) label = t("Quote");
  else if (state.isCodeBlock) label = t("Code block");

  return (
    <Menu shadow="md" position="bottom-start" withArrow={false} classNames={MENU_CLASSNAMES}>
      <Menu.Target>
        <ToolbarTextButton>
          {label}
          <ChevronDown className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
        </ToolbarTextButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<Type className="w-4 h-4" strokeWidth={2} />}
          onClick={() =>
            editor.chain().focus().toggleNode("paragraph", "paragraph").run()
          }
        >
          {t("Text")}
        </Menu.Item>
        <Menu.Item
          leftSection={<Heading1 className="w-4 h-4" strokeWidth={2} />}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          {t("Heading 1")}
        </Menu.Item>
        <Menu.Item
          leftSection={<Heading2 className="w-4 h-4" strokeWidth={2} />}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          {t("Heading 2")}
        </Menu.Item>
        <Menu.Item
          leftSection={<Heading3 className="w-4 h-4" strokeWidth={2} />}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          {t("Heading 3")}
        </Menu.Item>
        <Menu.Item
          leftSection={<Quote className="w-4 h-4" strokeWidth={2} />}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          {t("Quote")}
        </Menu.Item>
        <Menu.Item
          leftSection={<Code2 className="w-4 h-4" strokeWidth={2} />}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          {t("Code block")}
        </Menu.Item>
        <Menu.Item
          leftSection={<SeparatorHorizontal className="w-4 h-4" strokeWidth={2} />}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          {t("Divider")}
        </Menu.Item>
        <Menu.Item
          leftSection={<ScanLine className="w-4 h-4" strokeWidth={2} />}
          onClick={() => editor.chain().focus().setPageBreak().run()}
        >
          {t("Page break")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
