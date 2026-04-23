import Navbar                from '@/components/Navbar'
import Footer                from '@/components/Footer'
import ContactSection from '@/components/ContactSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}