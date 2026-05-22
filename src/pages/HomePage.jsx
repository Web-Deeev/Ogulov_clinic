import PromoBanner from '../components/PromoBanner'
import CardGrid from '../components/CardGrid'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <>
      <PromoBanner imageUrl="/images/banner.png" />
      <CardGrid />
      <Footer /> 
    </>
  )
}

