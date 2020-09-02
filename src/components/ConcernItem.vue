<template>
  <div
    :class="sizeBasedClasses"
    ref="compBody"
  >
    <div class="concern-details">
      <picture v-if="size <= 1">
        <source
          media="(max-width: 425px)"
          :srcset="HOST + compData.value.image.half_original.src"
        >
        <source
          media="(max-width: 1024px)"
          :srcset="HOST + compData.value.image.full_tab.src"
        >
        <img
          :class="[size <= 1 ? 'bigImg' : 'smallImg']"
          ref="img"
          :src="HOST + compData.value.image.full_original.src"
          :alt="compData.value.title"
        >
      </picture>
      <picture v-else>
        <img
          :class="[size <= 1 ? 'bigImg' : 'smallImg']"
          ref="img"
          :src="HOST + compData.value.image.half_original.src"
          :alt="compData.value.title"
        >
      </picture>
      <div
        class="concern-content"
        ref="content"
      >
        <a
          href="#"
          v-on:click.prevent=""
        >
          <h2>{{compData.value.title}}</h2>
          <img
            src="../assets/img/back.svg"
            alt
          >
        </a>

        <div
          class="block-reveals"
          ref="reveal"
        >
          <p>{{compData.value.text}}</p>
          <button
            v-if="compData.value.page_or_link.link"
            type="button"
            class="btn custom-btn"
            @click.prevent="goToConcern()"
          >
            <span>{{compData.value.anchor || 'Explore More'}}</span>
            <img
              src="../assets/img/right-arrow-long.svg"
              alt="Arrow"
            >
          </button>
        </div>
      </div>
      <div
        :class="[size <= 1 ? 'concern-overlay-reveal' : 'concern-smallImg-reveal']"
        ref="overlay"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { HOST } from "../global";
import { TimelineMax, Power4 } from "gsap";
import ScrollMagic from "scrollmagic";

@Component({
  name: "ConcernItem"
})
export default class ConcernItem extends Vue {
  @Prop() public compData!: any | null;
  @Prop() public size!: number;
  @Prop() public smController!: any | null;
  public HOST: string = HOST;

  public mounted() {
    this.$nextTick(() => {
      this.addAnimation();
      (this.$refs.compBody as HTMLElement).addEventListener(
        "mouseenter",
        this.animateOver,
        false
      );
      (this.$refs.compBody as HTMLElement).addEventListener(
        "mouseleave",
        this.animateOut,
        false
      );
    });
  }

  public goToConcern(): void {
    window.location.href = this.compData.value.page_or_link.link;
  }

  get sizeBasedClasses() {
    switch (this.size) {
      case 1:
        return { "col-md-12": true, "mb-md-3": true, "mb-1-xs": true };
      default:
      case 2:
        return { "col-md-6": true, "mbplr-0": true, "mb-30": true };
      case 3:
        return {
          "col-xl-4": true,
          "col-lg-6": true,
          "mbplr-0": true,
          "mb-30": true
        };
    }
  }

  get screenWidth() {
    return (
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    );
  }

  public animateOver(e: any): void {
    // if (this.screenWidth < 575) {
    //   this.goToConcern();
    //   return;
    // }
    const blockContentTl = new TimelineMax({});
    const { content, reveal, img } = this.$refs;

    blockContentTl
      .to(content, 1.1, {
        height: "100%",
        ease: Power4.easeOut,
        padding: "2rem 2rem"
      })

      .fromTo(
        reveal,
        1,
        {
          yPercent: -30,
          opacity: 0,
          height: 0,
          ease: Power4.easeOut
        },
        {
          yPercent: 0,
          height: "90%",
          opacity: 1,
          ease: Power4.easeOut
        },
        "-=1.1"
      );
    e.preventDefault();
  }

  public animateOut(e: any) {
    const blockContentTl = new TimelineMax({});
    const { content, reveal, img } = this.$refs;
    blockContentTl
      .to(content, 1.1, {
        height: "6vh",
        ease: Power4.easeOut,
        padding: "0.8rem 2rem"
      })
      .fromTo(
        reveal,
        1,
        {
          yPercent: 0,
          opacity: 1,
          height: "90%",
          ease: Power4.easeOut
        },
        {
          yPercent: -30,
          height: "0",
          opacity: 0,
          ease: Power4.easeOut
        },
        "-=0.9"
      );
    e.preventDefault();
  }

  public addAnimation(): void {
    const { overlay, img } = this.$refs;
    let scene: any;
    const concernOverlayTl = new TimelineMax({ paued: true });
    if (this.size <= 1) {
      concernOverlayTl
        .fromTo(
          overlay,
          2,
          {
            // skewY: 15,
            scale: 1.7
          },
          {
            // skewY: 0,
            scale: 1,
            yPercent: 100,
            transformOrigin: "0 100%",
            ease: Power4.easeOut
          }
        )
        .fromTo(
          img,
          2.5,
          {
            scale: 1.5
          },
          {
            scale: 1,
            ease: Power4.easeOut,
            clearProps: "all"
          },
          "-=2.1" as any
        );
      scene = new ScrollMagic.Scene({
        triggerElement: img,
        reverse: false,
        duration: 1800,
        triggerHook: "onEnter"
      }).setTween(concernOverlayTl);
    } else {
      concernOverlayTl
        .fromTo(
          overlay,
          2.5,
          {
            skewX: 30,
            scale: 1.7
          },
          {
            skewX: 0,
            scale: 1,
            xPercent: 110,
            transformOrigin: "0 100%",
            ease: Power4.easeOut
          }
        )
        .fromTo(
          img,
          2.5,
          {
            scale: 1.5
          },
          {
            scale: 1,
            ease: Power4.easeOut,
            clearProps: "all"
          },
          "-=3" as any
        );

      scene = new ScrollMagic.Scene({
        triggerElement: img,
        reverse: false,
        offset: -200,
        triggerHook: "onEnter"
      }).setTween(concernOverlayTl.progress(0).resume());
    }
    scene.addTo(this.smController);
  }
}
</script>
