import { HeroSection } from '@/components/hero-section';
import { MissionSection } from '@/components/mission-section';
import { ProductShowcase } from '@/components/product-showcase';
import { ImpactSection } from '@/components/impact-section';
import { CubeUploadSection } from '@/components/cube-upload-section';
import { FridgeMagnetSection } from '@/components/fridge-magnet-section';
import { CanvasPrintSection } from '@/components/canvas-print-section';
import { MerchStoriesSection } from '@/components/merch-stories-section';

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-white">
      <HeroSection />
      <MissionSection />
      <ProductShowcase />
      <ImpactSection />
      <CubeUploadSection />
      <FridgeMagnetSection />
      <CanvasPrintSection />
      <MerchStoriesSection />
    </div>
  );
}
