import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import ValueProposition from '@/components/ValueProposition'
import CTASection from '@/components/CTASection'
import FaqSection from '@/components/FaqSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ValueProposition />
        <CTASection />
        <FaqSection />
      </main>
      <Footer />
    </>
  )
} 