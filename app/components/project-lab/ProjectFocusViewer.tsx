"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import styles from "./ProjectLab.module.css";

type ProjectFocusViewerProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

function tryRestoreFocus(candidate: HTMLElement | null) {
  if (!candidate || !candidate.isConnected) return false;
  if (candidate.closest("[inert]")) return false;
  if (candidate.closest('[hidden], [aria-hidden="true"]')) return false;

  const style = window.getComputedStyle(candidate);
  if (style.display === "none" || style.visibility === "hidden") return false;

  candidate.focus();
  return document.activeElement === candidate;
}

function restoreFocus(
  triggerRef: RefObject<HTMLButtonElement | null>,
  savedActiveElement: HTMLElement | null,
) {
  if (tryRestoreFocus(triggerRef.current)) return;
  tryRestoreFocus(savedActiveElement);
}

export function ProjectFocusViewer({
  open,
  title,
  children,
  onClose,
  triggerRef,
}: ProjectFocusViewerProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const savedActiveElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusableElements = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], video[controls], [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreFocus(triggerRef, savedActiveElement);
    };
  }, [onClose, open, triggerRef]);

  if (!open) return null;

  return createPortal(
    <div className={styles.focusBackdrop} role="presentation">
      <section
        ref={dialogRef}
        className={styles.focusDialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-focus-title"
      >
        <header className={styles.focusHeader}>
          <h2 id="project-focus-title">{title}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close fullscreen viewer"
          >
            ×
          </button>
        </header>
        <div className={styles.focusContent}>{children}</div>
      </section>
    </div>,
    document.body,
  );
}
