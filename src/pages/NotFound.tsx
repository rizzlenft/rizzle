import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";

const NotFound = () => {
  const location = useLocation();

  useSeo({
    title: "404 — Page Not Found | Rizzle",
    description: "The page you're looking for doesn't exist. Head back to the Rizzle homepage.",
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[180px]" />
        <div className="absolute -right-20 -bottom-20 h-[400px] w-[400px] rounded-full bg-accent/6 blur-[140px]" />
      </div>

      <div className="relative z-10 text-center">
        <p className="font-mono text-sm text-primary mb-2">ERROR 404</p>
        <h1 className="mb-4 font-display text-6xl font-bold text-foreground sm:text-7xl text-glow-sm">
          Page not found
        </h1>
        <p className="mb-8 text-muted-foreground max-w-md mx-auto">
          Looks like this URL is rugged. Let's get you back to something real.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 font-mono text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to rizzle.io
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
