<template>
  <transition
    v-on:enter="doPageLoad"
    v-bind:css="false"
    appear
  >

    <div
      class="about-img"
      v-show="pageData && isPageImageLoaded"
    >
      <picture v-if="this.pageData.header[0].type ===  'header_image'">
        <source
          media="(max-width: 425px)"
          :srcset="HOST + pageData.header[0].value.mobile.src"
        >
        <source
          media="(max-width: 1024px)"
          :srcset="HOST + pageData.header[0].value.tab.src"
        >
        <img
          ref="aboutimg"
          class="img-responsive"
          :src="HOST + pageData.header[0].value.original.src"
          :alt="pageData.header[0].title"
          @load="setPageImageLoaded(true)"
        >
      </picture>
      <div v-else-if="this.pageData.header[0].type ===  'slider'">
        <transition
          name="headerFade"
          tag="picture"
        >
          <picture :key="'hdslide' + currentHeaderSlide">
            <source
              media="(max-width: 425px)"
              :srcset="HOST + pageData.header[0].value[currentHeaderSlide].value.mobile.src"
            >
            <source
              media="(max-width: 1024px)"
              :srcset="HOST + pageData.header[0].value[currentHeaderSlide].value.tab.src"
            >
            <img
              ref="aboutimg"
              class="img-responsive img-slider"
              :src="HOST + pageData.header[0].value[currentHeaderSlide].value.original.src"
              :alt="pageData.header[0].value[currentHeaderSlide].title"
              @load="setPageImageLoaded(true)"
            >
          </picture>
        </transition>
      </div>
      <div v-else></div>
      <div
        class="blank-div"
        ref="fakeloader"
      ></div>
    </div>
  </transition>
</template>


<script lang="ts">
import { TimelineMax, TimelineLite, Expo, Power2 } from "gsap";
import ScrollMagic from "scrollmagic";
import "ScrollMagicGSAP";
import { State, Action, Getter, Mutation } from "vuex-class";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { SET_PAGE_IMAGE_LOADED } from "../store/mutations.names";
import { HOST } from "../global";
import { pageDataType } from "../types";

@Component({
  name: "BasicHeader"
})
export default class BasicHeader extends Vue {
  @Getter("pageData") public pageData!: pageDataType;
  @Getter("isPageImageLoaded") public isPageImageLoaded!: boolean;
  @Getter("isPreloaderLoaded") public isPreloaderLoaded!: boolean;
  @Mutation(SET_PAGE_IMAGE_LOADED) public setPageImageLoaded: any;
  public currentHeaderSlide: number = 0;
  public HOST: string = HOST;

  public slideFunction(pageData: any | null = null) {
    const pg = pageData || this.pageData;

    setInterval(() => {
      if (this.currentHeaderSlide == pg.header[0].value.length - 1) {
        this.currentHeaderSlide = 0;
      } else {
        this.currentHeaderSlide++;
      }
    }, 6000);
  }

  @Watch("pageData")
  handlePageDataChange(val: any, oldVal: any) {
    if (val.header[0].value.length > 0) {
      this.slideFunction(val);
    }
  }

  public mounted() {
    if (this.pageData.header[0].value.length > 1) {
      this.slideFunction();
    }
  }

  public doPageLoad(el: any, done: any) {
    this.$nextTick(() => {
      // if (this.mtlFinished) {
      this.pageLoad();

      // console.log("doing after finish");
      // } else {
      //   this[ADD_ANIMATION](this.pageLoad, "-=0.65");
      //   console.log("doing before finish");
      // }
    });
    // this.addAnimation();
  }

  public pageLoad(): void {
    const fakeLoader =
      this.$refs.fakeloader || document.querySelector(".blank-div");
    const aboutImg =
      this.$refs.aboutimg ||
      document.querySelector(".about-img > picture > img");
    const pageloadTl = new TimelineMax({
      onComplete: () => {
        this.$emit("loaded", true);
        (fakeLoader as HTMLElement).removeAttribute("style");
      }
    });
    pageloadTl
      .set(fakeLoader, {
        height: "100%"
      })
      .to(fakeLoader, 1, {
        height: "20%",
        ease: Expo.easeInOut
      })
      .set(fakeLoader, {
        height: "20%"
      })
      .to(
        fakeLoader,
        1,
        {
          left: "7.5%",
          right: "7.5%",
          transformOrigin: "center center",
          ease: Expo.easeOut
        },
        "-=0.01" as any
      )
      .to(
        fakeLoader,
        1,
        {
          height: 0,
          ease: Power2.easeOut
        },
        "-=0.45" as any
      )
      .fromTo(
        aboutImg,
        2.9,
        {
          scale: 1.2
        },
        {
          scale: 1
          // ease: SlowMo.ease.config(0.1, 0.1, false)
        },
        "-=2.6" as any
      )
      .staggerFromTo(
        ".short-title, .long-title, .desc",
        1,
        {
          yPercent: 70,
          opacity: 0
        },
        {
          yPercent: 0,
          opacity: 1,
          ease: Expo.easeOut
        },
        0.15,
        "-=1.1" as any
      );
  }
}
</script>
