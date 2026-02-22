import { HeroSection } from '@/components/hero-section';
import { MissionSection } from '@/components/mission-section';
import { ProductShowcase } from '@/components/product-showcase';
import { ImpactSection } from '@/components/impact-section';
import { CTASection } from '@/components/cta-section';
import { MerchStoriesSection } from '@/components/merch-stories-section';

export default function HomePage() {
  return (
    <div className="w-full">
      <HeroSection />
      <MissionSection />
      <ProductShowcase />
      <ImpactSection />
      <CTASection />
      <MerchStoriesSection />
    </div>
  );
}
