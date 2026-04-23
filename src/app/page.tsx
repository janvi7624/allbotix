import Navbar                from '@/components/Navbar'
import HeroSection       from '@/components/HeroSection'
import TechSection       from '@/components/TechSection'
import ProcessSection        from '@/components/ProcessSection'
import StatsSection          from '@/components/extra/StatsSection'
import SolutionsCarousel       from '@/components/SolutionsCarousel'
import RobotShowcaseSection  from '@/components/RobotShowcaseSection'
import PricingSection        from '@/components/extra/PricingSection'
import FAQSection            from '@/components/FAQSection'
import NewsletterSection     from '@/components/extra/NewsletterSection'
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
        {/* <ProcessSection /> */}
        {/* <StatsSection /> */}
        <SolutionsCarousel />
        {/* <PricingSection /> */}
        <FAQSection />
        {/* <NewsletterSection /> */}
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}