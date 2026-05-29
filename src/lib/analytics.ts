// Thin wrapper around posthog-js. All calls are safe no-ops if init hasn't run
// or if PostHog fails to load — so analytics can never break the app.
import posthog from "posthog-js";

const POSTHOG_KEY = "phc_o3dHbRrb3K4WxmWv47bqHUqfLcBBiXYB9TkW426VvNfr";
const POSTHOG_HOST = "https://us.i.posthog.com";

let initialized = false;

export function initAnalytics() {
  if (initialized || typeof window === "undefined" || !import.meta.env.PROD) return;
  try {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: false, // we'll capture manually on route change
      capture_pageleave: true,
      autocapture: false, // we use explicit events for clean reporting
      disable_session_recording: true,
    });
    initialized = true;
  } catch (e) {
    // swallow — analytics must never break the app
    console.warn("[analytics] init failed", e);
  }
}

export function trackPageview(path?: string) {
  if (!initialized) return;
  try {
    posthog.capture("$pageview", {
      $current_url: typeof window !== "undefined" ? window.location.href : path,
    });
  } catch {
    /* noop */
  }
}

export function track(event: string, props?: Record<string, unknown>) {
  if (!initialized) return;
  try {
    posthog.capture(event, props);
  } catch {
    /* noop */
  }
}
