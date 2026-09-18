import { FC } from "react";
import { Sparkles } from "lucide-react";
import { useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { showAiMenuAtom } from "@/features/editor/atoms/editor-atoms";
import { ToolbarTextButton } from "../toolbar-primitives";

export const AskAiGroup: FC = () => {
  const { t } = useTranslation();
  const setShowAiMenu = useSetAtom(showAiMenuAtom);

  return (
    <ToolbarTextButton onClick={() => setShowAiMenu(true)}>
      <Sparkles className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
      {t("Ask AI")}
    </ToolbarTextButton>
  );
};
