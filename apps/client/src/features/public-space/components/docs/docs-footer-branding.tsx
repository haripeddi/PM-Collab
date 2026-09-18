import clsx from "clsx";
import styles from "./docs.module.css";

export default function DocsFooterBranding({
  className,
}: {
  className?: string;
}) {
  return (
    <footer className={clsx(styles.footer, className)}>
      <span className={styles.footerBranding}>Powered by Product OS</span>
    </footer>
  );
}
