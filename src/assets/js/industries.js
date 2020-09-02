var sliderImg = document.querySelector('.ind-slider__img > img')
var firstTime = true;
var interleaveOffset = 2;

var swiperOptions = {
  spaceBetween: 0,
  effect: 'fade',
  speed: 0,
  loop: true,
  hashNavigation: true,
  mousewheel: {
    invert: false,
  },
  // autoHeight: true,
  pagination: {
    el: '.ind-slider__pagination',
    clickable: true,
  },
  on: {
    slideChange: function () {
      if (firstTime) {
        firstTime = false;
        return;
      }
      var slide = this.slides[this.activeIndex];
      var title = slide.querySelector(".ind-slider__title");
      var text = slide.querySelector(".ind-slider__text");
      var image = slide.querySelector(".ind-slider__img");

      var SliderTl = new TimelineMax({})

      SliderTl
        .to(title, 1, {
          yPercent: -20,
          //ease: Expo.easeOut
        })
        .to(text, 1, {
          yPercent: -10,
          //ease: Expo.easeOut
        }, '-=0.5')

      console.log(SliderTl);
    },
    // touchStart: function () {
    //   var swiper = this;
    //   for (var i = 0; i < swiper.slides.length; i++) {
    //     swiper.slides[i].style.transition = "";
    //   }
    // },
    // setTransition: function (speed) {
    //   var swiper = this;
    //   for (var i = 0; i < swiper.slides.length; i++) {
    //     swiper.slides[i].style.transition = speed + "ms";
    //     swiper.slides[i].querySelector(".ind-slider__item").style.transition =
    //       speed + "ms";
    //   }


    // }
  }
};


var swiper = new Swiper('.ind-slider', swiperOptions);