"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.css";

interface TooltipProps {
  label: string;
  delay?: number;
  children: React.ReactNode;
}

const GAP = 6;
const VIEWPORT_PAD = 8;

export default function Tooltip({
  label,
  delay = 400,
  children,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [placement, setPlacement] = useState<"top" | "bottom">("top");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.top,
      left: rect.left + rect.width / 2,
    });
    setPlacement("top");
  }, []);

  const show = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setVisible(true);
    }, delay);
  }, [delay, updatePosition]);

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible || !tooltipRef.current || !triggerRef.current) return;

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const triggerRect = triggerRef.current.getBoundingClientRect();

    if (tooltipRect.top < VIEWPORT_PAD) {
      setPlacement("bottom");
      setCoords((prev) => ({
        ...prev,
        top: triggerRect.bottom,
      }));
    }

    if (tooltipRect.right > window.innerWidth - VIEWPORT_PAD) {
      setCoords((prev) => ({
        ...prev,
        left: prev.left - (tooltipRect.right - window.innerWidth + VIEWPORT_PAD),
      }));
    } else if (tooltipRect.left < VIEWPORT_PAD) {
      setCoords((prev) => ({
        ...prev,
        left: prev.left + (VIEWPORT_PAD - tooltipRect.left),
      }));
    }
  }, [visible]);

  const tooltip = visible
    ? createPortal(
        <span
          ref={tooltipRef}
          className={`${styles.tooltip} ${styles[placement]}`}
          role="tooltip"
          style={{
            top: placement === "top" ? coords.top - GAP : coords.top + GAP,
            left: coords.left,
          }}
        >
          {label}
        </span>,
        document.body
      )
    : null;

  return (
    <span
      ref={triggerRef}
      className={styles.wrapper}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {tooltip}
    </span>
  );
}
