import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import MandateServices from "@/components/home/MandateServices";
import LatestNews from "@/components/home/LatestNews";
import StakeholdersSection from "@/components/home/StakeholdersSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <MandateServices />
      <LatestNews />
      <StakeholdersSection />
    </>
  );
}
