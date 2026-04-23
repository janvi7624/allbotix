import Navbar                from '@/components/Navbar'
import Footer                from '@/components/Footer'
import BlogSection from '@/components/BlogSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <BlogSection />
      </main>
      <Footer />
    </>
  )
}