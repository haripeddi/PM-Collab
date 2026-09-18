import { FC } from "react";
import type { Editor } from "@tiptap/react";
import { Menu, Tooltip } from "@mantine/core";
import { FileText, Film, Music, Paperclip, Image } from "lucide-react";
import { useTranslation } from "react-i18next";
import { uploadImageAction } from "@/features/editor/components/image/upload-image-action";
import { uploadVideoAction } from "@/features/editor/components/video/upload-video-action";
import { uploadAudioAction } from "@/features/editor/components/audio/upload-audio-action";
import { uploadAttachmentAction } from "@/features/editor/components/attachment/upload-attachment-action";
import { uploadPdfAction } from "@/features/editor/components/pdf/upload-pdf-action";
import { MENU_CLASSNAMES, ToolbarIconButton } from "../toolbar-primitives";

interface Props {
  editor: Editor;
  templateMode?: boolean;
}

type UploadFn = (
  file: File,
  editor: Editor,
  pos: number,
  pageId: string,
  ...rest: any[]
) => void;

function pickFile(
  editor: Editor,
  accept: string,
  multiple: boolean,
  upload: UploadFn,
  extra?: boolean,
) {
  // @ts-ignore — editor.storage.pageId is set by PageEditor.onCreate
  const pageId = editor.storage?.pageId as string | undefined;
  if (!pageId) return;

  const input = document.createElement("input");
  input.type = "file";
  input.accept = accept;
  input.multiple = multiple;
  input.style.display = "none";
  document.body.appendChild(input);
  input.onchange = () => {
    if (input.files?.length) {
      for (const file of input.files) {
        const pos = editor.view.state.selection.from;
        if (extra !== undefined) {
          upload(file, editor, pos, pageId, extra);
        } else {
          upload(file, editor, pos, pageId);
        }
      }
    }
    input.remove();
  };
  input.click();
}

export const MediaGroup: FC<Props> = ({ editor, templateMode }) => {
  const { t } = useTranslation();

  return (
    <Menu shadow="md" position="bottom-start" withArrow={false} classNames={MENU_CLASSNAMES}>
      <Menu.Target>
        <Tooltip label={t("Insert media")} withArrow>
          <ToolbarIconButton aria-label={t("Insert media")}>
            <Image className="w-4 h-4" strokeWidth={2} />
          </ToolbarIconButton>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        {!templateMode && (
          <Menu.Item
            leftSection={<Image className="w-4 h-4" strokeWidth={2} />}
            onClick={() => pickFile(editor, "image/*", true, uploadImageAction)}
          >
            {t("Image")}
          </Menu.Item>
        )}
        {!templateMode && (
          <Menu.Item
            leftSection={<Film className="w-4 h-4" strokeWidth={2} />}
            onClick={() => pickFile(editor, "video/*", true, uploadVideoAction)}
          >
            {t("Video")}
          </Menu.Item>
        )}
        {!templateMode && (
          <Menu.Item
            leftSection={<Music className="w-4 h-4" strokeWidth={2} />}
            onClick={() => pickFile(editor, "audio/*", true, uploadAudioAction)}
          >
            {t("Audio")}
          </Menu.Item>
        )}
        <Menu.Item
          leftSection={<FileText className="w-4 h-4" strokeWidth={2} />}
          onClick={() =>
            pickFile(editor, "application/pdf", false, uploadPdfAction)
          }
        >
          PDF
        </Menu.Item>
        {!templateMode && (
          <Menu.Item
            leftSection={<Paperclip className="w-4 h-4" strokeWidth={2} />}
            onClick={() =>
              pickFile(editor, "", true, uploadAttachmentAction, true)
            }
          >
            {t("File attachment")}
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
