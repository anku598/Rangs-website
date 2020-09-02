<template>
  <div
    class="col-lg-10 col-sm-10 xs-screen-custom2 p-0 offset-sm-3 offset-lg-2 ind-bg"
    v-if="pageData"
  >
    <transition v-on:leave="leaveTransitionHandler" v-on:enter="enterTransitionHandler" appear>
      <div class="inner-width">
        <div class="concern-header">
          <picture>
            <img v-if="pageData.image" :src="HOST + pageData.image.url" alt>
          </picture>

          <div class="card">
            <div class="card-body sub-concern-header">
              <h3 class="sub-concern-title">{{pageData.title}}</h3>
              <p class="sub-concern-text">{{pageData.description}}</p>
            </div>
          </div>
        </div>

        <component
          v-for="(block, idx) in pageData.body"
          :key="block.id + idx"
          :is="block.type"
          :comp-data="block.value"
          :sm-controller="controller"
        />
      </div>
    </transition>
  </div>
</template>


<script lang="ts">
import { HOST, API_URL } from "../global";
import { State, Action, Getter, Mutation } from "vuex-class";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { TimelineMax, Power2, Power4 } from "gsap";
import { pageDataType } from "../types";
import ScrollMagic from "scrollmagic";
import ConcernText from "../components/CocernText.vue";
import ConcernImageAndText from "../components/ConcernImageAndText.vue";
@Component({
  name: "IndustryPage",
  components: {
    simple_text: ConcernText,
    image_and_text: ConcernImageAndText
  }
})
export default class IndustryPage extends Vue {
  @Getter("pageData") public pageData!: pageDataType;
  public HOST: string = HOST;
  public currentEnterTransition: string | null = null;
  public currentLeaveTransition: string | null = null;
  public controller = new ScrollMagic.Controller();

public mounted() {
    this.$nextTick(() => {
      this.animindus();
     
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
   public animindus(): void {
     var animindustry = new TimelineMax({});
     animindustry
     .staggerFromTo(
      ".concern-header",
      1,
      {
        autoAlpha: 0,
        opacity: 0,
        //scale: .5,
        yPercent: -30
      },
      {
        autoAlpha: 1,
        opacity: 1,
        delay: .9,
        yPercent: 0,
        // scale: 1,
        //force3D:true,
        ease: Power4.easeOut,
         clearProps: "all"
      }, -.01
    )
    .staggerFromTo(
      ".card",
     1,
      {
        autoAlpha: 0,
        opacity: 0,
       // scale: .5,
        yPercent: 30
      },
      {
        autoAlpha: 1,
        opacity: 1,
        //scale: 1,
         //delay: .01,
        yPercent: 0,
        ease: Power4.easeOut,
         clearProps: "all"
      }
    );
    // .staggerFromTo(
    //   ".concern-img",
    //  1,
    //   {
    //     autoAlpha: 0,
    //     opacity: 0,
    //     scale: .5,
    //     yPercent: 50
    //   },
    //   {
    //     autoAlpha: 1,
    //     opacity: 1,
    //     scale: 1,
    //     yPercent: 0,
    //     ease: Power2.easeOut,
    //      clearProps: "all"
    //   }, .08
    // );
   
  }
}
</script>
