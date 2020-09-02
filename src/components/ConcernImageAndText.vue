<template>
  <div class="more-desc">
    <div class="row" v-if="compData['image_align'] == 'left'">
      <div class="col-lg-6 pdr-30 pl-0 ">
        <div class="concern-img">
          <div class="img-overflow">
            <picture>
              <img :src="HOST + compData.image.original.src" :alt="compData.label">
            </picture>
          </div>
          <div v-if="compData.label" class="img-name left-one">{{compData.label}}</div>
        </div>
      </div>
      <div class="col-lg-6 pdl-30 pr-0">
        <div class="desc-text right-one" v-html="compData.text"></div>
      </div>
    </div>

    <div v-else class="row custom-reverse mx-0">
      <div class="col-lg-6 pdr-30 pl-0">
        <div class="desc-text left-one" v-html="compData.text"></div>
      </div>

      <div class="col-lg-6 pdl-30 pr-0">
       <transition v-on:leave="leaveTransitionHandler" v-on:enter="enterTransitionHandler" appear>
        <div class="concern-img">
          <div class="img-overflow">
            <picture>
              <img :src="HOST + compData.image.original.src" :alt="compData.label">
            </picture>
          </div>
          <div v-if="compData.label" class="img-name right-one">{{compData.label}}</div>
        </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { componentDataType } from "../types";
import { TimelineMax, Power2, Power4 } from "gsap";
import { HOST } from "../global";

@Component({
  name: "ConcernImageText"
})
export default class ConcernImageAndText extends Vue {
  @Prop() public compData: any | null;
  public HOST: string = HOST;
   public currentEnterTransition: string | null = null;
  public currentLeaveTransition: string | null = null;
public mounted() {
    this.$nextTick(() => {
      this.anims();
     
    });
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
 public anims(): void {
     var animas = new TimelineMax({});
     animas
    .staggerFromTo(
      ".concern-img",
     .8,
      {
        autoAlpha: 0,
        opacity: 0,
        scale: .5,
        yPercent: 50
      },
      {
        autoAlpha: 1,
        opacity: 1,
        scale: 1,
        delay: 1.5,
        yPercent: 0,
        ease: Power4.easeOut,
         clearProps: "all"
      }, .08
    )
    .staggerFromTo(
      ".desc-text p",
     .9,
      {
        autoAlpha: 0,
        opacity: 0,
        yPercent: 10
      },
      {
        autoAlpha: 1,
        opacity: 1,
        delay: .1,
        yPercent: 0,
        ease: Power4.easeOut,
         clearProps: "all"
      }, .08
    );
   
  }

}
</script>
