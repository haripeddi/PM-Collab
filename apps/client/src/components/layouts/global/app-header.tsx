import { Box, Group, Text, Tooltip } from "@mantine/core";
import classes from "./app-header.module.css";
import React from "react";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import {
  desktopSidebarAtom,
  mobileSidebarAtom,
} from "@/components/layouts/global/hooks/atoms/sidebar-atom.ts";
import { useToggleSidebar } from "@/components/layouts/global/hooks/hooks/use-toggle-sidebar.ts";
import SidebarToggle from "@/components/ui/sidebar-toggle-button.tsx";
import { useTranslation } from "react-i18next";

export function AppHeader() {
  const { t } = useTranslation();
  const [mobileOpened] = useAtom(mobileSidebarAtom);
  const toggleMobile = useToggleSidebar(mobileSidebarAtom);

  const [desktopOpened] = useAtom(desktopSidebarAtom);
  const toggleDesktop = useToggleSidebar(desktopSidebarAtom);

  return (
    <Group h="100%" px="md" justify="space-between" wrap={"nowrap"}>
      <Group wrap="nowrap">
        <Tooltip label={t("Sidebar toggle")}>
          <SidebarToggle
            aria-label={t("Sidebar toggle")}
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
        </Tooltip>

        <Tooltip label={t("Sidebar toggle")}>
          <SidebarToggle
            aria-label={t("Sidebar toggle")}
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />
        </Tooltip>

        <Link to="/home" className={classes.brand} aria-label="Product OS">
          <Box hiddenFrom="sm" className={classes.brandIcon}>
            <img
              src="/icons/favicon-32x32.png"
              alt="Product OS"
              width={22}
              height={22}
            />
          </Box>
          <Text
            size="lg"
            fw={600}
            style={{ userSelect: "none" }}
            visibleFrom="sm"
          >
            Product OS
          </Text>
        </Link>
      </Group>
    </Group>
  );
}
