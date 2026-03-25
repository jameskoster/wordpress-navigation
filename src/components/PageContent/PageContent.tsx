import styles from "./PageContent.module.css";
import type { ReactNode } from "react";

interface PageContentProps {
  children?: ReactNode;
}

export default function PageContent({ children }: PageContentProps) {
  return (
    <div className={styles.content}>
      <div className={styles.card}>
        {children || (
          <div className={styles.placeholder}>
            <div className={styles.placeholderLine} style={{ width: "80%" }} />
            <div className={styles.placeholderLine} style={{ width: "65%" }} />
            <div className={styles.placeholderLine} style={{ width: "90%" }} />
            <div className={styles.placeholderLine} style={{ width: "45%" }} />
          </div>
        )}
      </div>
    </div>
  );
}
