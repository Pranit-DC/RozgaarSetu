"use client";
import { useEffect } from "react";

// Dynamically load Material Web components on client only
export default function MaterialProvider() {
  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          import("@material/web/button/filled-button.js"),
          import("@material/web/button/outlined-button.js"),
          import("@material/web/icon/icon.js"),
          import("@material/web/progress/circular-progress.js"),
          import("@material/web/ripple/ripple.js"),
          import("@material/web/menu/menu.js"),
          import("@material/web/menu/menu-item.js"),
          import("@material/web/list/list.js"),
          import("@material/web/list/list-item.js"),
        ]);
      } catch (e) {
        console.warn("Material components failed to load", e);
      }
    })();
  }, []);
  return null;
}
