import { Navbar } from "@/components/nomi/navbar";
import { Hero } from "@/components/nomi/hero";
import { AdTransformation } from "@/components/nomi/ad-transformation";
// import { CreativeGallery } from "@/components/nomi/creative-gallery";
import { HowItWorks } from "@/components/nomi/how-it-works";
import { AiPipeline } from "@/components/nomi/ai-pipeline";
import { FinalCta } from "@/components/nomi/final-cta";
import { Footer } from "@/components/nomi/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <AdTransformation />
      {/* <CreativeGallery /> */}
      <HowItWorks />
      <AiPipeline />
      <FinalCta />
      <Footer />
    </main>
  );
}