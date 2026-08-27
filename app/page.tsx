import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { ExhibitionHall } from "@/components/home/ExhibitionHall";

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <StatsSection />
      <FeaturedProjects />
      <ExhibitionHall />
    </div>
  );
}
