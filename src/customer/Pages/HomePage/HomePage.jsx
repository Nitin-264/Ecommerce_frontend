import React from 'react'
import MainCarousel from '../../Component/HomeCarousel/MainCarousel'
import HomeSectionCarousel from '../../Component/HomeSectioncarousel/HomeSectionCarousel'
import Mens_Kurta from "../../Data/Mens_Kurta"
import Women_Kurta from "../../Data/Women_Kurta"

const rotate = (list = [], offset = 0) => {
  if (!Array.isArray(list) || list.length === 0) return [];
  const start = offset % list.length;
  return [...list.slice(start), ...list.slice(0, start)];
};

const homeSections = [
  { title: "Mens_Kurta", data: rotate(Mens_Kurta, 0) },
  { title: "Mens_Trending", data: rotate(Mens_Kurta, 10) },
  { title: "Mens_New_Arrivals", data: rotate(Mens_Kurta, 20) },
  { title: "Womens_Kurta", data: rotate(Women_Kurta, 0) },
  { title: "Womens_Trending", data: rotate(Women_Kurta, 8) },
  { title: "Womens_New_Arrivals", data: rotate(Women_Kurta, 16) },
];

const HomePage = () => {
  return (
    <div>
      <MainCarousel/>
      <div className='space-y-3 py-2 sm:py-3 flex flex-col justify-center px-3 sm:px-6 lg:px-8'>
        {homeSections.map((section) => (
          <HomeSectionCarousel
            key={section.title}
            data={section.data}
            Section={section.title}
          />
        ))}
        
      </div>
    </div>
  )
}

export default HomePage
