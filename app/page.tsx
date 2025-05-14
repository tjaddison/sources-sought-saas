import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import ValueProposition from '@/components/ValueProposition'
import CtaSection from '@/components/CtaSection'
import FaqSection from '@/components/FaqSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ValueProposition />
        <CtaSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  )
} 