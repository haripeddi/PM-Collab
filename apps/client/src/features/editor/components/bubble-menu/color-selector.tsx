import React, { Dispatch, FC, SetStateAction } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Popover, Tooltip } from "@mantine/core";
import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { useTranslation } from "react-i18next";
import { isEditorReady } from "@docmost/editor-ext";
import { POPOVER_CLASSNAMES } from "../fixed-toolbar/toolbar-primitives";

export interface BubbleColorMenuItem {
  name: string;
  color: string;
}

interface ColorSelectorProps {
  editor: Editor | null;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
  {
    name: "Default",
    color: "",
  },
  {
    name: "Blue",
    color: "#2563EB",
  },
  {
    name: "Green",
    color: "#008A00",
  },
  {
    name: "Purple",
    color: "#9333EA",
  },
  {
    name: "Red",
    color: "#E00000",
  },
  {
    name: "Yellow",
    color: "#EAB308",
  },
  {
    name: "Orange",
    color: "#FFA500",
  },
  {
    name: "Pink",
    color: "#BA4081",
  },
  {
    name: "Gray",
    color: "#A8A29E",
  },
  {
    name: "Brown",
    color: "#92400E",
  },
];

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
  {
    name: "Default",
    color: "",
  },
  {
    name: "Blue",
    color: "#98d8f2",
  },
  {
    name: "Green",
    color: "#7edb6c",
  },
  {
    name: "Purple",
    color: "#e0d6ed",
  },
  {
    name: "Red",
    color: "#ffc6c2",
  },
  {
    name: "Yellow",
    color: "#faf594",
  },
  {
    name: "Orange",
    color: "#f5c8a9",
  },
  {
    name: "Pink",
    color: "#f5cfe0",
  },
  {
    name: "Gray",
    color: "#dfdfd7",
  },
  {
    name: "Brown",
    color: "#d7c4b7",
  },
];

const COLOR_GRID_COLS = 5;

function focusSwatch(grid: "text" | "highlight", index: number) {
  const el = document.querySelector<HTMLElement>(
    `[data-color-grid="${grid}"][data-color-index="${index}"]`,
  );
  el?.focus();
}

function handleColorKeyNav(
  e: React.KeyboardEvent<HTMLDivElement>,
  index: number,
  grid: "text" | "highlight",
) {
  const cols = COLOR_GRID_COLS;
  const total = grid === "text" ? TEXT_COLORS.length : HIGHLIGHT_COLORS.length;
  const col = index % cols;

  if (e.key === "ArrowRight") {
    e.preventDefault();
    if (index < total - 1) focusSwatch(grid, index + 1);
    return;
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    if (index > 0) focusSwatch(grid, index - 1);
    return;
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    const next = index + cols;
    if (next < total) {
      focusSwatch(grid, next);
    } else if (grid === "text") {
      focusSwatch("highlight", Math.min(col, HIGHLIGHT_COLORS.length - 1));
    } else if (grid === "highlight") {
      document
        .querySelector<HTMLElement>('[data-color-grid="remove"]')
        ?.focus();
    }
    return;
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    const prev = index - cols;
    if (prev >= 0) {
      focusSwatch(grid, prev);
    } else if (grid === "highlight") {
      const lastRowStart = Math.floor((TEXT_COLORS.length - 1) / cols) * cols;
      focusSwatch("text", Math.min(lastRowStart + col, TEXT_COLORS.length - 1));
    }
    return;
  }
}

export const ColorSelector: FC<ColorSelectorProps> = ({
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

      const activeColors: Record<string, boolean> = {};
      TEXT_COLORS.forEach(({ color }) => {
        activeColors[`text_${color}`] = ctx.editor.isActive("textStyle", {
          color,
        });
      });
      HIGHLIGHT_COLORS.forEach(({ color }) => {
        activeColors[`highlight_${color}`] = ctx.editor.isActive("highlight", {
          color,
        });
      });

      return activeColors;
    },
  });

  if (!editor || !editorState) {
    return null;
  }

  const activeColorItem = TEXT_COLORS.find(
    ({ color }) => editorState[`text_${color}`],
  );

  const activeHighlightItem = HIGHLIGHT_COLORS.find(
    ({ color }) => editorState[`highlight_${color}`],
  );

  return (
    <Popover
      width={220}
      opened={isOpen}
      onChange={setIsOpen}
      trapFocus
      withArrow
      classNames={POPOVER_CLASSNAMES}
    >
      <Popover.Target>
        <Tooltip label={t("Text color")} withArrow withinPortal={false}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsOpen(!isOpen)}
            data-text-color={activeColorItem?.color || ""}
            data-highlight-color={activeHighlightItem?.color || ""}
            className="color-selector-trigger flex items-center gap-0.5 h-8 px-1.5 shrink-0 rounded-[10px] border-0 bg-transparent text-base font-medium text-[#353B46] hover:bg-slate-100 transition-colors"
            aria-label={t("Text color")}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
          >
            A
            <ChevronDown className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
          </button>
        </Tooltip>
      </Popover.Target>

      <Popover.Dropdown onMouseDown={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-4 p-0.5">
          <div>
            <p className="text-sm font-semibold text-[#27282C] mb-2">
              {t("Text color")}
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {TEXT_COLORS.map(({ name, color }, index) => {
                const applyTextColor = () => {
                  if (!isEditorReady(editor)) return;
                  if (name === "Default") {
                    editor.commands.unsetColor();
                  } else {
                    editor
                      .chain()
                      .focus()
                      .setColor(color || "")
                      .run();
                  }
                  setIsOpen(false);
                };
                return (
                  <Tooltip key={index} label={t(name)} withArrow>
                    <div
                      role="button"
                      tabIndex={0}
                      data-autofocus={index === 0 ? true : undefined}
                      data-color-grid="text"
                      data-color-index={index}
                      aria-label={t(name)}
                      aria-pressed={!!editorState[`text_${color}`]}
                      onClick={applyTextColor}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          applyTextColor();
                          return;
                        }
                        handleColorKeyNav(e, index, "text");
                      }}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-base font-semibold cursor-pointer relative"
                      style={{
                        border: editorState[`text_${color}`]
                          ? "2px solid #27282C"
                          : "1px solid #E2E8F0",
                        color: color || "#464F5E",
                      }}
                    >
                      A
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#27282C] mb-2">
              {t("Highlight color")}
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {HIGHLIGHT_COLORS.map(({ name, color }, index) => {
                const applyHighlight = () => {
                  if (!isEditorReady(editor)) return;
                  if (name === "Default") {
                    editor.commands.unsetHighlight();
                  } else {
                    editor
                      .chain()
                      .focus()
                      .toggleMark("highlight", {
                        color: color || "",
                        colorName: name.toLowerCase() || "",
                      })
                      .run();
                  }
                  setIsOpen(false);
                };
                return (
                  <Tooltip key={index} label={t(name)} withArrow>
                    <div
                      role="button"
                      tabIndex={0}
                      data-color-grid="highlight"
                      data-color-index={index}
                      aria-label={t(name)}
                      aria-pressed={!!editorState[`highlight_${color}`]}
                      onClick={applyHighlight}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          applyHighlight();
                          return;
                        }
                        handleColorKeyNav(e, index, "highlight");
                      }}
                      className="w-7 h-7 rounded flex items-center justify-center text-base font-semibold cursor-pointer relative border border-slate-200"
                      style={{
                        backgroundColor: color || "#F1F5F9",
                        color: "#27282C",
                      }}
                    >
                      {editorState[`highlight_${color}`] ? (
                        <Check className="w-4 h-4 text-emerald-700" strokeWidth={2} />
                      ) : (
                        "A"
                      )}
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            data-color-grid="remove"
            onClick={() => {
              if (isEditorReady(editor)) {
                editor.commands.unsetColor();
                editor.commands.unsetHighlight();
              }
              setIsOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                const lastRowStart =
                  Math.floor((HIGHLIGHT_COLORS.length - 1) / COLOR_GRID_COLS) *
                  COLOR_GRID_COLS;
                focusSwatch("highlight", lastRowStart);
              }
            }}
            className="w-full px-4 py-2.5 rounded-[10px] bg-slate-100 text-[#353B46] text-sm font-medium hover:bg-[#E8EAEE] transition-colors"
          >
            {t("Remove color")}
          </button>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};
