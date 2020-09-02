<template>
  <div
    class="video-container"
    ref="cont"
  >
    <div class="chrome-clip">
      <iframe
        id="ytplayer"
        type="text/html"
        width="640"
        :autoplay="(this.compData.autoplay) ? 1 : 0"
        height="360"
        scrolling="yes"
        :src="embedURL"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    <div
      class="video-overlay"
      ref="overlay"
    ></div>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { componentDataType } from "../types";
import { HOST } from "../global";
import { TimelineMax, Power4 } from "gsap";
import ScrollMagic from "scrollmagic";
@Component({
  name: "YoutubeVideo"
})
export default class YoutubeVideo extends Vue {
  @Prop() public compData: any | null;
  @Prop() public smController: any | null;
  public HOST: string = HOST;

  get embedURL(): string {
    let ID = "";
    const url = this.compData.url
      .replace(/(>|<)/gi, "")
      .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    } else {
      ID = url;
    }
    return `https://www.youtube.com/embed/${ID}?autoplay=${
      this.compData.autoplay ? 1 : 0
    }`;
  }

  public addAnimation(): void {
    const { cont, overlay } = this.$refs;
    const animateVideoOverlay = new TimelineMax({ paued: true });
    animateVideoOverlay.fromTo(
      overlay,
      2,
      {
        skewX: 30,
        scale: 1.7
      },
      {
        skewX: 0,
        xPercent: 110,
        transformOrigin: "0 100%",
        ease: Power4.easeOut
      }
    );
    new ScrollMagic.Scene({
      triggerElement: cont,
      reverse: false,
      offset: 70
    })
      .setTween(animateVideoOverlay.progress(0).resume())
      .addTo(this.smController);
  }

  public mounted() {
    this.$nextTick(() => {
      this.addAnimation();
    });
  }
}
</script>
