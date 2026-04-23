import Navbar                from '@/components/Navbar'
import SolutionSection       from '@/components/SolutionSection'
import CtaBanner from '@/components/CtaBanner'
import Footer                from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <SolutionSection />
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}