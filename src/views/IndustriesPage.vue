<template>
  <div class="industries" ref="indbody">
    <div class="container-fluid custom-height p-0">
      <div class="concern-container">
        <div class="row custom-height">
          <div
            v-show="preloaderLoaded"
            class="col-lg-2 col-sm-2 xs-screen-custom1 pr-0 industries-sidebar"
          >
            <div class="mobile-screens">
              <div class="industries-container custom-grid1 industries-left-nav" ref="mobnavitems">
                <div class="industry-menu" >
                  <ul class="ind-navbar">
                    <li
                      v-for="(page, idx) in pages"
                      v-on:click.prevent="handlePageChange(idx)"
                      class="ind-nav-item"
                      :key="'menu' + idx"
                    >
                      <a
                        id="automotive"
                        href="#"
                        :class="{'ind-nav-link': true, 'ind-nav-link-active': controllers.currentPage == idx}"
                      >
                        <span class="menu-title">{{ page.menu_title || page.title }}</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="arrows" @click="addScroll" ref="rightArr">
                <img src="../assets/img/arrwo-white.svg" alt="Rangs Group">
              </div>
              <div class="arrows-left" @click="addScroll2" ref="leftArr">
                <img src="../assets/img/left-arrow.svg" alt="Rangs Group">
              </div>
            </div>
            <div class="desktop-view">
              <div class="industries-container custom-grid1 industries-left-nav">
                <ul class="ind-navbar" ref="navitems" >
                  <li
                    v-for="(page, idx) in pages"
                    v-on:click.prevent="handlePageChange(idx)"
                    class="ind-nav-item"
                    :key="'menu' + idx"
                  >
                    <a
                      id="automotive"
                      href="#"
                      :class="{'ind-nav-link': true, 'ind-nav-link-active': controllers.currentPage == idx}"
                    >
                      <span class="industry-icon" v-html="page.menu_logo.data"></span>
                      <span class="menu-title">{{ page.menu_title || page.title }}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <transition
            v-on:leave="leaveTransitionHandler"
            v-on:enter="enterTransitionHandler"
            appear
          >
            <router-view v-if="preloaderLoaded"></router-view>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import {
  pageDataType,
  IndustryPageDataType,
  IndustryPageNavController
} from "../types";
import { HOST, API_URL } from "../global";
import { FETCH_INDUSTRIES_DATA } from "../store/actions.names";
import {
  SET_INDUSTRY_CURRENT_PAGE,
  SET_INDUSTRY_NEXT_ANIME,
  SET_INDUSTRY_PREV_ANIME,
  SET_INDUSTRY_ANIMATION_LOCK,
  SET_PAGE_IMAGE_LOADED
} from "../store/mutations.names";
import { TimelineMax, TimelineLite, Expo, Linear } from "gsap";
import axios from "axios";

import { State, Action, Getter, Mutation } from "vuex-class";

@Component({
  name: "IndustriesPage",
  components: {}
})
export default class IndustriesPage extends Vue {
  @Getter("industryController") public controllers!: IndustryPageNavController;
  @Getter("pageData") public pageData!: pageDataType;
  @Getter("pageType") public pageType!: string | null;
  @Getter("industryParent") public industryParent!: any | null;
  @Action(FETCH_INDUSTRIES_DATA) public fetchData: any;
  @Mutation(SET_INDUSTRY_ANIMATION_LOCK)
  public [SET_INDUSTRY_ANIMATION_LOCK]: any;
  @Mutation(SET_INDUSTRY_CURRENT_PAGE) public [SET_INDUSTRY_CURRENT_PAGE]: any;
  @Mutation(SET_INDUSTRY_NEXT_ANIME) public [SET_INDUSTRY_NEXT_ANIME]: any;
  @Mutation(SET_INDUSTRY_PREV_ANIME) public [SET_INDUSTRY_PREV_ANIME]: any;
  @Getter("isMenuLoaded") public menuLoaded!: boolean;
  @Getter("isPreloaderLoaded") public preloaderLoaded!: boolean;
  public HOST: string = HOST;
  public currConcern: any | null = null;
  public urlResolved = false;
  public currentEnterTransition: string | null = null;
  public currentLeaveTransition: string | null = null;
  @Getter("industriesList") public pages!: IndustryPageDataType[];

  get lock() {
    return this.controllers.lock;
  }

  public enterTransitionHandler(el: any, done: any) {
    if (this.currentEnterTransition) {
      (this as any)[this.currentEnterTransition](el, done);
    }
  }

  public leaveTransitionHandler(el: any, done: any) {
    if (this.currentLeaveTransition) {
      (this as any)[this.currentLeaveTransition](el, done);
    }
  }

  public runIndustryCategoryAnimation(el: any, done: any) {
    new TimelineMax({}).add(this.bodyContent()).add(this.subCompany(), "-=2.7");
  }

  public fadeOut(el: any, done: any) {
    console.log("fadeOut");
    new TimelineMax({
      onComplete: () => {
        console.log("fadeOut");
      }
    })
      .fromTo(
        el,
        1,
        {
          autoAlpha: 1,
          display: "block"
        },
        {
          autoAlpha: 0,
          //background: 'red',
          ease: Expo.easeOut
        }
      )
      .set(el, {
        display: "none"
      });
  }

  public fadeIn(el: any, done: any) {
    new TimelineMax({}).fromTo(
      el,
      1,
      {
        autoAlpha: 0
      },
      {
        autoAlpha: 1,
        ease: Linear.easeIn
      },
      -0.09
    );
  }

  @Watch("controllers.nextAnime")
  public nextAnimeHandler(val: number, oldVal: number) {
    if (val === null || this.lock) {
      return false;
    }
    (this.$refs.navitems as HTMLElement).children[
      val
    ].children[0].classList.add("ind-nav-link-active");
    (this.$refs.navitems as HTMLElement).children[
      this.controllers.currentPage
    ].children[0].classList.remove("ind-nav-link-active");
  }

  @Watch("controllers.beforeAnime")
  public beforeAnimeHandler(val: number, oldVal: number) {
    if (val === null || this.lock) {
      return false;
    }
    (this.$refs.navitems as HTMLElement).children[
      this.controllers.currentPage
    ].children[0].classList.remove("ind-nav-link-active");
    (this.$refs.navitems as HTMLElement).children[
      val
    ].children[0].classList.add("ind-nav-link-active");
  }

  @Watch("pages")
  public handlePagesChange(newVal: any, oldVal: any) {
    if (!this.urlResolved && this.$route.params.category) {
      const curPage = newVal.findIndex((f: any) => {
        return f.meta.slug == this.$route.params.category;
      });
      if (curPage > 0) {
        this.$nextTick(() => {
          this[SET_INDUSTRY_CURRENT_PAGE](curPage);
        });
      }

      this.urlResolved = true;
    }
  }

  @Watch("pageType")
  public handlePageTypeChange(val: any, oldVal: any) {
    const indBody = this.$refs.indbody as HTMLElement;
    let is_mobile = (window as any).matchMedia("(max-width: 1024px)").matches;
    console.log(is_mobile);
    if (!is_mobile) {
      if (
        ["IndustriesPage", "IndustryCategoryPage"].indexOf(val as string) > -1
      ) {
        indBody.addEventListener("wheel", this.firstSecScroll, false);
      } else {
        indBody.removeEventListener("wheel", this.firstSecScroll, false);
      }
    }
  }

  @Watch("$route", { immediate: true })
  public handleRouteChange(newVal: any, oldVal: any) {
    if (newVal.params.category && this.pages.length > 0) {
      const curPage = this.pages.findIndex(f => {
        return f.meta.slug == newVal.params.category;
      });
      console.log(curPage);
      if (curPage > -1) {
        this.$nextTick(() => {
          this[SET_INDUSTRY_CURRENT_PAGE](curPage);
        });
      }

      this.urlResolved = true;
    }
    this.currentLeaveTransition = null;
    this.currentEnterTransition = null;
    if (newVal.name === "industry") {
      if (
        oldVal &&
        ["industries", "industryCategory", "industryMain"].indexOf(
          oldVal.name
        ) > -1
      ) {
        this.currentEnterTransition = "fadeIn";
        this.currentLeaveTransition = "fadeOut";
      }
    } else {
      this.currentEnterTransition = "runIndustryCategoryAnimation";
      if (oldVal && oldVal.name == "industry") {
        this.currentLeaveTransition = "fadeOut";
      }
    }
    console.log(oldVal, newVal);
  }

  public getViewURL(url: string): string {
    return url.replace("documents", "documents/view");
  }
public addScroll(){
  let menu = this.$refs.mobnavitems as HTMLElement;
  let leftArrows = this.$refs.leftArr as HTMLElement;
  let rightArrows = this.$refs.rightArr as HTMLElement;
           console.log(menu, menu.scrollHeight, menu.scrollTop);
           menu.scrollTop += 30;
           if(menu.scrollTop >= 30){
             leftArrows.style.display = "flex";
             //rightArrows.style.display = "none";
           }
          // else if (menu.scrollTop >= 250){
          //   rightArrows.style.display = "none";
          //  }
           else{
            //leftArrows.style.display = "flex";
             //rightArrows.style.display = "none";
           }
           if(menu.scrollTop >= 420){
            rightArrows.style.display = "none";
           }
				// (this.$refs.navitems as HTMLElement).style.transform = "translateY(-12%)";
			// (this.$refs.navitems as HTMLElement).scrollLeft += 30;
        }
public addScroll2(){
  let menu = this.$refs.mobnavitems as HTMLElement;
  let leftArrows = this.$refs.leftArr as HTMLElement;
  let rightArrows = this.$refs.rightArr as HTMLElement;
  menu.scrollTop -= 30;
   if(menu.scrollTop <= 29 ){
             leftArrows.style.display = "none";
            //rightArrows.style.display = "flex";
            }
            else{
            //  leftArrows.style.display = "flex";
              // rightArrows.style.display = "none";
           }
}
  public mounted() {

    //let leftArrows = this.$refs.leftArr as HTMLElement;
    //leftArrows.style.display = "none";
    this.fetchData({
      id: this.pageData.id,
      pageType: this.pageData.meta.type
    });
    let is_mobile = (window as any).matchMedia("(max-width: 1024px)").matches;
    console.log(is_mobile);
    if (!is_mobile) {
      if (
        ["IndustriesPage", "IndustryCategoryPage"].indexOf(this
          .pageType as string) > -1
      ) {
        const indBody = this.$refs.indbody as HTMLElement;
        indBody.addEventListener("wheel", this.firstSecScroll, false);
      }
    }
  }

  public firstSecScroll(e: any) {
    if (e) {
      e.preventDefault();
    }
    if (this.lock) {
      return false;
    }
    const wDelta = e.wheelDelta < 0 ? "down" : "up";
    if (wDelta == "up") {
      if (this.controllers.currentPage == 0) {
        this.handlePageChange(this.pages.length - 1);
      } else {
        this.handlePageChange(this.controllers.currentPage - 1);
      }
    } else {
      if (this.controllers.currentPage == this.pages.length - 1) {
        this.handlePageChange(0);
      } else {
        this.handlePageChange(this.controllers.currentPage + 1);
      }
    }
  }

  public handlePageChange(idx: number): void {
    if (this.lock) {
      return;
    }
    const url = `/${this.industryParent.meta.slug}/${
      this.pages[idx].meta.slug
    }`;
    if (
      ["IndustriesPage", "IndustryCategoryPage"].indexOf(this
        .pageType as string) < 0
    ) {
      this.$router.push(url);
    } else {
      if (idx > (this.controllers.currentPage as number)) {
        this[SET_INDUSTRY_NEXT_ANIME](idx);
      } else if (idx < (this.controllers.currentPage as number)) {
        this[SET_INDUSTRY_PREV_ANIME](idx);
      }
      history.replaceState({ urlPath: url }, "", url);

      // this.$router.replace(
      //   url
      // );
    }
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
