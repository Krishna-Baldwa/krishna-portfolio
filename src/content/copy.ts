import type {
  BroadcastContent,
  ConnectContent,
  HeroContent,
  LifeContent,
  NavStep,
  NotebookContent,
  NowContent,
  StoryContent,
} from "../types/content";

export const NAV_STEPS: NavStep[] = [
  { id: "top", label: "Top", system: "boot" },
  { id: "story", label: "Story", system: "context" },
  { id: "builds", label: "Builds", system: "tool_calls" },
  { id: "notebook", label: "Notebook", system: "beliefs" },
  { id: "broadcast", label: "@inthe_blur", system: "broadcast" },
  { id: "life", label: "Life", system: "state" },
  { id: "now", label: "Now", system: "process" },
  { id: "connect", label: "Say hi", system: "connect()" },
];

export const HERO: HeroContent = {
  planLine: "> plan: introduce krishna → show what she builds → say hi",
  name: "Krishna Baldwa",
  role: "AI Product Builder",
  credibility: "IIT Bombay engineer · multi-agent AI systems at enterprise scale · creator of @inthe_blur · Mumbai",
  tagline: "I build with AI — and think out loud about it.",
};

export const STORY: StoryContent = {
  paragraphs: [
    "I grew up in Ichalkaranji, inside my father's textile manufacturing world — yarn in, fabric out, a dozen moving parts in between. I didn't know the word \"systems\" yet, but I remember constantly thinking: someone should really instrument all of this.",
    "At IIT Bombay I studied chemical engineering on paper and built software in practice. I led one of the institute's largest developer communities and shipped features on an app that ten thousand students carried in their pockets. That's where I learned I care less about any one technology and more about the moment a thing I built becomes something people actually use.",
    "I tried founding twice before graduating. The first venture made real money building apps and websites for clients — and ended over a co-founder conflict that taught me my most expensive lesson: who you build with matters more than what you build. The second was a vertical AI startup doing retrieval over chemical-industry knowledge, before RAG was a buzzword. It won a government-backed grant, survived twenty customer discovery interviews, and then watched generalist AI products eat its market. Lesson two: timing is a co-founder you don't get to choose.",
    "These days I build AI systems at enterprise scale — multi-agent products that turn messy consumer data into decisions — and personal AI agents that run my own life, from a Telegram bot that argues with me about my stock portfolio to dashboards that track everything I care about. Somewhere along the way I started explaining all of this on camera, and @inthe_blur became its own kind of build.",
    "Where is this going? Toward building something of my own. I've known that since Ichalkaranji.",
  ],
};

export const NOTEBOOK: NotebookContent = {
  intro: "Things I believe, learned the expensive way or the lucky way.",
  entries: [
    { index: "01", text: "More important than what you do is who you do it with." },
    { index: "02", text: "If I can't explain a system simply, I don't understand it yet — that's half the reason I make content." },
    { index: "03", text: "Agents are leverage, not magic. The boring parts — evals, retrieval, failure cases — are the product." },
    { index: "04", text: "Timing is a co-founder you don't get to choose." },
    { index: "05", text: "Ship something people use, however small. One real user beats a hundred impressed onlookers." },
    { index: "06", text: "Instrument everything. What gets measured gets improved; what gets automated gets done." },
  ],
};

export const BROADCAST: BroadcastContent = {
  heading: "I also build an audience.",
  copy:
    "@inthe_blur is where I make dense AI and tech topics clear and practical — explainers, tool breakdowns, and builds in public. Technical enough for engineers, accessible enough for everyone else. It started as a forcing function (\"do I actually understand this?\") and became my favorite build.",
  handleUrl: "https://instagram.com/inthe_blur",
  posts: [
    { id: "post-1", caption: "how agents actually plan" },
    { id: "post-2", caption: "RAG, explained without the hype" },
    { id: "post-3", caption: "building in public: week 1" },
    { id: "post-4", caption: "the eval most teams skip" },
    { id: "post-5", caption: "what I learned shutting a startup down" },
    { id: "post-6", caption: "a Telegram bot that argues with me" },
  ],
};

export const LIFE: LifeContent = {
  facts: [
    "I've certified my way through Anthropic Academy — Claude, Claude Code, Cowork — because I use them daily anyway.",
    "I keep a personal dashboard that tracks basically my whole life.",
    "Gold medalist in triathlon at IIT Bombay's General Championship — swim, cycle, run, in Mumbai heat.",
    "All India Rank 1 in a national Sanskrit Olympiad. Yes, Sanskrit.",
    "Trained as a student mentor in the CBT-REBT counselling framework; mentored 10 freshmen through their first year.",
    "Former Head Girl. I never quite stopped organizing things.",
    "I grew up around looms and yarn markets in Ichalkaranji.",
    "I sprint-raced at state level as a kid — 100m and 200m.",
    "My first \"products\" were C++ games: Bubble Trouble with real gravity.",
    "Long-term plan: build my own thing. Everything above is training.",
  ],
};

export const NOW: NowContent = {
  heading: "Now",
  updated: "updated monthly — last: August 2026",
  copy:
    "Building personal AI agents and shipping enterprise ones. Growing @inthe_blur. Reading about vertical AI businesses. Slowly circling my next big build.",
};

export const CONNECT: ConnectContent = {
  heading: "Say hi.",
  copy:
    "Always up for conversations about AI, building things, or good ideas. The fastest way to reach me is Instagram DMs or email.",
  links: [
    { label: "Instagram", href: "https://instagram.com/inthe_blur" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/krishna-baldwa" },
    { label: "GitHub", href: "https://github.com/Krishna-Baldwa" },
    { label: "Email", href: "mailto:krishnabaldwa1101@gmail.com" },
  ],
  footerNote: "This site was designed with AI, obviously.",
};
