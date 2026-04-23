import Navbar                from '@/components/Navbar'
import Footer                from '@/components/Footer'
import RobotsPage from '@/components/RobotsPage'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <RobotsPage />
      </main>
      <Footer />
    </>
  )
}