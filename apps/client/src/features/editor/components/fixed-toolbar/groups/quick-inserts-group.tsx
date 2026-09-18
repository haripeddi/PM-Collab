import { FC } from "react";
import type { Editor } from "@tiptap/react";
import { Menu, Tooltip } from "@mantine/core";
import { AtSign, Columns2, Columns3, SmilePlus, Table2 } from "lucide-react";
import { IconColumns4 } from "@/components/icons/icon-columns-4";
import { IconColumns5 } from "@/components/icons/icon-columns-5";
import { useTranslation } from "react-i18next";
import { MENU_CLASSNAMES, ToolbarIconButton } from "../toolbar-primitives";

interface Props {
  editor: Editor;
}

export const QuickInsertsGroup: FC<Props> = ({ editor }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-0.5">
      <Tooltip label={t("Mention")} withArrow>
        <ToolbarIconButton
          aria-label={t("Mention")}
          onClick={() => editor.chain().focus().insertContent("@").run()}
        >
          <AtSign className="w-4 h-4" strokeWidth={2} />
        </ToolbarIconButton>
      </Tooltip>
      <Tooltip label={t("Emoji")} withArrow>
        <ToolbarIconButton
          aria-label={t("Emoji")}
          onClick={() => editor.chain().focus().insertContent(":").run()}
        >
          <SmilePlus className="w-4 h-4" strokeWidth={2} />
        </ToolbarIconButton>
      </Tooltip>
      <Menu shadow="md" position="bottom-start" withArrow={false} classNames={MENU_CLASSNAMES}>
        <Menu.Target>
          <Tooltip label={t("Columns")} withArrow>
            <ToolbarIconButton aria-label={t("Columns")}>
              <Columns2 className="w-4 h-4" strokeWidth={2} />
            </ToolbarIconButton>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<Columns2 className="w-4 h-4" strokeWidth={2} />}
            onClick={() =>
              editor.chain().focus().insertColumns({ layout: "two_equal" }).run()
            }
          >
            {t("{{count}} Columns", { count: 2 })}
          </Menu.Item>
          <Menu.Item
            leftSection={<Columns3 className="w-4 h-4" strokeWidth={2} />}
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertColumns({ layout: "three_equal" })
                .run()
            }
          >
            {t("{{count}} Columns", { count: 3 })}
          </Menu.Item>
          <Menu.Item
            leftSection={<IconColumns4 size={16} />}
            onClick={() =>
              editor.chain().focus().insertColumns({ layout: "four_equal" }).run()
            }
          >
            {t("{{count}} Columns", { count: 4 })}
          </Menu.Item>
          <Menu.Item
            leftSection={<IconColumns5 size={16} />}
            onClick={() =>
              editor.chain().focus().insertColumns({ layout: "five_equal" }).run()
            }
          >
            {t("{{count}} Columns", { count: 5 })}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Tooltip label={t("Table")} withArrow>
        <ToolbarIconButton
          aria-label={t("Table")}
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          <Table2 className="w-4 h-4" strokeWidth={2} />
        </ToolbarIconButton>
      </Tooltip>
    </div>
  );
};
