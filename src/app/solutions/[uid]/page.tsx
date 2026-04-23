import Navbar                from '@/components/Navbar'
import SolutionDetailPage    from '@/components/SolutionDetailPage'
import Footer                from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <SolutionDetailPage />
      </main>
      <Footer />
    </>
  )
}