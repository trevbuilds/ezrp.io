import { createServerFn } from "@tanstack/react-start";

// The GA4 property EZRP reports against. Measurement IDs are public by design
// — they appear in page source — so this is the source of truth rather than a
// deployment secret, which can drift out of sync with the property in use.
const MEASUREMENT_ID = "G-EY3QYJ2SE5";

// Serves the GA4 measurement ID to the browser.
export const getMeasurementId = createServerFn({ method: "GET" }).handler(
  async () => MEASUREMENT_ID,
);
