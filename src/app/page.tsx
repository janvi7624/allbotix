import Navbar                from '@/components/Navbar'
import HeroSection       from '@/components/HeroSection'
import TechSection       from '@/components/TechSection'
import SolutionsCarousel       from '@/components/SolutionsCarousel'
import RobotShowcaseSection  from '@/components/RobotShowcaseSection'
import FAQSection            from '@/components/FAQSection'
import CtaBanner     from '@/components/CtaBanner'
import Footer                from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TechSection />
        <RobotShowcaseSection />
        <SolutionsCarousel />
        <FAQSection />
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}