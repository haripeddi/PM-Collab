import React, { Dispatch, FC, SetStateAction } from "react";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Check } from "lucide-react";
import { Menu, Tooltip } from "@mantine/core";
import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { useTranslation } from "react-i18next";
import { isEditorReady } from "@docmost/editor-ext";
import { MENU_CLASSNAMES, ToolbarIconButton } from "../fixed-toolbar/toolbar-primitives";

interface TextAlignmentProps {
  editor: Editor | null;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export interface BubbleMenuItem {
  name: string;
  icon: React.ElementType;
  command: () => void;
  isActive: () => boolean;
}

export const TextAlignmentSelector: FC<TextAlignmentProps> = ({
  editor,
  isOpen,
  setIsOpen,
}) => {
  const { t } = useTranslation();

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) {
        return null;
      }

      return {
        isAlignLeft: ctx.editor.isActive({ textAlign: "left" }),
        isAlignCenter: ctx.editor.isActive({ textAlign: "center" }),
        isAlignRight: ctx.editor.isActive({ textAlign: "right" }),
        isAlignJustify: ctx.editor.isActive({ textAlign: "justify" }),
      };
    },
  });

  if (!editor || !editorState) {
    return null;
  }

  const items: BubbleMenuItem[] = [
    {
      name: "Align left",
      isActive: () => editorState?.isAlignLeft,
      command: () => editor.chain().focus().setTextAlign("left").run(),
      icon: AlignLeft,
    },
    {
      name: "Align center",
      isActive: () => editorState?.isAlignCenter,
      command: () => editor.chain().focus().setTextAlign("center").run(),
      icon: AlignCenter,
    },
    {
      name: "Align right",
      isActive: () => editorState?.isAlignRight,
      command: () => editor.chain().focus().setTextAlign("right").run(),
      icon: AlignRight,
    },
    {
      name: "Justify",
      isActive: () => editorState?.isAlignJustify,
      command: () => editor.chain().focus().setTextAlign("justify").run(),
      icon: AlignJustify,
    },
  ];

  const activeItem = items.filter((item) => item.isActive()).pop() ?? items[0];

  return (
    <Menu
      shadow="md"
      position="bottom-start"
      withArrow={false}
      opened={isOpen}
      onChange={setIsOpen}
      classNames={MENU_CLASSNAMES}
    >
      <Menu.Target>
        <Tooltip
          label={t("Text align")}
          withArrow
          disabled={isOpen}
          withinPortal={false}
        >
          <ToolbarIconButton
            active={isOpen}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={t("Text align")}
            aria-haspopup="menu"
            aria-expanded={isOpen}
          >
            <activeItem.icon className="w-4 h-4" strokeWidth={2} />
          </ToolbarIconButton>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        {items.map((item, index) => (
          <Menu.Item
            key={index}
            leftSection={<item.icon className="w-4 h-4" strokeWidth={2} />}
            rightSection={
              activeItem.name === item.name ? (
                <Check className="w-4 h-4" strokeWidth={2} />
              ) : null
            }
            onClick={() => {
              if (isEditorReady(editor)) item.command();
              setIsOpen(false);
            }}
          >
            {t(item.name)}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
