import React, { useRef, useMemo } from 'react';
import AliceCarousel from 'react-alice-carousel';
import HomeSectionCard from '../HomeSectioncard/HomeSectionCard';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

export default function HomeSectionCarousel({ data ,Section}) {
  const carouselRef = useRef(null);

  const items = useMemo(
    () =>
      data.slice(0, 10).map((item, index) => (
        <HomeSectionCard key={index} product={item} />
      )),
    [data]
  );

  const responsive = {
    0: { items: 1 },
    720: { items: 2 },
    1024: { items: 5.5 },
  };

  const slideNext = () => {
    if (carouselRef.current) {
      carouselRef.current.slideNext();
    }
  };

  const slidePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.slidePrev();
    }
  };

  return (
    <div className="relative px-1 sm:px-2 lg:px-3">
      <h2 className='text-2xl font-extrabold text-gray-800 py-1'>{Section}</h2>
      <div className="relative">
        <AliceCarousel
          ref={carouselRef}
          items={items}
          responsive={responsive}
          disableButtonsControls
          disableDotsControls
          mouseTracking
          animationType="slide"
        />

        {/* Prev Button */}
        <button
          onClick={slidePrev}
          className="z-50 bg-slate-500 absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2"
          aria-label="prev"
        >
          <KeyboardArrowLeftIcon />
        </button>

        {/* Next Button */}
        <button
          onClick={slideNext}
          className="z-50 bg-slate-500 absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2"
          aria-label="next"
        >
          <KeyboardArrowLeftIcon sx={{ transform: 'rotate(180deg)' }} />
        </button>
      </div>
    </div>
  );
}
