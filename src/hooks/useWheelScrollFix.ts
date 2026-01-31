import { useEffect } from "react";

/**
 * Fixes cases where a global/document wheel listener accidentally prevents
 * normal page scrolling with the mouse wheel.
 *
 * Strategy:
 * - Listen in the *bubble* phase so target-level wheel handlers (e.g. maps,
 *   scroll areas) run normally.
 * - Stop immediate propagation on the document to prevent later global wheel
 *   listeners from calling preventDefault() and killing scrolling.
 */
export function useWheelScrollFix() {
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // Let zoom gestures / browser default behaviors work normally.
      // (We only want to prevent other global handlers from interfering.)
      e.stopImmediatePropagation();
    };

    // Bubble phase on document.
    document.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      document.removeEventListener("wheel", onWheel);
    };
  }, []);
}
