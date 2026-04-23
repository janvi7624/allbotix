import Navbar                from '@/components/Navbar'
import TechSection       from '@/components/TechSection'
import Footer                from '@/components/Footer'
import TeamSection from '@/components/TeamSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <TechSection />
        <TeamSection />
      </main>
      <Footer />
    </>
  )
}