import type { Project } from "../types/content";

export const PROJECTS: Project[] = [
  {
    id: "stock-agent",
    status: "shipped",
    tag: "agent: portfolio-analysis",
    title: "The stock agent that argues with me",
    story:
      "I built a Telegram agent that runs LLM-powered hold/sell analysis over my equity positions and pushes its recommendations to chat — with reasoning I can push back on. I built it because I kept making emotional decisions about stocks, and I wanted to see whether an agent could be the least emotional member of my portfolio committee.",
    learned: "Building an agent for a decision you personally care about teaches you more than ten demos.",
    links: [{ label: "GitHub", href: "https://github.com/Krishna-Baldwa/StockAnalyser" }],
  },
  {
    id: "enterprise-copilot",
    status: "shipped",
    tag: "agents: 5+ orchestrated",
    title: "Enterprise copilot, many brains",
    story:
      "At work I helped architect a multi-agent copilot — one master agent orchestrating specialized sub-agents over different consumer-data signals, so brand teams can just ask instead of dig. I built one of the sub-agents end to end: retrieval design, prompts, evals, integrations. It's live in pilot across 10+ brand categories.",
    learned: "The hard part of agents isn't the model — it's deciding what \"correct\" means and testing for it.",
  },
  {
    id: "rag-startup",
    status: "archived",
    tag: "retrieval: chemical-industry",
    title: "A RAG startup, before it was cool",
    story:
      "In final year I co-founded a vertical AI startup unifying chemical R&D literature and compliance documents into one retrieval layer. We ran 20+ customer discovery interviews and won a ₹5 lakh non-dilutive grant from IIT Bombay's incubation program. Then generalist AI search products matured faster than our vertical moat did, and we shut it down on purpose.",
    learned: "A good idea with bad timing is indistinguishable from a bad idea — until you do the post-mortem honestly.",
    links: [
      { label: "Frontend", href: "https://github.com/Krishna-Baldwa/orins-frontend" },
      { label: "Backend", href: "https://github.com/Krishna-Baldwa/orins-backend" },
    ],
  },
  {
    id: "instiapp",
    status: "shipped",
    tag: "users: 10,000+",
    title: "InstiApp — an app for a whole campus",
    story:
      "As project lead of IIT Bombay's developer community, I owned the institute super-app used by 10K+ students — leading 25+ developers, shipping a buy-and-sell marketplace and in-map campus navigation, and learning that roadmap arguments between 25 smart people are a product skill of their own.",
    learned: "Users don't care what your team argued about. They care that the app opens fast.",
    links: [{ label: "Live app", href: "https://www.insti.app/feed" }],
  },
  {
    id: "loom-dashboard",
    status: "paused",
    tag: "hardware: loom-sensors",
    title: "The loom dashboard",
    story:
      "An early-stage concept from where it all started: a mobile dashboard for textile loom owners — like my father — to watch production output and efficiency in real time. It's a sketch and a conviction, not a product yet. Paused deliberately while other builds take priority; some ideas wait for their moment.",
    learned: "The problems you grew up next to are the ones you understand at a level no market research can reach.",
  },
];
