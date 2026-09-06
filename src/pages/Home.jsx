import Hero from '../components/home/Hero'
import QuickSearch from '../components/home/QuickSearch'
import ServicesPreview from '../components/home/ServicesPreview'
import GuidesPreview from '../components/home/GuidesPreview'
import { FeaturesStrip, AskCta } from '../components/home/FeaturesAndCta'

export default function Home() {
  return (
    <div>
      <Hero />
      <QuickSearch />
      <ServicesPreview />
      <GuidesPreview />
      <FeaturesStrip />
      <AskCta />
    </div>
  )
}
