import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <StatsSection />
    </div>
  );
}

