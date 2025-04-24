import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import SecretSection from '@/components/SecretSection'
// import FeatureSpotlightSection from '@/components/FeatureSpotlightSection'
import VisionSection from '@/components/VisionSection'
import MarketValidationSection from '@/components/MarketValidationSection'
import EarlyAccessSection from '@/components/EarlyAccessSection'
import FaqSection from '@/components/FaqSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SecretSection />
        <VisionSection />
        {/* <FeatureSpotlightSection /> */}
        <MarketValidationSection />
        <EarlyAccessSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  )
} 