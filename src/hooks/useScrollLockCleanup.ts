import { useEffect } from "react";

/**
 * Safety net: periodically removes stale scroll-lock artifacts left behind
 * by react-remove-scroll (used inside Radix Dialog/Sheet/AlertDialog).
 *
 * HMR, fast open/close cycles, or unmount timing issues can leave
 * data-scroll-locked attributes and overflow:hidden on html/body,
 * permanently blocking wheel scrolling even though no dialog is open.
 */
export function useScrollLockCleanup() {
  useEffect(() => {
    const cleanup = () => {
      // If any dialog/sheet is genuinely open, don't touch anything
      const hasOpenOverlay = document.querySelector(
        "[data-state='open'][role='dialog'], [data-state='open'][role='alertdialog']"
      );
      if (hasOpenOverlay) return;

      const html = document.documentElement;
      const body = document.body;

      // Remove stale data-scroll-locked attribute
      if (html.hasAttribute("data-scroll-locked")) {
        html.removeAttribute("data-scroll-locked");
      }

      // Remove react-remove-scroll injected classes
      const staleClasses = Array.from(body.classList).filter(
        (cls) => cls.startsWith("block-interactivity") || cls.startsWith("allow-interactivity")
      );
      if (staleClasses.length > 0) {
        body.classList.remove(...staleClasses);
      }

      // Reset overflow if it was forced to hidden with no open overlay
      if (html.style.overflow === "hidden") {
        html.style.overflow = "";
      }
      if (body.style.overflow === "hidden") {
        body.style.overflow = "";
      }
    };

    const id = setInterval(cleanup, 2000);
    // Also run once immediately
    cleanup();

    return () => clearInterval(id);
  }, []);
}
