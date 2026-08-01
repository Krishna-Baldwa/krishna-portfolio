import { SectionIndex } from "../layout/SectionIndex";
import { SectionKicker } from "../layout/SectionKicker";
import { BuildsList } from "./builds/BuildsList";

export function Builds() {
  return (
    <section id="builds" className="relative py-[clamp(48px,7vw,96px)]">
      <div className="relative mx-auto max-w-[1240px] px-[clamp(18px,5vw,64px)]">
        <SectionIndex word="BUILDS" />
        <SectionKicker title="Builds" status="[retrieving: 5 nodes]" />
        <BuildsList />
      </div>
    </section>
  );
}
