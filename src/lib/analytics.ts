import { getMeasurementId } from "./analytics.functions";

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

function gtag(...args: unknown[]) {
  window.dataLayer.push(args);
}

let initialised = false;
let pendingPath: string | null = null;

export function initAnalytics() {
  if (initialised || typeof window === "undefined") return;
  initialised = true;

  void getMeasurementId()
    .then((measurementId) => {
      if (!measurementId) return;

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      gtag("js", new Date());
      gtag("config", measurementId);

      if (pendingPath) {
        gtag("event", "page_view", { page_path: pendingPath });
        pendingPath = null;
      }
    })
    .catch(() => {
      // Analytics is best-effort; never block the app on it.
    });
}

export function trackPageView(path: string) {
  if (typeof window === "undefined") return;
  if (!initialised) {
    pendingPath = path;
    return;
  }
  gtag("event", "page_view", { page_path: path });
}
