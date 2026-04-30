import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, trackPageview } from "@/lib/analytics";

/**
 * Mount once inside <BrowserRouter>. Initializes PostHog on first render and
 * fires a $pageview event whenever the route (path or query) changes.
 */
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageview(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsTracker;
