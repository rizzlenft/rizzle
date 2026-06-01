import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/useSeo";

const NotFound = () => {
  const location = useLocation();

  useSeo({
    title: "404 — Page Not Found | Rizzle",
    description: "The page you're looking for doesn't exist. Head back to the Rizzle homepage.",
    canonical: "https://rizzle.io/",
    noindex: true,
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[180px]" />
        <div className="absolute -right-20 -bottom-20 h-[400px] w-[400px] rounded-full bg-accent/6 blur-[140px]" />
      </div>

      <TopNav />
      <main id="main-content" className="relative z-10 page-container section-y flex min-h-[calc(100vh-72px)] items-center justify-center">
        <div className="text-center">
          <p className="mb-2 font-mono text-sm text-primary">ERROR 404</p>
          <h1 className="mb-4 font-display text-5xl font-bold text-foreground text-glow-sm sm:text-6xl">
            Page not found
          </h1>
          <p className="mx-auto mb-8 max-w-md text-muted-foreground">
            Looks like this URL is rugged. Let&apos;s get you back to something real.
          </p>
          <Button asChild variant="cta-outline" size="pill" className="gap-2 font-mono text-sm font-semibold">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to rizzle.io
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
