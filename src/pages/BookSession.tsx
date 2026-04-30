import { motion } from "framer-motion";
import { CheckCircle2, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { useSeo } from "@/hooks/useSeo";

const BookSession = () => {
  useSeo({
    title: "Booking Confirmed | Rizzle",
    description: "Your Web3 consultation with Rizzle is confirmed. Check your email for next steps.",
    canonical: "https://rizzle.io/book-session",
    image: "https://rizzle.io/og/og-book.jpg",
    // No JSON-LD for the private thank-you page (noindex worthy, but at least no schema noise).
  });

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient bg */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[180px]" />
        <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-accent/6 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-primary/5 blur-[160px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-lg w-full rounded-2xl border border-primary/30 bg-card/80 backdrop-blur-sm p-8 text-center box-glow-sm"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Payment Confirmed!
          </h1>
          <p className="text-muted-foreground mb-6">
            Thank you for booking a Web3 consultation with Rizzle.
          </p>

          <div className="rounded-xl border border-border/50 bg-secondary/30 p-5 space-y-3 text-left">
            <h2 className="font-mono text-sm font-semibold text-foreground">What happens next?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Rizzle will reach out within <span className="text-primary font-medium">24 hours</span> to schedule your 45-minute session. Keep an eye on the email you used at checkout.
            </p>
            <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Questions? Reach out directly:</p>
                <a
                  href="mailto:rizzlenft@gmail.com"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  rizzlenft@gmail.com
                </a>
              </div>
            </div>
          </div>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/30 px-5 py-2.5 font-mono text-sm text-muted-foreground transition-all hover:text-foreground hover:border-primary/30"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to rizzle.io
          </Link>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default BookSession;
