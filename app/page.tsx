import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import SecretSection from '@/components/SecretSection'
import VisionSection from '@/components/VisionSection'
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
        <FaqSection />
      </main>
      <Footer />
    </>
  )
} 