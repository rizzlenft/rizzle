import { motion } from "framer-motion";
import { FormEvent, useMemo, useRef, useState } from "react";
import { ArrowRight, Briefcase, Handshake, LineChart, LucideIcon } from "lucide-react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSeo } from "@/hooks/useSeo";
import { track } from "@/lib/analytics";
import {
  CONTACT_API_PATH,
  STRIPE_CONSULT_LINK,
  TRINITY_LABS_URL,
} from "@/lib/site-links";

type ContactIntent = "hire" | "partner" | "invest";

type Pathway = {
  intent: ContactIntent;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  points: string[];
  cta: string;
  trackEvent: string;
};

const pathways: Pathway[] = [
  {
    intent: "hire",
    title: "Hire",
    subtitle: "Operator and leadership roles",
    icon: Briefcase,
    points: [
      "Bring me in to run launches, growth programs, and community operations end to end.",
      "Typical scope: Head of Community, Ecosystem Growth, Program Ops, or a cross-functional operator role.",
    ],
    cta: "Talk Hiring",
    trackEvent: "hire_path_clicked",
  },
  {
    intent: "partner",
    title: "Partner",
    subtitle: "Launch and growth collaboration",
    icon: Handshake,
    points: [
      "For founders who want a hands-on collaborator for launch strategy and execution.",
      "Start with a sprint if helpful, then continue into implementation support.",
    ],
    cta: "Talk Partnership",
    trackEvent: "partner_path_clicked",
  },
  {
    intent: "invest",
    title: "Invest",
    subtitle: "Project and venture opportunities",
    icon: LineChart,
    points: [
      "For investors focused on crypto-native products with strong distribution and community fit.",
      "Current conversations center on Trinity Labs and related opportunities.",
    ],
    cta: "Talk Investment",
    trackEvent: "invest_path_clicked",
  },
];

const caseStudies = [
  {
    title: "The WIP Meetup",
    challenge:
      "Build a recurring crypto community format that could survive market cycles and keep people engaged.",
    action:
      "Built weekly programming cadence, guest pipeline, and event format across live sessions, content, and miniapp touchpoints.",
    outcome:
      "Sustained from 2019 through multiple cycles with consistent activation and recurring audience participation.",
    linkLabel: "View The WIP Meetup",
    linkHref: "https://thewipmeetup.com/",
  },
  {
    title: "Avastars / nft42",
    challenge:
      "Build a studio model that could prove fully onchain metadata at scale and attract high-profile launch partners.",
    action:
      "Co-founded nft42 as an NFT studio focused on fully onchain metadata, with Avastars as an early flagship and later launches with celebrity collaborators.",
    outcome:
      "Helped establish nft42 as a pioneering studio in onchain NFT infrastructure, while Avastars reached 4,000+ ETH in secondary volume.",
    linkLabel: "View Avastars Collection",
    linkHref: "https://opensea.io/collection/avastar",
  },
  {
    title: "Trinity Labs",
    challenge: "Create a cleaner token launch model with practical liquidity mechanics for communities.",
    action:
      "Focused on product narrative, go-to-market framing, and ecosystem-facing rollout for a multi-pool Base protocol.",
    outcome: "Established a strong project foundation and opened the door for partnership and investor conversations.",
    linkLabel: "View Trinity Labs",
    linkHref: TRINITY_LABS_URL,
  },
];

const WorkWithRizzle = () => {
  const [intent, setIntent] = useState<ContactIntent>("hire");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

  const attribution = useMemo(
    () => ({
      landingPath: window.location.pathname + window.location.search,
      referrer: document.referrer || "direct",
      utmSource: new URLSearchParams(window.location.search).get("utm_source") || undefined,
      utmMedium: new URLSearchParams(window.location.search).get("utm_medium") || undefined,
      utmCampaign: new URLSearchParams(window.location.search).get("utm_campaign") || undefined,
    }),
    [],
  );

  useSeo({
    title: "Work With Rizzle | Hire, Partner, or Invest",
    description:
      "Three ways to work with Rizzle: hiring, partnerships, and investment conversations. Includes focused case studies and direct next steps.",
    canonical: "https://rizzle.io/work-with-rizzle",
    image: "https://rizzle.io/og/og-home.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": "https://rizzle.io/work-with-rizzle#service",
      name: "Rizzle Operator Services",
      url: "https://rizzle.io/work-with-rizzle",
      provider: { "@id": "https://rizzle.io/#person" },
      areaServed: "Worldwide",
      serviceType: ["Hiring", "Partnerships", "Investment conversations"],
      offers: [
        {
          "@type": "Offer",
          name: "Strategy Sprint",
          url: STRIPE_CONSULT_LINK,
          priceCurrency: "USD",
        },
      ],
    },
  });

  const jumpToForm = (selectedIntent: ContactIntent, eventName: string) => {
    setIntent(selectedIntent);
    setFeedback(null);
    track(eventName, { location: "work_with_rizzle" });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setFeedback({ type: "error", text: "Please complete all required fields." });
      return;
    }

    const tokenInput = document.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]');
    const turnstileToken = tokenInput?.value;
    if (turnstileSiteKey && !turnstileToken) {
      setFeedback({ type: "error", text: "Please complete the security check." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(CONTACT_API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent,
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          website: website.trim(),
          turnstileToken,
          attribution,
        }),
      });

      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(payload.error || "Failed to send inquiry");
      }

      setFeedback({
        type: "success",
        text: "Message sent. Rizzle will reply as soon as possible.",
      });
      setName("");
      setEmail("");
      setMessage("");
      setWebsite("");
      track("contact_form_submitted", { intent, location: "work_with_rizzle" });
      // Only reset when a Turnstile widget is actually mounted. Calling
      // turnstile.reset() with no widget throws and overwrote success UX.
      if (turnstileSiteKey) {
        try {
          const turnstile = (
            window as Window & {
              turnstile?: { reset: (widget?: HTMLElement | string) => void };
            }
          ).turnstile;
          const widget = formRef.current?.querySelector<HTMLElement>(".cf-turnstile");
          if (turnstile && widget) turnstile.reset(widget);
        } catch {
          // Ignore Turnstile reset failures; the message already sent.
        }
      }
    } catch (err) {
      setFeedback({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Could not send message right now. Please try again shortly.",
      });
      track("contact_form_failed", { intent, location: "work_with_rizzle" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <TopNav activeTab="work" />
      <main id="main-content" className="page-container section-y">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto mb-8 max-w-3xl text-center sm:mb-10"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Start Here</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-5xl">
            Hire, Partner, or Invest
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            If you're hiring, building, or investing, reach out here and I'll follow up directly.
          </p>
        </motion.header>

        <section className="grid gap-4 md:grid-cols-3">
          {pathways.map((path, index) => (
            <motion.article
              key={path.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              className="surface-glass-strong p-5"
            >
              <div className="mb-4 flex items-center gap-2">
                <path.icon className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">{path.title}</h2>
              </div>
              <p className="mb-3 text-sm font-medium text-foreground/90">{path.subtitle}</p>
              <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                {path.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <Button
                type="button"
                variant="cta-outline"
                size="pill"
                onClick={() => jumpToForm(path.intent, path.trackEvent)}
                className="mt-5 w-full sm:w-auto"
              >
                {path.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.article>
          ))}
        </section>

        <section className="mt-10 sm:mt-12">
          <div className="mb-5 flex items-end justify-between gap-3">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Selected Case Studies</h2>
            <a
              href={STRIPE_CONSULT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("consult_cta_clicked", { location: "work_with_rizzle" })}
              className="text-sm text-primary hover:underline"
            >
              Prefer a strategy sprint first?
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {caseStudies.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
                className="surface-glass p-5"
              >
                <h3 className="mb-3 font-display text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Context: </span>
                  {item.challenge}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">My role: </span>
                  {item.action}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Impact: </span>
                  {item.outcome}
                </p>
                <a
                  href={item.linkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("case_study_link_clicked", { study: item.title })}
                  className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  {item.linkLabel}
                </a>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="contact-form" className="mt-10 sm:mt-12">
          <div className="surface-glass-strong mx-auto max-w-3xl p-6 sm:p-7">
            <h2 className="font-display text-3xl font-bold text-foreground">Send a Private Inquiry</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Messages are handled server-side, so your contact details stay off public page source.
            </p>

            <form ref={formRef} className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div>
                <Label className="mb-1 block text-foreground" htmlFor="intent">
                  Inquiry type
                </Label>
                <Select value={intent} onValueChange={(value) => setIntent(value as ContactIntent)}>
                  <SelectTrigger id="intent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hire">Hire</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="invest">Invest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-1 block text-foreground" htmlFor="name">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-foreground" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="mb-1 block text-foreground" htmlFor="message">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={7}
                  required
                />
              </div>

              {/* Honeypot field for basic bot filtering (kept visually hidden). */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {turnstileSiteKey && (
                <div
                  className="cf-turnstile"
                  data-sitekey={turnstileSiteKey}
                  data-theme="dark"
                />
              )}

              {feedback && (
                <p
                  className={`text-sm ${feedback.type === "success" ? "text-primary" : "text-destructive"}`}
                  role="status"
                >
                  {feedback.text}
                </p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                variant="cta-primary"
                size="pill"
              >
                {submitting ? "Sending..." : "Send Inquiry"}
              </Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WorkWithRizzle;
