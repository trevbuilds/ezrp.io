const measurementId = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY;

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

function gtag(...args: unknown[]) {
  window.dataLayer.push(args);
}

let initialised = false;

export function initAnalytics() {
  if (initialised || !measurementId || typeof window === "undefined") return;
  initialised = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  gtag("js", new Date());
  gtag("config", measurementId);
}

export function trackPageView(path: string) {
  if (!initialised || typeof window === "undefined") return;
  gtag("event", "page_view", { page_path: path });
}
