"use strict";

Splitting({
  target: ".slide-img",
  by: "cells",
  rows: 3,
  image: true
});

const Section1 = document.querySelector(".wrapper");
const Section2 = document.querySelector(".section-two");
const scrollBtn = document.querySelector('.scroll-btn');

function scrollAnim() {
  var animateImgOverlay = new TimelineMax({});
  animateImgOverlay
    .set(".overlay-loader1", {
      yPercent: -100,
      height: "100%"
    })
    .set(".overlay-loader2", {
      yPercent: 100,
      height: "100%"
    })
    .to(".overlay-loader1,.overlay-loader2", 1, {
      yPercent: 0,
      ease: Expo.easeOut
    })

    .to(".overlay-loader1", 1, {
      scaleY: 0,
      transformOrigin: "bottom center",
      ease: Expo.easeOut,
      clearProps: "all"
    })

    .to(
      ".overlay-loader2",
      1, {
        scaleY: 0,
        transformOrigin: "top center",
        ease: Expo.easeOut,
        clearProps: "all"
      },
      "-=1"
    )
    .to(
      Section1,
      1, {
        display: "none"
      },
      "-=2"
    );
}

var controller = new ScrollMagic.Controller();
var scene = new ScrollMagic.Scene({
    triggerElement: Section1,
    reverse: false
  })
  .addTo(controller)
  .on("update", function () {
    scrollBtn.addEventListener("click", function (e) {
      scrollAnim()
    });
  });


function firstSecScroll(e) {
  if (scrollLock) {
    return false;
  }
  scrollLock = true;
  var delta = (e.deltaY || -e.wheelDelta || e.detail) >> 10 || 1;
  if (delta > 0) {
    scrollAnim()
  }
  if (isNaN(e)) e.preventDefault();
  setTimeout(function () {
    scrollLock = false;
  }, 1000);
}

Section1.addEventListener("mousewheel", firstSecScroll);
Section1.addEventListener("DOMMouseScroll", firstSecScroll);

// Slider Animation

var slideIndex = 0;

function sliderNext() {
  var sliderTl = new TimelineMax({});
  sliderTl
    .staggerFrom(
      ".current-slide > .slide-img > .cell-grid > .cell",
      1.5, {
        xPercent: 100,
        ease: Expo.easeOut
      },
      0.15
    )
    .fromTo(
      ".current-slide .slider-content",
      1, {
        scaleY: 0
      }, {
        scaleY: 1,
        transformOrigin: "bottom center",
        ease: Expo.easeOut
      },
      "-=0.5"
    )
    .staggerFromTo(
      ".current-slide .slider-content > h2, .current-slide .slider-content > p, .current-slide .slider-content> .custom-btn",
      1, {
        yPercent: 30,
        opacity: 0
      }, {
        yPercent: 0,
        opacity: 1,
        ease: Expo.easeOut
      },
      0.15,
      "-=0.5"
    );
}

function sliderPrev() {
  var sliderTl = new TimelineMax({});
  sliderTl
    .staggerFrom(
      ".current-slide > .slide-img > .cell-grid > .cell",
      1.5, {
        xPercent: -100,
        ease: Expo.easeOut
      },
      0.15
    )
    .fromTo(
      ".current-slide .slider-content",
      1, {
        scaleY: 0
      }, {
        scaleY: 1,
        transformOrigin: "bottom center",
        ease: Expo.easeOut
      },
      "-=0.5"
    )
    .staggerFromTo(
      ".current-slide .slider-content > h2, .current-slide .slider-content > p, .current-slide .slider-content> .custom-btn",
      1, {
        yPercent: 30,
        opacity: 0
      }, {
        yPercent: 0,
        opacity: 1,
        ease: Expo.easeOut
      },
      0.15,
      "-=0.5"
    );
}

const sliderTrack = document.querySelector(".slider-track");
const slides = Array.from(sliderTrack.children);
const dotsNav = document.querySelector(".navigator");
const dots = Array.from(dotsNav.children);
var slideIndex = 0;
const slideWidth = slides[0].getBoundingClientRect().width;

const setSlidePosition = (slide, index) => {
  slide.style.left = slideWidth * index + "px";
};

const moveNextSlide = (track, currentSlide, targetSlide) => {
  track.style.transform = "translateX(-" + targetSlide.style.left + ")";
  currentSlide.classList.remove("current-slide");
  targetSlide.classList.add("current-slide");
  sliderNext();
};

const movePrevSlide = (track, currentSlide, targetSlide) => {
  track.style.transform = "translateX(-" + targetSlide.style.left + ")";
  currentSlide.classList.remove("current-slide");
  targetSlide.classList.add("current-slide");
  sliderPrev();
};

const updateDots = (currentDot, targetDot) => {
  currentDot.classList.remove("link-active");
  targetDot.classList.add("link-active");
};

slides.forEach(setSlidePosition);

dotsNav.addEventListener("click", e => {
  const targetDot = e.target.closest(".navigator-link");
  if (!targetDot) return;
  const currentSlide = sliderTrack.querySelector(".current-slide");
  const currentDot = dotsNav.querySelector(".link-active");
  const targetIndex = dots.findIndex(dot => dot === targetDot);
  const targetSlide = slides[targetIndex];
  moveNextSlide(sliderTrack, currentSlide, targetSlide);
  updateDots(currentDot, targetDot);
  slideIndex = targetIndex;
});

var scrollLock = false;

function Go(e) {
  if (scrollLock) {
    return false;
  }
  scrollLock = true;
  var delta = (e.deltaY || -e.wheelDelta || e.detail) >> 10 || 1;
  console.log(delta);
  if (delta > 0) {
    var nextSlideIndex = slideIndex + 1;
    if (nextSlideIndex == slides.length) {
      nextSlideIndex = 0;
    }
    const currentSlide = sliderTrack.querySelector(".current-slide");
    const nextSlide = slides[nextSlideIndex];
    const currentDot = dotsNav.querySelector(".link-active");
    const nextDot = dots[nextSlideIndex];
    moveNextSlide(sliderTrack, currentSlide, nextSlide);
    updateDots(currentDot, nextDot);
    slideIndex = nextSlideIndex;
  }
  if (delta < 0) {
    var prevSlideIndex = slideIndex - 1;
    if (prevSlideIndex < 0) {
      // Put your code here
      var animateImgOverlay = new TimelineMax({});
      animateImgOverlay
        .set(".overlay-loader1", {
          yPercent: -100,
          height: "100%"
        })
        .set(".overlay-loader2", {
          yPercent: 100,
          height: "100%"
        })
        .to(".overlay-loader1,.overlay-loader2", 1, {
          yPercent: 0,
          ease: Expo.easeOut
        })

        .to(".overlay-loader1", 1, {
          scaleY: 0,
          transformOrigin: "bottom center",
          ease: Expo.easeOut,
          clearProps: "all"
        })

        .to(
          ".overlay-loader2",
          1, {
            scaleY: 0,
            transformOrigin: "top center",
            ease: Expo.easeOut,
            clearProps: "all"
          },
          "-=1"
        )
        .to(
          Section1,
          1, {
            display: "block"
          },
          "-=1"
        );
    } else {
      const currentSlide = sliderTrack.querySelector(".current-slide");
      const prevSlide = slides[prevSlideIndex];
      const currentDot = dotsNav.querySelector(".link-active");
      const prevDot = dots[prevSlideIndex];
      movePrevSlide(sliderTrack, currentSlide, prevSlide);
      updateDots(currentDot, prevDot);
      slideIndex = prevSlideIndex;
    }
  }
  if (isNaN(e)) e.preventDefault();
  setTimeout(function () {
    scrollLock = false;
  }, 1000);
}

Section2.addEventListener("mousewheel", Go);
Section2.addEventListener("DOMMouseScroll", Go);