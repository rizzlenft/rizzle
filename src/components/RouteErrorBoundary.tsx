import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/** Catches render errors so one broken route doesn't white-screen the SPA. */
class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Route render error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
          <p className="font-mono text-sm text-primary">Something glitched</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-foreground">
            This page hit a snag
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Try reloading, or head back home — the rest of the site should still work.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 font-mono text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Reload
            </button>
            <Link
              to="/"
              className="rounded-full border border-border px-5 py-2.5 font-mono text-sm text-muted-foreground hover:text-foreground"
            >
              Go home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default RouteErrorBoundary;
