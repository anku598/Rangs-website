<template>
  <div
    v-if="compData"
    class="section-start custom-section-padding"
  >
    <div class="row m-0">
      <div class="col-md-12 p-0">
        <div class="our-strength">
          <div class="row m-0">
            <div class="col-md-6 col-sm-12 p-0 d-flex flex-column">
              <h2
                class="strength-title"
                v-html="compData.title.replace('\n', '<br />')"
              ></h2>
              <transition
                v-on:enter="addAnimation"
                appear
              >

                <picture
                  class="strengths"
                  v-show="imageLoaded"
                  ref="pic"
                >
                  <source
                    media="(max-width: 425px)"
                    :srcset="HOST + compData.image.mobile.src"
                  >
                  <source
                    media="(max-width: 1024px)"
                    :srcset="HOST + compData.image.tab.src"
                  >
                  <img
                    :src="HOST + compData.image.original.src"
                    alt
                    class="img-responsive"
                    :id="compId"
                    @load="imageLoaded = true"
                  >
                  <div
                    class="overlay-block"
                    ref="overlay"
                  ></div>
                </picture>
              </transition>
            </div>
            <div class="col-md-6 col-sm-12 p-0">
              <div
                class="details"
                v-html="compData.text"
                id="compData"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { componentDataType } from "../types";
import { HOST } from "../global";
import { TimelineMax, Power4 } from "gsap";
import ScrollMagic from "scrollmagic";
import "ScrollMagicGSAP";

@Component({
  name: "FullWidthTextAndImage"
})
export default class FullWidthTextAndImage extends Vue {
  @Prop() public compData: any | null;
  @Prop() public smController: any | null;
  @Prop() public compId!: string;
  public HOST: string = HOST;
  public imageLoaded: boolean = false;

  public addAnimation(): void {
    const { overlay, pic } = this.$refs;
    const animateImgOverlay = new TimelineMax({ paused: true });
    animateImgOverlay.fromTo(
      overlay,
      2,
      {
        skewX: 30,
        scale: 1.7
      },
      {
        skewX: 0,
        xPercent: 110,
        transformOrigin: "0% 100%",
        ease: Power4.easeOut
      }
    );

    let scene = new ScrollMagic.Scene({
      triggerElement: pic,
      offset: 10,
      reverse: false,
      triggerHook: "onCenter"
    })
      .setTween(animateImgOverlay.progress(0).resume())
      .addTo(this.smController);
  }

  public mounted() {
    // this.$nextTick(() => {
    //   this.addAnimation();
    // });
  }
}
</script>
