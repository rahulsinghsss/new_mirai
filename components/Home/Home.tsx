import React from 'react'
import Hero from './Hero/Hero'
import { RevealZoom } from './Gateway/Gateway' 
import Mirai_Grace from './Mirai_Grace/Mirai_Grace'
import MiraiPodsIntro from './4_Pods/4_pods'
import MiraiPodsSlider from './Mirai_Pods_Slider/Pods_Slider'
import ClubhouseIntro from './4_Level_Clubhouse/4_Level_Clubhouse'
import MiraiClubhouse from './ClubeHouse_Img_controller/ClubeHouse_Controller'
import InteractiveMap from './Interative_Map/Interative_Map'
import ContactForm from './Contact_us/Contact_us'
import Footer from './Footer/Footer'
import SixthElement from './Sixth_Element/Sixth_element'

const Home = () => {
  return (
    <div className="relative w-full overflow-x-hidden" style={{ backgroundColor: '#1a1a2e' }}>
      {/* Fixed background layers (lowest z-index) */}
      <ContactForm />  {/* z-index: 4 */}
      <Hero />         {/* z-index: 5 */}
      
      {/* Scrollable content (higher z-index to cover fixed elements) */}
      <div className="relative" style={{ zIndex: 10 }}>
        {/* Spacer for Hero */}
        <div className="h-screen" aria-hidden="true" />
        
        {/* SixthElement */}
        <div className="relative bg-black">
          <SixthElement />
        </div>
        
        {/* RevealZoom */}
        <section 
          aria-label="Reveal zoom" 
          className="relative bg-black"
          style={{ isolation: 'isolate' }}
        >
          <RevealZoom />
        </section>
        
        {/* Scroll video */}
        <section 
          aria-label="Scroll video" 
          className="relative bg-black"
        >
          <Mirai_Grace />
        </section>
        
        {/* Main content sections */}
        <div className="relative bg-white">
          <MiraiPodsIntro />
          <MiraiPodsSlider />
          <ClubhouseIntro />
          <MiraiClubhouse />
          <InteractiveMap />
        </div>
      </div>

      {/* Spacer to allow scrolling to reveal ContactForm */}
      <div className="h-screen" style={{ backgroundColor: 'transparent' }} />
      
      {/* Footer */}
      <div className="relative" style={{ zIndex: 15 }}>
        <Footer />
      </div>
    </div>
  )
}

export default Home
