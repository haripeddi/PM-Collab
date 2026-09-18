import { forwardRef } from "react";
import clsx from "clsx";

/**
 * Phenom-design-system replacements for Mantine's ActionIcon/Button used
 * throughout the fixed toolbar and the shared alignment/color selectors.
 * Menu/Popover/Tooltip positioning and a11y stay on Mantine (see
 * MENU_CLASSNAMES/POPOVER_CLASSNAMES below) — only the visual layer changes.
 */

type ToolbarIconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export const ToolbarIconButton = forwardRef<
  HTMLButtonElement,
  ToolbarIconButtonProps
>(({ active, className, disabled, style, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    disabled={disabled}
    style={style}
    className={clsx(
      "flex items-center justify-center w-8 h-8 shrink-0 rounded-[10px] border-0 bg-transparent transition-colors",
      active ? "bg-slate-200 text-[#27282C]" : "text-[#353B46] hover:bg-slate-100",
      disabled && "opacity-40 pointer-events-none",
      className,
    )}
    {...props}
  />
));
ToolbarIconButton.displayName = "ToolbarIconButton";

type ToolbarTextButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ToolbarTextButton = forwardRef<
  HTMLButtonElement,
  ToolbarTextButtonProps
>(({ className, style, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    style={style}
    className={clsx(
      "flex items-center gap-1 px-2.5 py-1.5 shrink-0 rounded-[10px] border-0 bg-transparent text-sm font-medium text-[#353B46] hover:bg-slate-100 transition-colors whitespace-nowrap",
      className,
    )}
    {...props}
  />
));
ToolbarTextButton.displayName = "ToolbarTextButton";

// Mantine Menu classNames override — keeps Menu's positioning/focus-trap/
// keyboard-nav behavior, replaces only the visual layer with Phenom tokens.
export const MENU_CLASSNAMES = {
  dropdown:
    "!rounded-2xl !border !border-slate-200 !bg-white !shadow-lg !p-1.5",
  item:
    "!rounded-[10px] !text-sm !font-medium !text-[#353B46] !px-2.5 !py-2 data-[hovered]:!bg-slate-100 data-[hovered]:!text-[#27282C]",
  itemSection: "!text-[#7A818C]",
  label:
    "!text-[11px] !font-semibold !uppercase !tracking-wide !text-[#7A818C] !px-2.5 !pt-2.5 !pb-1",
  divider: "!my-1.5 !border-slate-100",
};

export const POPOVER_CLASSNAMES = {
  dropdown:
    "!rounded-2xl !border !border-slate-200 !bg-white !shadow-lg !p-3",
};
