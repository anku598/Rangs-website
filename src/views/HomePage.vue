<template>
  <div v-if="pageData" class="template">
    <div class="overlay-loader">
      <div ref="olay1" class="overlay-loader1"></div>
      <div ref="olay2" class="overlay-loader2"></div>
    </div>

    <div ref="section1" class="wrapper section">
      <div class="background-img">
        <picture>
          <source media="(max-width: 425px)" :srcset="HOST + (pageData.promotion_show ? pageData.promotion_hero_image.meta.download_url : pageData.hero_image_mobile.url)">
          <source media="(max-width: 1024px)" :srcset="HOST + (pageData.promotion_show ? pageData.promotion_hero_image.meta.download_url : pageData.hero_image_tab.url)">
          <img :src="HOST +  (pageData.promotion_show ? pageData.promotion_hero_image.meta.download_url : pageData.hero_image.url)" @load="setPageImageLoaded(true)" alt>
        </picture>
      </div>
      <transition v-on:enter="homeContent" v-bind:css="false" appear>
        <div class="content" v-if="isPreloaderLoaded && isPageImageLoaded">
          <div :class="{'hero-text': true, 'hero-text-promo': pageData.show_promotion}">
            <h3 class="title">{{(pageData.promotion_show) ? pageData.promotion_header : pageData.header}}</h3>
            <p class="sub-text">{{(pageData.promotion_show) ? pageData.promotion_subtitle : pageData.subtitle }}</p>
          </div>
           <a ref="promBtn" class="promo-btn" v-if="pageData.promotion_show" v-bind:href="pageData.promotion_link[0].value.html" target="_blank">
            <p>VIEW PROMOTION</p>
          </a>
          <a ref="scrollBtn" class="scroll-btn" href="#" v-on:click.prevent="scrollAnim()">
            <p class="scroll-text">SCROLL TO DISCOVER</p>
            <img class="arrow down-scroll" src="../assets/img/scroll-arrow.svg" alt="Scroll Arrow">
          </a>

        </div>
      </transition>
    </div>
    <div v-show="isPageImageLoaded" class="section section-two" ref="section2">
      <div class="slider-track" ref="slides">
        <div
          v-for="(slide, idx) in pageData.slider"
          :class="{slide: true, 'main-slider': true, 'current-slide': slideIndex == idx}"
          :key="idx"
          :style="{left: setSlidePosition(idx)}"
        >
          <div class="slide-img">
            <picture>
              <source media="(max-width: 425px)" :srcset="HOST + slide.value.image.mobile.src">
              <source media="(max-width: 1024px)" :srcset="HOST + slide.value.image.tab.src">
              <img
                :src="HOST + slide.value.image.original.src"
                :alt="slide.value.image.original.alt"
                class="slider-img"
              >
            </picture>
          </div>
          <div class="slider">
            <div class="slider-content">
              <h2>{{(slide.value.title) ? slide.value.title : (slide.value.page) ? slide.value.page.title : ""}}</h2>
              <p>{{slide.value.text}}</p>
              <AppLink
                class="btn custom-btn"
                :to="slide.value.link || (slide.value.page.html.replace(HOST, '') || '')"
              >
                <span>{{slide.value.anchor}}</span>
                <img src="../assets/img/scroll-arrow.svg" alt="Arrow">
              </AppLink>
            </div>
          </div>
        </div>
      </div>
      <div class="navigator" style="z-index:99">
        <a
          v-for="(slide, idx) in pageData.slider"
          :class="{'navigator-link': true, 'link-active': slideIndex == idx }"
          href="#"
          v-on:click.prevent="moveToSlide(slideIndex, idx)"
          :data-slide="idx"
          :key="'ctrl' + idx"
        ></a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { State, Action, Getter, Mutation } from "vuex-class";
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";
import { pageDataType } from "../types";
import AppLink from "../components/AppLink.vue";
import { HOST } from "../global";
import { TimelineMax, TimelineLite, Expo } from "gsap";
import ScrollMagic from "scrollmagic";
import { ADD_ANIMATION, SET_PAGE_IMAGE_LOADED } from "../store/mutations.names";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";

@Component({
  name: "HomePage",
  components: {
    AppLink
  }
})
export default class HomePage extends Vue {
  @Getter("pageData") public pageData!: pageDataType;
  @Getter("mainTimeLine") public masterTl: any;
  @Getter("mainTimeLineIsFinished") public mtlFinished!: boolean;
  @Getter("isMenuLoaded") public isMenuLoaded!: boolean;
  @Getter("isPageImageLoaded") public isPageImageLoaded!: boolean;
  @Getter("isPreloaderLoaded") public isPreloaderLoaded!: boolean;
  @Mutation(ADD_ANIMATION) public [ADD_ANIMATION]: any;
  @Mutation(SET_PAGE_IMAGE_LOADED) public setPageImageLoaded: any;
  public controller = new ScrollMagic.Controller();
  public HOST: string = HOST;
  public gotRef: boolean = false;
  public scrollLock: boolean = false;
  public slideIndex: number = 0;
  public slideWidth: number = 0;
  public animated: boolean = false;

  public mounted() {
    console.log(this.pageData.promotion_link);
    // this.doPageLoad();
    setTimeout(() => {
      const Section1 =
        (this.$refs.section1 as HTMLElement) ||
        document.querySelector(".wrapper");
      const Section2 =
        (this.$refs.section2 as HTMLElement) ||
        document.querySelector(".section-two");
      const scrollBtn =
        (this.$refs.scrollBtn as HTMLElement) ||
        document.querySelector(".scroll-btn");
      Splitting({
        target: ".slide-img",
        by: "cells",
        rows: 3,
        image: true
      });
      new ScrollMagic.Scene({
        triggerElement: Section1,
        reverse: false
      }).addTo(this.controller);

      // });
      Section1.addEventListener("wheel", this.firstSecScroll);
      Section1.addEventListener("touchmove", this.firstSecScroll, false);
      //      Section1.addEventListener("DOMMouseScroll", this.firstSecScroll);
      this.slideWidth = Section1.getBoundingClientRect().width;
      Section2.addEventListener("wheel", this.go);
      Section2.addEventListener("touchmove", this.go, false);
      // Section2.addEventListener("DOMMouseScroll", this.go);
    }, 2000);
  }

  // @Watch("isMenuLoaded")
  // handleMenuLoad(val: boolean, oldVal: boolean) {
  //   if (val == true && !this.animated) {
  //     this.homeContent();
  //   }
  // }

  public doPageLoad() {
    if (this.mtlFinished) {
      this.homeContent();
    } else {
      this[ADD_ANIMATION](this.homeContent, "-=0.65");
    }
    // this.addAnimation();
  }


  public setSlidePosition(index: number) {
    return window.innerWidth * index + "px";
  }

  public firstSecScroll(e: any) {
    if (this.scrollLock) {
      return false;
    }
    console.log(e);
    this.scrollLock = true;
    const delta = (e.deltaY || -e.wheelDelta || e.detail) >> 10 || 1;
    if (delta > 0) {
      this.scrollAnim();
    }
    if (isNaN(e)) {
      e.preventDefault();
    }
    setTimeout(() => {
      this.scrollLock = false;
    }, 1000);
  }

  public sliderNext() {
    const sliderTl = new TimelineMax({});
    sliderTl
      .staggerFrom(
        ".current-slide > .slide-img > .cell-grid > .cell",
        1.5,
        {
          xPercent: 100,
          ease: Expo.easeOut
        },
        0.15
      )
      .fromTo(
        ".current-slide .slider-content",
        1,
        {
          scaleY: 0
        },
        {
          scaleY: 1,
          transformOrigin: "bottom center",
          ease: Expo.easeOut
        },
        "-=0.5"
      )
      .staggerFromTo(
        ".current-slide .slider-content > h2, .current-slide .slider-content > p, .current-slide .slider-content> .custom-btn",
        1,
        {
          yPercent: 30,
          opacity: 0
        },
        {
          yPercent: 0,
          opacity: 1,
          ease: Expo.easeOut
        },
        0.15,
        "-=0.5"
      );
  }

  public sliderPrev() {
    const sliderTl = new TimelineMax({});
    sliderTl
      .staggerFrom(
        ".current-slide > .slide-img > .cell-grid > .cell",
        1.5,
        {
          xPercent: -100,
          ease: Expo.easeOut
        },
        0.15
      )
      .fromTo(
        ".current-slide .slider-content",
        .5,
        {
          scaleY: 0
        },
        {
          scaleY: 1,
          transformOrigin: "bottom center",
          ease: Expo.easeOut
        },
        "-=0.6"
      )
      .staggerFromTo(
        ".current-slide .slider-content > h2, .current-slide .slider-content > p, .current-slide .slider-content> .custom-btn",
        .5,
        {
          yPercent: 30,
          opacity: 0
        },
        {
          yPercent: 0,
          opacity: 1,
          ease: Expo.easeOut
        },
        0.15,
        "-=0.6"
      );
  }

  public scrollAnim() {
    const Section1 = this.$refs.section1;
    const Section2 = this.$refs.section2;
    const { olay1, olay2 } = this.$refs;
    const animateImgOverlay = new TimelineLite({
      paused: true,
      onComplete: () => {
        console.log("done");
      }
    });
    console.log(animateImgOverlay);
    animateImgOverlay
      .set(olay1, {
        yPercent: -100,
        height: "100%"
      })
      .set(olay2, {
        yPercent: 100,
        height: "100%"
      })
      .to([olay1, olay2], 1, {
        yPercent: 0,
        ease: Expo.easeOut
      })

      .to(olay1, 1, {
        scaleY: 0,
        transformOrigin: "bottom center",
        ease: Expo.easeOut,
        clearProps: "all"
      })

      .to(
        olay2,
        1,
        {
          scaleY: 0,
          transformOrigin: "top center",
          ease: Expo.easeOut,
          clearProps: "all"
        },
        "-=1" as any
      )
      .to(
        Section1,
        1,
        {
          display: "none"
        },
        "-=2" as any
      )
      .fromTo(
        ".current-slide .slider-content",
        1,
        {
          scaleY: 0
        },
        {
          scaleY: 1,
          transformOrigin: "bottom center",
          ease: Expo.easeOut,
          clearProps: "all"
        },
        "-=0.45" as any
      )
      .staggerFromTo(
        ".current-slide .slider-content > h2, .current-slide .slider-content > p, .current-slide .slider-content> .custom-btn",
        1,
        {
          yPercent: 30,
          opacity: 0
        },
        {
          yPercent: 0,
          opacity: 1,
          ease: Expo.easeOut,
          clearProps: "all"
        },
        0.15,
        "-=0.5" as any
      )
      .staggerFromTo(
        ".navigator-link",
        1,
        {
          xPercent: -10,
          opacity: 0
        },
        {
          xPercent: 0,
          opacity: 1,
          ease: Expo.easeOut,
          clearProps: "all"
        },
        0.13,
        "-=0.75" as any
      );
    animateImgOverlay.play();
  }

  public homeContent() {
    const navBaranim = document.querySelector(".navbar");
    const navBaranimLi = document.querySelectorAll(".navbar li");
    const timelineAnimation = new TimelineMax({
      onComplete: () => {
        //this.sectionOneLoaded = true;
      }
    });
    if (window.innerWidth >= 768) {
      timelineAnimation
        .set(".header", {
          display: "flex"
        })
        .staggerFromTo(
          ".title , .sub-text, .scroll-btn",
          1,
          {
            yPercent: 100,
            autoAlpha: 0
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: Expo.easeOut,
            clearProps: "all"
          },
          0.2
        )
        .fromTo(
          ".scroll-text",
          0.6,
          {
            yPercent: 50,
            opacity: 0
          },
          {
            yPercent: 0,
            opacity: 1,
            clearProps: "all"
          },
          "-=0.3"
        )
        .fromTo(
          ".down-scroll",
          1.5,
          {
            yPercent: 0,
            opacity: 1
          },
          {
            yPercent: 12,
            opacity: 1,
            repeat: -1,
            yoyo: true
          },
          "-=0.5"
        );
    } else {
      timelineAnimation
        .staggerFromTo(
          ".title .animation",
          1.9,
          {
            yPercent: 100,
            autoAlpha: 0
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: Expo.easeOut
          },
          0.1,
          "-=0.5"
        )
        .fromTo(
          ".logo",
          1,
          {
            y: -80,
            autoAlpha: 0
          },
          {
            y: 0,
            autoAlpha: 1,
            ease: Expo.easeOut
          },
          "-=1.5"
        )
        .fromTo(
          "#menu-toggle",
          0.8,
          {
            x: 600,
            autoAlpha: 0
          },
          {
            x: 0,
            autoAlpha: 1
          },
          "-=1.5"
        )
        .fromTo(
          ".btn",
          1.3,
          {
            yPercent: -50,
            autoAlpha: 0
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: Expo.easeOut
          },
          "-=1"
        );
    }
    return timelineAnimation;
  }

  public moveToSlide(currentSlideIndex: number, targetSlideIndex: number) {
    const track = this.$refs.slides as HTMLElement;
    const slides = (this.$refs.slides as HTMLElement).childNodes;
    const currentSlide = slides[currentSlideIndex] as HTMLElement;
    const targetSlide = slides[targetSlideIndex] as HTMLElement;
    track.style.transform = "translateX(-" + targetSlide.style.left + ")";
    currentSlide.classList.remove("current-slide");
    targetSlide.classList.add("current-slide");
    if (currentSlide > targetSlide) {
      this.sliderPrev();
    } else {
      this.sliderNext();
    }
    this.slideIndex = targetSlideIndex;
  }

  public go(e: any) {
    if (this.scrollLock) {
      return false;
    }
    this.scrollLock = true;
    const delta = (e.deltaY || -e.wheelDelta || e.detail) >> 10 || 1;
    if (e) {
      e.preventDefault();
    }
    console.log(delta);
    const slides = (this.$refs.slides as HTMLElement).childNodes;
    if (delta > 0) {
      let nextSlideIndex = this.slideIndex + 1;
      if (nextSlideIndex == slides.length) {
        nextSlideIndex = 0;
      }

      this.moveToSlide(this.slideIndex, nextSlideIndex);
    }
    if (delta < 0) {
      const prevSlideIndex = this.slideIndex - 1;
      if (prevSlideIndex < 0) {
        // Put your code here

        const Section1 = this.$refs.section1;
        const Section2 = this.$refs.section2;
        const { olay1, olay2 } = this.$refs;
        const animateImgOverlay = new TimelineMax({});
        animateImgOverlay
          .set(olay1, {
            yPercent: -100,
            height: "100%"
          })
          .set(olay2, {
            yPercent: 100,
            height: "100%"
          })
          .to([olay1, olay2], 1, {
            yPercent: 0,
            ease: Expo.easeOut
          })

          .to(olay1, 1, {
            scaleY: 0,
            transformOrigin: "bottom center",
            ease: Expo.easeOut,
            clearProps: "all"
          })

          .to(
            olay2,
            1,
            {
              scaleY: 0,
              transformOrigin: "top center",
              ease: Expo.easeOut,
              clearProps: "all"
            },
            "-=1"
          )
          .to(
            Section1,
            1,
            {
              display: "block"
            },
            "-=1"
          );
      } else {
        this.moveToSlide(this.slideIndex, prevSlideIndex);
        this.slideIndex = prevSlideIndex;
      }
    }
    setTimeout(() => {
      this.scrollLock = false;
    }, 1300);
  }
}
</script>
