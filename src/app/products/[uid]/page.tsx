import Navbar                from '@/components/Navbar'
import Footer                from '@/components/Footer'
import RobotDetailPage from '@/components/RobotDetailPage'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <RobotDetailPage />
      </main>
      <Footer />
    </>
  )
}