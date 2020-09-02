<template>
  <!-- <transition
    v-on:enter="runAnimation"
    v-bind:css="false"
    appear
  >-->
  <div
    v-show="preloaderLoaded"
    class="col-lg-10 col-sm-10 xs-screen-custom2 p-0 offset-sm-3 offset-lg-2"
  >
    <div class="industries-container industries-all-content">
      <div class="row ind-flex6">
        <div class="col-md-4 text-col custom-grid2">
          <div
            id="text-column"
            class="column-wrapper"
          >
            <div class="ind-content new-content main">
              <div
                class="header-wrapper"
                ref="headWrap"
              >
                <h2
                  :class="{active: idx==controllers.currentPage, after: idx==controllers.nextAnime, before: idx==controllers.beforeAnime}"
                  style
                  v-for="(page, idx) in pages"
                  :key="'h' + idx"
                >{{ page.title }}</h2>
              </div>
              <div
                class="paragraph-wrapper"
                ref="textWrap"
              >
                <p
                  :class="{active: idx==controllers.currentPage, after: idx==controllers.nextAnime, before: idx==controllers.beforeAnime}"
                  v-for="(page, idx) in pages"
                  :key="'p' + idx"
                >{{ page.description }}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          id="img-column"
          class="col-md-8 custom-grid3"
        >
          <div
            class="img-wrapper"
            ref="imgWrap"
          >
            <div
              :class="{'ind-img': true, active: idx==controllers.currentPage, after: idx==controllers.nextAnime, before: idx==controllers.beforeAnime}"
              v-for="(page, idx) in pages"
              :key="'img' + idx"
            >
              <picture>
                <source media="(max-width: 425px)" :srcset="HOST + page.hero_image_mobile.url">
                  <source media="(max-width: 1024px)" :srcset="HOST + page.hero_image_tab.url">
                <img
                  :src="HOST + page.hero_image.url"
                  alt="Automotive"
                >
              </picture>
            </div>
            <div class="picture-overlay1"></div>
            <div class="picture-overlay2"></div>
          </div>
        </div>

        <div class="scroll-more">
          <a href="#">Scroll For More</a>
          <img
            src="../assets/img/scroll-arrow.svg"
            alt
          >
        </div>

      </div>

      <div class="row ind-flex1">
        <div
          class="sub-company"
          id="sub-company"
          ref="concerns"
        >
          <div
            v-for="(page, idnx) in pages"
            :class="{'concerns-wrapper': true, active: idnx==controllers.currentPage, after: idnx==controllers.nextAnime, before: idnx==controllers.beforeAnime}"
            :key="'cnrns' + idnx"
          >
            <router-link
              :class="['concern', 'concern' + idx]"
              v-for="(concern, idx) in page.concerns"
              :to="{name: 'industry', params: {category: page.meta.slug, industry: concern.meta.slug}}"
              :key="idnx + 'cnrs' + idx"
            >
              <p>{{ concern.title }}</p>
            </router-link>
          </div>
        </div>
      </div>

    </div>
  </div>
  <!-- </transition> -->
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import {
  pageDataType,
  IndustryPageDataType,
  IndustryPageNavController
} from "../types";
import { HOST, API_URL } from "../global";
import { TimelineMax, TimelineLite, Expo, Power3, Back } from "gsap";
import axios from "axios";
import { State, Action, Getter, Mutation } from "vuex-class";
import {
  SET_INDUSTRY_CURRENT_PAGE,
  SET_INDUSTRY_NEXT_ANIME,
  SET_INDUSTRY_PREV_ANIME,
  ADD_ANIMATION,
  SET_INDUSTRY_ANIMATION_LOCK
} from "../store/mutations.names";

const GSAPS = [TimelineMax, TimelineLite, Expo, Power3, Back];

@Component({
  name: "IndustriesPageMain",
  components: {}
})
export default class IndustriesPageMain extends Vue {
  @Getter("pageData") public pageData!: pageDataType;
  @Getter("industryController") public controllers!: IndustryPageNavController;
  @Mutation(SET_INDUSTRY_CURRENT_PAGE) public [SET_INDUSTRY_CURRENT_PAGE]: any;
  @Mutation(SET_INDUSTRY_NEXT_ANIME) public [SET_INDUSTRY_NEXT_ANIME]: any;
  @Mutation(SET_INDUSTRY_PREV_ANIME) public [SET_INDUSTRY_PREV_ANIME]: any;
  @Mutation(SET_INDUSTRY_ANIMATION_LOCK)
  public [SET_INDUSTRY_ANIMATION_LOCK]: any;
  public HOST: string = HOST;
  public animated: boolean = false;

  @Getter("industriesList") public pages!: IndustryPageDataType[];
  @Getter("mainTimeLine") public masterTl: any;
  @Getter("mainTimeLineIsFinished") public mtlFinished!: boolean;
  @Getter("isMenuLoaded") public menuLoaded!: boolean;
  @Getter("isPreloaderLoaded") public preloaderLoaded!: boolean;
  @Mutation(ADD_ANIMATION) public [ADD_ANIMATION]: any;

  public mounted() {
    // if (this.preloaderLoaded) {
    //   this.runAnimation();
    //   this.animated = true;
    // }

    this.animated = true;
    // else {
    //   // let tl = new TimelineMax({})
    //   //   .add(this.bodyContent(), "+=2")
    //   //   .add(this.subCompany(), "-=2.25");
    //   // this[ADD_ANIMATION](
    //   //   new TimelineMax({})
    //   //     .add(this.bodyContent(), "+=5")
    //   //     .add(this.subCompany(), "-=2.25"),
    //   //   "+=5"
    //   // );
    // }
  }

  // @Watch("menuLoaded", { immediate: true })
  // handleMasterTLChange(val: any, old: any) {
  //   console.log("animstatus:", val);
  //   if (val && !this.animated) {
  //     this.runAnimation();
  //     this.animated = true;
  //   }
  // }

  public runAnimation() {
    new TimelineMax({}).add(this.bodyContent()).add(this.subCompany(), "-=7");
  }

  get lock() {
    return this.controllers.lock;
  }

  public beforeRouteEnter(to: any, from: any, next: any) {
    const toDepth = to.path.split("/").length;
    const fromDepth = from.path.split("/").length;
    console.log("Enter", fromDepth, toDepth, from, to);
    next();
  }

  public beforeRouteUpdate(to: any, from: any, next: any) {
    const toDepth = to.path.split("/").length;
    const fromDepth = from.path.split("/").length;
    console.log(fromDepth, toDepth, from, to);
    next();
  }

  @Watch("controllers.nextAnime")
  public nextAnimeHandler(val: number, oldVal: number) {
    if (val === null || this.lock) {
      return false;
    }
    this[SET_INDUSTRY_ANIMATION_LOCK](true);
    (this.$refs.headWrap as HTMLElement).children[val].classList.add("after");
    (this.$refs.textWrap as HTMLElement).children[val].classList.add("after");
    (this.$refs.imgWrap as HTMLElement).children[val].classList.add("after");
    (this.$refs.concerns as HTMLElement).children[val].classList.add("after");
    const self = this;
    const basicTimeline = new TimelineMax({
      paused: true,
      onComplete: () => {
        self[SET_INDUSTRY_CURRENT_PAGE](val);
        self[SET_INDUSTRY_NEXT_ANIME](null);
        self[SET_INDUSTRY_ANIMATION_LOCK](false);
      }
    });
    basicTimeline
      .set("#text-column .main .paragraph-wrapper .active", {
        position: "absolute",
        display: "initial"
      })
      .to(".picture-overlay1", 0.7, {
        yPercent: 1000,
        ease: Back.easeIn,
        clearProps: "all"
      })
      .to(
        "#img-column .img-wrapper .active",
        0.6,
        {
          yPercent: 100,
          ease: Power3.easeIn,
          clearProps: "all",
          onComplete: () => {
            (this.$refs.imgWrap as HTMLElement).children[
              this.controllers.currentPage as any
            ].classList.remove("active");
          }
        },
        "-=0.50" as any
      )
      .fromTo(
        "#img-column .img-wrapper .after",
        0.6,
        {
          yPercent: -100
        },
        {
          yPercent: 0,
          ease: Power3.easeInOut,
          clearProps: "all"
        },
        "-=0.5" as any
      )
      .to(
        "#text-column .main .header-wrapper .active",
        1,
        {
          y: 50,
          autoAlpha: 0,
          ease: Expo.easeInOut,
          clearProps: "all",
          onComplete: () => {
            (this.$refs.headWrap as HTMLElement).children[
              this.controllers.currentPage as any
            ].classList.remove("active");
          }
        },
        "-=1.1" as any
      )
      .fromTo(
        "#text-column .main .header-wrapper .after",
        1,
        {
          yPercent: -50,
          autoAlpha: 0
        },
        {
          yPercent: 0,
          autoAlpha: 1,
          ease: Expo.easeOut,
          clearProps: "all"
        },
        "-=0.6" as any
      )

      .to(
        "#text-column .main .paragraph-wrapper .active",
        1,
        {
          yPercent: 50,
          autoAlpha: 0,
          clearProps: "all",
          onComplete: () => {
            (this.$refs.textWrap as HTMLElement).children[
              this.controllers.currentPage as any
            ].classList.remove("active");
          }
        },
        "-=1.3" as any
      )
      .fromTo(
        "#text-column .main .paragraph-wrapper .after",
        1,
        {
          yPercent: -50,
          autoAlpha: 0
        },
        {
          yPercent: 0,
          autoAlpha: 1,
          ease: Expo.easeInOut,
          clearProps: "all"
        },
        "-=1.3" as any
      )
      .fromTo(
        "#text-column .main .paragraph-wrapper .after",
        1,
        {
          yPercent: -50,
          autoAlpha: 0
        },
        {
          yPercent: 0,
          autoAlpha: 1,
          ease: Expo.easeInOut,
          clearProps: "all"
        },
        "-=1.3" as any
      )
      .staggerTo(
        "#sub-company .active .concern",
        1,
        {
          yPercent: 100,
          autoAlpha: 0,
          ease: Expo.easeInOut,
          clearProps: "all",
          onComplete: () => {
            (this.$refs.concerns as HTMLElement)!.children[
              this.controllers.currentPage as any
            ].classList.remove("active");
          }
        },
        0.3,
        "-=1.5" as any
      )
      .staggerFromTo(
        "#sub-company .after .concern",
        1,
        {
          yPercent: -100,
          autoAlpha: 0
        },
        {
          yPercent: 0,
          autoAlpha: 1,
          ease: Expo.easeOut,
          clearProps: "all"
        },
        0.3,
        "-=0.9" as any
      )
      .set("#text-column .main .paragraph-wrapper .after", {
        position: "relative",
        transition: "unset",
        transitionduration: ".01s",
        transitiondelay: ".01s",
        display: "block"
      });
    basicTimeline.play();
  }

  @Watch("controllers.beforeAnime")
  public beforeAnimeHandler(val: number, oldVal: number) {
    if (val === null || this.lock) {
      return false;
    }
    this[SET_INDUSTRY_ANIMATION_LOCK](true);
    (this.$refs.headWrap as HTMLElement).children[val].classList.add("before");
    (this.$refs.textWrap as HTMLElement).children[val].classList.add("before");
    (this.$refs.imgWrap as HTMLElement).children[val].classList.add("before");
    (this.$refs.concerns as HTMLElement).children[val].classList.add("before");
    const self = this;
    const basicTimeline = new TimelineMax({
      onComplete() {
        self[SET_INDUSTRY_CURRENT_PAGE](val);
        self[SET_INDUSTRY_PREV_ANIME](null);
        self[SET_INDUSTRY_ANIMATION_LOCK](false);
      }
    });
    basicTimeline
      .set("#text-column .main .paragraph-wrapper .active", {
        position: "absolute",
        display: "block"
      })
      .to(".picture-overlay2", 0.7, {
        yPercent: -1000,
        //  ease: Back.easeIn,
        clearProps: "all"
      })
      .to(
        "#img-column .img-wrapper .active",
        0.6,
        {
          yPercent: -100,
          ease: Power3.easeIn,
          clearProps: "all",
          onComplete: () => {
            (this.$refs.imgWrap as HTMLElement).children[
              this.controllers.currentPage as any
            ].classList.remove("active");
          }
        },
        "-=0.55" as any
      )
      .fromTo(
        "#img-column .img-wrapper .before",
        0.6,
        {
          yPercent: 100
        },
        {
          yPercent: 0,
          ease: Power3.easeInOut,
          clearProps: "all"
        },
        "-=0.5" as any
      )
      .to(
        "#text-column .main .header-wrapper .active",
        1,
        {
          y: -50,
          autoAlpha: 0,
          ease: Expo.easeInOut,
          clearProps: "all",
          onComplete: () => {
            (this.$refs.headWrap as HTMLElement).children[
              this.controllers.currentPage as any
            ].classList.remove("active");
          }
        },
        "-=1.1" as any
      )
      .fromTo(
        "#text-column .main .header-wrapper .before",
        1,
        {
          yPercent: 50,
          autoAlpha: 0
        },
        {
          yPercent: 0,
          autoAlpha: 1,
          ease: Expo.easeOut,
          clearProps: "all"
        },
        "-=0.6" as any
      )

      .to(
        "#text-column .main .paragraph-wrapper .active",
        1,
        {
          yPercent: -50,
          autoAlpha: 0,
          clearProps: "all",
          onComplete: () => {
            (this.$refs.textWrap as HTMLElement).children[
              this.controllers.currentPage as any
            ].classList.remove("active");
          }
        },
        "-=1.3" as any
      )
      .fromTo(
        "#text-column .main .paragraph-wrapper .before",
        1,
        {
          yPercent: 50,
          autoAlpha: 0
        },
        {
          yPercent: 0,
          autoAlpha: 1,
          ease: Expo.easeInOut,
          clearProps: "all"
        },
        "-=1.3" as any
      )

      .staggerTo(
        "#sub-company .active .concern",
        1,
        {
          yPercent: -100,
          autoAlpha: 0,
          ease: Expo.easeInOut,
          clearProps: "all",
          onComplete: () => {
            (this.$refs.concerns as HTMLElement).children[
              this.controllers.currentPage as any
            ].classList.remove("active");
          }
        },
        0.3,
        "-=1.5" as any
      )
      .staggerFromTo(
        "#sub-company .before .concern",
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
        0.3,
        "-=0.9" as any
      )
      .set("#text-column .main .paragraph-wrapper .before", {
        position: "relative",
        display: "block"
      });
  }

  public header() {
    const navLinkTl = new TimelineMax({});

    navLinkTl.staggerFromTo(
      ".nav-item",
      0.9,
      {
        yPercent: 70,
        autoAlpha: 0
      },
      {
        yPercent: 0,
        autoAlpha: 1,
        ease: Expo.easeOut
      },
      0.06
    );

    return navLinkTl;
  }

  public bodyContent() {
    const contentTl = new TimelineMax({});

    contentTl
      .fromTo(
        ".ind-img",
        1,
        {
          height: "0%",
          transformOrigin: "top"
        },
        {
          height: "100%",
          // autoAlpha: 1,
          ease: Expo.easeInOut,
          clearProps: "all"
        }
      )
      .staggerFromTo(
        ".header-wrapper, .paragraph-wrapper",
        1.2,
        {
          xPercent: -20,
          autoAlpha: 0
        },
        {
          xPercent: 0,
          autoAlpha: 1,
          ease: Expo.easeOut,
          clearProps: "all"
        },
        0.2,
        "-=1.5" as any
      )
      .staggerFromTo(
        ".ind-nav-item",
        1,
        {
          xPercent: 20,
          autoAlpha: 0
        },
        {
          xPercent: 0,
          autoAlpha: 1,
          ease: Expo.easeOut,
          clearProps: "all"
        },
        0.06,
        "-=1.1" as any
      );
    return contentTl;
  }

  public subCompany() {
    const subCompanyTl = new TimelineMax({});

    subCompanyTl
      .set(".concern", {
        autoAlpha: 0
      })
      .set(".sub-company", {
        width: "14%"
      })
      .fromTo(
        ".sub-company",
        1.7,
        {
          xPercent: -400
        },
        {
          xPercent: 120,
          ease: Expo.easeInOut
        }
      )
      .to(
        ".sub-company",
        1,
        {
          xPercent: 0,
          ease: Expo.easeInOut
        },
        "-=0.6" as any
      )
      .to(
        ".sub-company",
        0.8,
        {
          width: "100%",
          tranformOrigin: "left"
        },
        "-=0.43" as any
      )
      .staggerFromTo(
        ".concern",
        0.6,
        {
          yPercent: 40,
          autoAlpha: 0
        },
        {
          yPercent: 0,
          autoAlpha: 1,
          ease: Expo.easeOut,
          clearProps: "all"
        },
        0.01,
        "-=0.5" as any
      );
    return subCompanyTl;
  }
}
</script>
