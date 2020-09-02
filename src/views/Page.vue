<template>
  <div>
    <div id="overlay" ref="homeoverlay">
      <img svg-inline class="overlaylogo" src="../assets/img/home-logo.svg" alt="example">
    </div>
    <transition v-on:enter="preloader" v-bind:css="false" appear>
      <div v-show="mainMenu.length > 0 && preloaderDoneLoadingOnce && isPageImageLoaded">
        <div
          :class="{'container-fluid': true, 'p-0': true, 'main-content':true, 'custom-overflow': true, 'other-pages': haveFooter, 'industries-section': isIndustryPage && pageType != 'IndustryPage', 'innerpage-container': pageType == 'IndustryPage'}"
        >
          <transition v-on:enter="menuEnter" v-bind:css="false" appear>
            <div
              v-if="mainMenu.length > 0 && preloaded"
              :class="{header: true, 'ind-header': isIndustryPage, 'header-white': isLogoWhite}"
              id="header"
              ref="header"
            >
              <nav class="navbar navbar-expand-md p-0">
                <a v-on:click.prevent="goToPage('/')" class="navbar-brand brand-logo m-0">
                  <img
                    v-if="menuToggle || isLogoWhite || !isIndustryPage"
                    src="../assets/img/logo.svg"
                    alt="Rangs Group"
                  >
                  <img v-else src="../assets/img/logo-blue.svg" alt="Rangs Group">
                </a>
                <div
                  id="navbar-toggle"
                  :class="{'navbar-toggle': true, 'navbar-toggle-white': isLogoWhite, isActive: menuToggle}"
                  ref="menutoggle"
                  v-on:click="menuToggle = !menuToggle"
                >
                  <span class="top-bar" :class="{menubar: true}" ref="menubar"></span>
                  <span class="mid-bar" :class="{midmenubar: true}" ref="midmenubar"></span>
                  <span class="bottom-bar" :class="{menubars: true}" ref="menubars"></span>
                </div>
                <div class="navbar-collapse" id="navbarSupportedContent">
                  <ul class="navbar-nav ml-auto">
                    <li v-for="(mitem, idx) in mainMenu" class="nav-item" :key="'m' + idx">
                      <router-link :to="{ path: mitem.link }" class="nav-link">{{mitem.label}}</router-link>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </transition>
          <transition v-on:leave="mobileMenuLeave" v-on:enter="mobileMenuEnter" v-bind:css="false">
            <div v-show="menuToggle" class="mobile-nav" ref="navBarNav">
              <div class="mobile-nav-menu">
                <div v-for="(mitem, idx) in mainMenu" class="mob-nav-item" :key="'mm' + idx">
                  <a v-on:click.prevent="goToPage(mitem.link)" class="mob-nav-link">{{mitem.label}}</a>
                </div>
              </div>
            </div>
          </transition>

          <component v-if="pageType" :is="pageType" :master-tl="masterTl" :page-data="pageData"/>
        </div>
        <footer v-if="haveFooter || isIndustryPage" :class="{'industries-footer': isIndustryPage}">
          <div class="footer-content">
            <div class="footer-top">
              <div class="footer-logo">
                <img src="../assets/img/logo.svg" alt="Rangs Group">
              </div>
              <div class="footer-navigation">
                <ul>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li v-for="(mitem, idx) in mainMenu" :key="'m' + idx">
                    <router-link :to="{ path: mitem.link }">{{mitem.label}}</router-link>
                  </li>
                </ul>
              </div>
            </div>
            <div class="footer-bottom">
              <p>{{new Date().getFullYear()}} RANGS Group. All Rights Reserved.</p>
              <span>
                WEBSITE BY
                <a href="https://codesign.com.bd" target="_blank">CODESIGN</a>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { State, Action, Getter, Mutation } from "vuex-class";
import { Component, Vue, Watch } from "vue-property-decorator";
import { API_URL } from "../global";
import HomePage from "./HomePage.vue";
import BasicPage from "./BasicPage.vue";
import CareersPage from "./CareersPage.vue";
import JobPostPage from "./JobPostPage.vue";
import IndustriesPage from "./IndustriesPage.vue";
import { pageDataType, MainMenuItem, SmoothScrollType } from "../types";
import { SmoothScroll } from "../common";
import axios from "axios";
import { TimelineMax, TimelineLite, TweenMax, Expo, Power4 } from "gsap";
import {
  ADD_ANIMATION,
  SET_MENU_LOADED,
  SET_PRELOADER_LOADED
} from "../store/mutations.names";
import { FETCH_MAIN_MENU } from "../store/actions.names";

const plugins = [TimelineMax, Power4, Expo];
@Component({
  components: {
    HomePage,
    BasicPage,
    IndustriesPage,
    CareersPage,
    JobPostPage,
    IndustryPage: IndustriesPage,
    IndustryCategoryPage: IndustriesPage
  }
})
export default class Page extends Vue {
  @Getter("mainMenu") public mainMenu!: MainMenuItem[];
  @Getter("pageData") public pageData!: pageDataType;
  @Getter("pageType") public pageType!: string | null;
  @Getter("mainTimeLine") public masterTl: any;
  @Getter("isPageImageLoaded") public isPageImageLoaded!: boolean;
  @Action(FETCH_MAIN_MENU) public [FETCH_MAIN_MENU]: any;
  @Mutation(ADD_ANIMATION) public [ADD_ANIMATION]: any;
  @Mutation(SET_MENU_LOADED) public [SET_MENU_LOADED]: any;
  @Mutation(SET_PRELOADER_LOADED) public [SET_PRELOADER_LOADED]: any;
  @Getter("isPreloaderLoaded") public preloaded!: boolean;
  public menuTl: any | null = null;
  public menuToggle: boolean = false;
  public isLogoWhite: boolean = false;
  public scrollFunc: (() => void) | null = null;
  public preloaderDoneLoadingOnce: boolean = false;

  get isIndustryPage(): boolean {
    if (this.pageType == null) {
      return false;
    }
    return (
      ["IndustriesPage", "IndustryPage", "IndustryCategoryPage"].indexOf(
        this.pageType
      ) > -1
    );
  }

  get pageTitle(): string {
    return this.pageData
      ? `${this.pageData.title} | Rangs Group`
      : "Rangs Group";
  }

  get haveFooter() {
    if (!this.pageType) {
      return false;
    }
    return (
      ["BasicPage", "CareersPage", "JobPostPage"].indexOf(this.pageType) > -1
    );
  }

  public goToPage(url: string) {
    this.menuTl.progress(1).reverse();
    this.menuToggle = false;
    this.$router.push(url);
  }

  public beforeRouteEnter(to: any, from: any, next: any) {
    next((vm: any) => {
      vm.$store.dispatch(FETCH_MAIN_MENU);
    });
  }

  @Watch("pageTitle")
  public handlePageTitleChange(val: any, oldVal: any) {
    document.title = val;
  }

  public menuEnter() {
    this.scrollFunc = this.createScrollFunc();
    // if (this.pageType != "HomePage") {
    new TimelineMax({
      onComplete: () => {
        this[SET_MENU_LOADED](true);

        this.createMobileMenuTransition();
      }
    })
      .fromTo(
        ".brand-logo",
        1,
        {
          y: -80,
          autoAlpha: 0
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: Expo.easeOut,
          // zIndex: '15',
          clearProps: "all"
        },
        "+=1.0" as any
      )
      .staggerFromTo(
        ".navbar li",
        1,
        {
          autoAlpha: 0,
          y: 30
        },
        {
          autoAlpha: 1,
          y: 0,
          ease: Expo.easeOut
          // clearProps: "all"
        },
        0.06,
        "-=0.5" as any
      );
    // }
  }

  public mounted() {
    document.title = this.pageTitle;
    //new SmoothScroll();

    // this.scrollFunc = this.createScrollFunc();

    this[FETCH_MAIN_MENU]();
    this[ADD_ANIMATION](this.preloaderOnMount());
  }

  public createMobileMenuTransition() {
    const self = this;

    const { navBarNav } = this.$refs;
    const menuTl = new TimelineMax({
      paused: true
    })
      .to(".top-bar", 0.4, {
        rotation: 45,
        y: 10
      })
      .to(
        ".mid-bar",
        0.4,
        {
          x: 100
        },
        "-=0.3"
      )
      .to(
        ".bottom-bar",
        0.4,
        {
          rotation: -45,
          y: -10
        },
        "-=0.3"
      )
      .fromTo(
        navBarNav,
        0.8,
        {
          xPercent: 100,
          opacity: 0
        },
        {
          xPercent: 0,
          opacity: 1,
          ease: Expo.easeOut
        },
        "-=0.5"
      )
      .staggerFromTo(
        ".mob-nav-item",
        0.25,
        {
          yPercent: 50,
          opacity: 0
        },
        {
          yPercent: 0,
          opacity: 1,
          ease: Expo.easeOut
        },
        0.1,
        "-=0.5"
      );

    this.menuTl = menuTl;
  }

  public mobileMenuEnter(el: any, done: any): void {
    this.menuTl.progress(0).play();
  }

  public mobileMenuLeave(el: any, done: any): void {
    this.menuTl.progress(1).reverse();
  }

  @Watch("pageType")
  public handlePageTypeChange(val: any, oldVal: any) {
    const headerBar = this.$refs.header as HTMLElement;
    const menubars = this.$refs.menubars as HTMLElement;
    const menubar = this.$refs.menubar as HTMLElement;
    const midmenubar = this.$refs.midmenubar as HTMLElement;
    if (headerBar) {
      headerBar.removeAttribute("style");
      this.scrollFunc = this.createScrollFunc(val);
    }
    if (menubars) {
      menubars.removeAttribute("style");
      this.scrollFunc = this.createScrollFunc(val);
    }
    if (menubar) {
      menubar.removeAttribute("style");
      this.scrollFunc = this.createScrollFunc(val);
    }
    if (midmenubar) {
      midmenubar.removeAttribute("style");
      this.scrollFunc = this.createScrollFunc(val);
    }
  }

  @Watch("scrollFunc")
  public handleScrollFuncChange(val: any, oldVal: any) {
    if (oldVal) {
      window.removeEventListener("scroll", oldVal, false);
    }
    window.addEventListener("scroll", val, false);
  }

  public createScrollFunc(pageType?: string) {
    pageType = pageType || (this.pageType as string);
    const headerBar = this.$refs.header as HTMLElement;
    const menubars = this.$refs.menubars as HTMLElement;
    const menubar = this.$refs.menubar as HTMLElement;
    const midmenubar = this.$refs.midmenubar as HTMLElement;
    switch (pageType) {
      case "IndustriesPage":
        return () => {
          if (window.pageYOffset > 1) {
            headerBar.style.background = "#204498";
            this.isLogoWhite = true;
            headerBar.style.position = "fixed";
            headerBar.style.zIndex = "999";
            headerBar.style.height = "100px";
          } else {
            headerBar.style.background = "none";
            this.isLogoWhite = false;
            headerBar.style.position = "fixed";
            headerBar.style.height = "100px";
          }
        };
      case "IndustryPage":
        return () => {
          if (window.pageYOffset > 1) {
            headerBar.style.background = "#204498";
            headerBar.style.position = "fixed";
            headerBar.style.zIndex = "999";
            headerBar.style.height = "100px";
            this.isLogoWhite = true;
            menubars.style.background = "#fff";
            menubar.style.background = "#fff";
            midmenubar.style.background = "#fff";
          } else {
            menubars.style.background = "#000";
            menubar.style.background = "#000";
            midmenubar.style.background = "#000";
            this.isLogoWhite = false;
            headerBar.style.position = "fixed";
            headerBar.style.background = "none";
            headerBar.style.height = "100px";
          }
        };
      default:
        return () => {
          if (window.pageYOffset > 50) {
            headerBar.style.background = "#204498";
            headerBar.style.position = "fixed";
            headerBar.style.zIndex = "999";
            headerBar.style.height = "100px";
            this.isLogoWhite = true;
          } else {
            this.isLogoWhite = false;
            headerBar.style.background = "none";
            headerBar.style.height = "100px";
          }
        };
    }
  }

  public preloaderOnMount() {
    const preloader =
      (this.$refs.homeoverlay as HTMLElement) ||
      document.querySelector("#overlay");
    const svgLogo = preloader.querySelector("svg");
    const bigText = svgLogo!.querySelectorAll(".big-text") as any;
    const subText = preloader.querySelectorAll(".rgroup");
    const preloadeTl = new TimelineMax({});
    preloadeTl
      .staggerFromTo(
        bigText,
        0.7,
        {
          cycle: {
            y: [200, -200]
          },
          opacity: 0
        },
        {
          y: 0,
          opacity: 1
          // clearProps: 'all'
        },
        -0.2
      )
      .staggerFromTo(
        subText,
        1,
        {
          opacity: 0
        },
        {
          opacity: 1,
          // clearProps: 'all'
          onComplete: () => {
            this.preloaderDoneLoadingOnce = true;
          }
        },
        "-=0.6" as any
      );

    return preloadeTl;
  }

  public preloader(el: any, done: any) {
    const preloader =
      (this.$refs.homeoverlay as HTMLElement) ||
      document.querySelector("#overlay");
    const svgLogo = preloader.querySelector("svg");
    const preloadeTl = new TimelineMax({
      onComplete: () => {
        this[SET_PRELOADER_LOADED](true);
      }
    });
    preloadeTl
      .to(
        svgLogo as any,
        0.5,
        {
          opacity: 0
        },
        "-=0.3" as any
      )
      .fromTo(
        preloader,
        2,
        {
          height: "100vh"
        },
        {
          height: "0",
          ease: Expo.easeInOut
        },
        "-=0.7" as any
      );
    return preloadeTl;
  }

  public enter(el: any, done: any) {
    TweenMax.fromTo(
      el,
      0.6,
      {
        autoAlpha: 0,
        scale: 1.2
      },
      {
        autoAlpha: 1,
        scale: 1,
        transformOrigin: "50% 50%",
        ease: Power4.easeOut,
        onComplete: done
      }
    );
  }
  public leave(el: any, done: any) {
    TweenMax.fromTo(
      el,
      0.6,
      {
        autoAlpha: 1
      },
      {
        autoAlpha: 0,
        ease: Expo.easeOut,
        onComplete: done
      }
    );
  }
}
</script>
