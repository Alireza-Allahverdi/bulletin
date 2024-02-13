import React from 'react'
import { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import deafultImg from "../../../assets/images/NSSWebsiteBanner2018(courses)History1.png"
import sliderImg1 from "../../../assets/images/slider2.jpg"
import sliderImg2 from "../../../assets/images/slider3.jpg"
import sliderImg3 from "../../../assets/images/slider4.jpg"

function Slider() {
  return (
    <div className="sliderContainer">
      <Swiper
        spaceBetween={30}
        slidesPerGroup={1}
        slidesPerView={1}
        loop={false}
        loopFillGroupWithBlank={true}
        className="mySwiper"
      >
        <SwiperSlide><img src={deafultImg} alt="" /></SwiperSlide>
        <SwiperSlide><img src={sliderImg1} alt="" /></SwiperSlide>
        <SwiperSlide><img src={sliderImg2} alt="" /></SwiperSlide>
        <SwiperSlide><img src={sliderImg3} alt="" /></SwiperSlide>
      </Swiper>
    </div>
  )
}

export default Slider