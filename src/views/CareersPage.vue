<template>
  <transition
    v-on:enter="doPageLoad"
    v-bind:css="false"
    appear
  >
    <div
      v-show="pageData && isPageImageLoaded"
      ref="page"
      class="basic-page"
      :key="pageData.id"
      :style="{paddingBottom: pageData.padding + 'px'}"
    >
      <BasicHeader></BasicHeader>
      <div
        class="section-start main-card"
        id="main-card"
      >
        <div class="row m-0">
          <div class="col-md-12 p-0">
            <div class="card-details">
              <h4 class="short-title">Careers</h4>
              <h2 class="long-title">{{pageData.long_title}}</h2>
              <div
                class="desc"
                v-html="pageData.description"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-start custom-career-padding">
        <div
          class="rg-open-positions-area"
          ref="joblist"
          id="joblist"
        >
          <div class="container-fluid p-0">
            <div class="row">
              <div class="col-lg-12">
                <div
                  v-if="jobPosts && jobPosts.length > 0"
                  class="rg-open-positions"
                >
                  <div class="rg-positions-list-area">
                    <div
                      v-on:click="goToCareerPage(jobPost.meta.slug)"
                      class="rg-position-list"
                      v-for="(jobPost, idx) in jobPosts"
                      :key="'jb' + idx"
                    >
                      <div class="position-name">
                        <h2>{{jobPost.title}}</h2>
                        <p>{{jobPost.location}}</p>
                      </div>

                      <div class="position-details">
                        <a>
                          <span>More details</span>
                          <span>
                            <img
                              svg-inline
                              src="../assets/img/right-dir.svg"
                              alt
                            >
                          </span>
                          <span class="arrow">
                            <img
                              class="right-dir"
                              svg-inline
                              src="../assets/img/right-dir.svg"
                              alt
                            >
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="no-job"
                >
                  <h3>No job post available!</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { State, Action, Getter, Mutation } from "vuex-class";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { pageDataType } from "../types";
import FullWidthTextAndImage from "../components/FullWidthTextAndImage.vue";
import Video from "../components/Video.vue";
import { HOST } from "../global";
import { animeDict } from "../animations";
import { TimelineMax, TimelineLite, Expo, Power2 } from "gsap";
import ScrollMagic from "scrollmagic";
import { ADD_ANIMATION, SET_PAGE_IMAGE_LOADED } from "../store/mutations.names";
import GoogleMap from "../components/GoogleMap.vue";
import ConcernCarousel from "../components/CocernCarousel.vue";
import ContactForm from "../components/ContactForm.vue";
import { FETCH_JOB_POSTS } from "../store/actions.names";
import BasicHeader from "../components/BasicHeader.vue";

@Component({
  name: "CareersPage",
  components: {
    BasicHeader
  }
})
export default class CareersPage extends Vue {
  @Getter("jobPosts") public jobPosts!: any | undefined;
  @Getter("pageData") public pageData!: pageDataType;
  @Getter("mainTimeLine") public masterTl: any;
  @Getter("mainTimeLineIsFinished") public mtlFinished!: boolean;
  @Mutation(ADD_ANIMATION) public [ADD_ANIMATION]: any;
  @Action(FETCH_JOB_POSTS) public [FETCH_JOB_POSTS]: any;
  @Mutation(SET_PAGE_IMAGE_LOADED) public setPageImageLoaded: any;
  @Getter("isPageImageLoaded") public isPageImageLoaded!: boolean;
  public HOST: string = HOST;
  public addedAnimation: boolean = false;
  // public FETCH_JOB_POSTS: boolean = false;
  public controller = new ScrollMagic.Controller();
  public currentHeaderSlide: number = 0;
  @Watch("$route")
  public handleRouteChange(to: any, from: any) {
    // this.doPageLoad();
    this[FETCH_JOB_POSTS](this.pageData.id);
  }
  public slideFunction(pageData: any | null = null) {
    const pg = pageData || this.pageData;
    setInterval(() => {
      if (this.currentHeaderSlide == pg.header[0].value.length - 1) {
        this.currentHeaderSlide = 0;
      } else {
        this.currentHeaderSlide++;
      }
    }, 8000);
  }
  @Watch("pageData")
  handlePageDataChange(val: any, oldVal: any) {
    if (val.header[0].value.length > 0) {
      this.slideFunction(val);
    }
  }
  public mounted() {
    if (this.pageData.header[0].value.length > 0) {
      this.slideFunction();
    }
    this[FETCH_JOB_POSTS](this.pageData.id);
    // this.doPageLoad();
    this.$nextTick(() => {
      this.addAnimation();
    });
  }

  public doPageLoad(el: any, done: any) {
    if (this.mtlFinished) {
      this.pageLoad();
    } else {
      this[ADD_ANIMATION](this.pageLoad, "-=0.65");
    }
  }

  @Watch("jobPosts")
  public handleJobPost(val: any, ov: any) {
    // console.log("changed");
    this.$nextTick(() => {
      this.addAnimation();
    });
  }

  public goToCareerPage(child: string) {
    this.$router.push(`/${this.pageData.meta.slug}/${child}`);
  }

  public addAnimation(): void {
    if (!this.addedAnimation && this.jobPosts && this.jobPosts.length > 0) {
      const positions = document.querySelectorAll(".rg-position-list");
      const positionTl = new TimelineMax();

      positionTl.staggerFromTo(
        positions,
        1,
        {
          yPercent: 200,
          opacity: 0
        },
        {
          opacity: 1,
          ease: Expo.easeOut,
          yPercent: 0
        },
        0.5
      );

      const scene = new ScrollMagic.Scene({
        triggerElement: ".rg-positions-list-area",
        reverse: false,
        duration: "100%",
        triggerHook: "onEnter"
      })
        .setTween(positionTl)
        .addTo(this.controller);
      this.addedAnimation = true;
    }
  }

  public pageLoad(): void {
    const fakeLoader =
      this.$refs.fakeloader || document.querySelector(".blank-div");
    const aboutImg =
      this.$refs.aboutimg ||
      document.querySelector(".about-img > picture > img");
    const pageloadTl = new TimelineMax({
      onComplete: () => {
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
        "-=0.01"
      )
      .to(
        fakeLoader,
        1,
        {
          height: 0,
          ease: Power2.easeOut
        },
        "-=0.45"
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
        "-=2.6"
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
        "-=1.1"
      );
  }
}
</script>
