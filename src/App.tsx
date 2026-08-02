import { SmoothScrollProvider } from "./components/layout/SmoothScrollProvider";
import { StatusBarNav } from "./components/layout/StatusBarNav";
import { GrainOverlay } from "./components/layout/GrainOverlay";
import { CustomCursor } from "./components/ui/CustomCursor";
import { HeroField } from "./components/sections/hero/HeroField";
import { Hero } from "./components/sections/Hero";
import { Story } from "./components/sections/Story";
import { Builds } from "./components/sections/Builds";
import { Notebook } from "./components/sections/Notebook";
import { Broadcast } from "./components/sections/Broadcast";
import { Life } from "./components/sections/Life";
import { Now } from "./components/sections/Now";
import { Connect } from "./components/sections/Connect";

export default function App() {
  return (
    <SmoothScrollProvider>
      <div aria-hidden="true" className="fixed inset-0 -z-10">
        <HeroField />
      </div>
      <GrainOverlay />
      <CustomCursor />
      <StatusBarNav />
      <main className="relative">
        <Hero />
        <Story />
        <Builds />
        <Notebook />
        <Broadcast />
        <Life />
        <Now />
        <Connect />
      </main>
    </SmoothScrollProvider>
  );
}
