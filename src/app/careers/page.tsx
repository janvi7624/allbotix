import Navbar                from '@/components/Navbar'
import Footer                from '@/components/Footer'
import CareersSection from '@/components/CareersSection'
import ActivitiesSection from '@/components/ActivitiesSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <ActivitiesSection />
        <CareersSection />
      </main>
      <Footer />
    </>
  )
}