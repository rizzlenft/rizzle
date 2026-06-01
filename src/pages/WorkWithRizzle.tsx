import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Handshake, LineChart } from "lucide-react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { useSeo } from "@/hooks/useSeo";
import { track } from "@/lib/analytics";
import {
  HIRE_CONTACT_LINK,
  INVEST_CONTACT_LINK,
  PARTNER_CONTACT_LINK,
  STRIPE_CONSULT_LINK,
  TRINITY_LABS_URL,
} from "@/lib/site-links";

const pathways = [
  {
    title: "Hire",
    subtitle: "Leadership and operator roles",
    icon: Briefcase,
    points: [
      "Best for teams that need a senior operator to own launches, growth loops, and community outcomes.",
      "Roles: Head of Community, Ecosystem Growth, Program Ops, or hybrid operator positions.",
    ],
    cta: "Start Hiring Conversation",
    href: HIRE_CONTACT_LINK,
    trackEvent: "hire_path_clicked",
  },
  {
    title: "Partner",
    subtitle: "Launch and growth collaborations",
    icon: Handshake,
    points: [
      "Best for founders who want help shipping a launch, activation cycle, or community program quickly.",
      "Includes strategy sprint entry point and optional follow-on execution support.",
    ],
    cta: "Discuss Partnership",
    href: PARTNER_CONTACT_LINK,
    trackEvent: "partner_path_clicked",
  },
  {
    title: "Invest",
    subtitle: "Project and venture conversations",
    icon: LineChart,
    points: [
      "Best for investors looking at crypto-native products with strong community distribution angles.",
      "Current focus includes Trinity Labs and adjacent initiatives.",
    ],
    cta: "Start Investment Conversation",
    href: INVEST_CONTACT_LINK,
    trackEvent: "invest_path_clicked",
  },
];

const caseStudies = [
  {
    title: "The WIP Meetup",
    challenge:
      "Build a recurring crypto community format that survives market cycles and keeps people coming back.",
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
      "Translate early onchain experimentation into a category-defining project with long-tail relevance.",
    action:
      "Co-led positioning, launch support, and ecosystem storytelling around one of the early fully onchain PFP collections.",
    outcome: "Collection reached 4,000+ ETH in secondary volume and remains a known reference point.",
    linkLabel: "View Avastars Collection",
    linkHref: "https://opensea.io/collection/avastar",
  },
  {
    title: "Trinity Labs",
    challenge: "Create a cleaner token-launch model with practical liquidity mechanics for communities.",
    action:
      "Focused on product narrative, go-to-market framing, and ecosystem-facing rollout for a multi-pool Base protocol.",
    outcome: "Established active project foundation and opened a path for partnership and investor conversations.",
    linkLabel: "View Trinity Labs",
    linkHref: TRINITY_LABS_URL,
  },
];

const WorkWithRizzle = () => {
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

  return (
    <div className="relative min-h-screen bg-background">
      <TopNav activeTab="work" />
      <main id="main-content" className="mx-auto max-w-6xl px-6 py-10">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Start Here</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl">
            Hire, Partner, or Invest
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Pick the path that fits what you need right now. I’ll point you to the fastest next step.
          </p>
        </motion.header>

        <section className="grid gap-4 md:grid-cols-3">
          {pathways.map((path, index) => (
            <motion.article
              key={path.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm"
            >
              <div className="mb-4 flex items-center gap-2">
                <path.icon className="h-5 w-5 text-primary" />
                <h2 className="font-display text-2xl font-semibold text-foreground">{path.title}</h2>
              </div>
              <p className="mb-3 text-sm font-medium text-foreground/90">{path.subtitle}</p>
              <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                {path.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <a
                href={path.href}
                onClick={() => track(path.trackEvent, { location: "work_with_rizzle" })}
                className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {path.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.article>
          ))}
        </section>

        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-3">
            <h2 className="font-display text-3xl font-bold text-foreground">Selected Case Studies</h2>
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
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border border-border/60 bg-card/35 p-5"
              >
                <h3 className="mb-3 font-display text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Challenge: </span>
                  {item.challenge}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">What I did: </span>
                  {item.action}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Outcome: </span>
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
      </main>
      <Footer />
    </div>
  );
};

export default WorkWithRizzle;
