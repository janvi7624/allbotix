import Navbar                from '@/components/Navbar'
import Footer                from '@/components/Footer'
import TeamSection from '@/components/TeamSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <TeamSection />
      </main>
      <Footer />
    </>
  )
}