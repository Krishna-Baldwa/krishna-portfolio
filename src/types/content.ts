export interface NavStep {
  id: string;
  label: string;
  system: string;
}

export interface HeroContent {
  planLine: string;
  headline: string;
  headlineAccent: string;
  subline: string;
}

export interface StoryContent {
  paragraphs: string[];
}

export type ProjectStatus = "shipped" | "archived" | "paused";

export interface Project {
  id: string;
  status: ProjectStatus;
  tag: string;
  title: string;
  story: string;
  learned: string;
}

export interface NotebookEntry {
  index: string;
  text: string;
}

export interface NotebookContent {
  intro: string;
  entries: NotebookEntry[];
}

export interface BroadcastPost {
  id: string;
  caption: string;
}

export interface BroadcastContent {
  heading: string;
  copy: string;
  handle: string;
  handleUrl: string;
  posts: BroadcastPost[];
}

export interface LifeContent {
  facts: string[];
}

export interface NowContent {
  heading: string;
  updated: string;
  copy: string;
}

export interface ConnectLink {
  label: string;
  href: string;
}

export interface ConnectContent {
  heading: string;
  copy: string;
  links: ConnectLink[];
  footerNote: string;
}
