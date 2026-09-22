import { createServerFn } from "@tanstack/react-start";

// Serves the GA4 measurement ID stored in project secrets to the browser.
// Measurement IDs are public by design (they appear in page source anyway),
// but keeping the value in a secret means it is managed in one place.
export const getMeasurementId = createServerFn({ method: "GET" }).handler(
  async () => {
    const fromSecret = (process.env["GOOGLE_ANALYTICS_MEASUREMENT_ID"] ?? "").trim();
    if (fromSecret) return fromSecret;
    return null;
  },
);
