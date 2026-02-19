import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { MainCarouselData } from './MainCaroselData';
import "../../../../src/index.css"

const MainCarousel = () => {
const items=MainCarouselData.map((item, index)=>(
  <div className="relative w-full h-[52vh] sm:h-[60vh] lg:h-[72vh] overflow-hidden">
    <img
      className="w-full h-full object-cover object-top"
      role="presentation"
      src={item.image}
      alt={item.alt || `fashion-banner-${index + 1}`}
      loading={index === 0 ? "eager" : "lazy"}
      decoding="async"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/5" />
    <div className="absolute inset-0 px-5 sm:px-10 lg:px-20 flex items-end pb-8 sm:pb-12 lg:pb-16">
      <div className="max-w-xl text-left text-white">
        <p className="text-xs sm:text-sm tracking-[0.22em] uppercase opacity-90 mb-3">
          New Arrivals
        </p>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
          {item.heading}
        </h2>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-white/90 max-w-lg">
          {item.subheading}
        </p>
        <button
          type="button"
          className="mt-5 sm:mt-6 bg-white text-slate-900 font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-slate-100 transition"
        >
          {item.cta}
        </button>
      </div>
    </div>
  </div>
))

   return <AliceCarousel
        className="main-hero-carousel"
        items={items}
        disableButtonsControls
        disableDotsControls={false}
        autoPlay   
        autoPlayInterval={3600}
        animationDuration={700}
        infinite
        mouseTracking
        autoPlayStrategy="default"
    />
};
export default MainCarousel
