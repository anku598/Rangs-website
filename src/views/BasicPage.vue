<template>
     <div
      v-show="pageData && isPageImageLoaded"
      :key="pageData.id"
      class="page-container basic-page"
      :style="{paddingBottom: pageData.padding}">
      <BasicHeader v-on:loaded="pageLoaded = true"></BasicHeader>
      <div class="section-start" v-show="pageData && isPageImageLoaded">
        <div class="row m-0">
          <div class="col-md-12 p-0">
            <div class="card-details">
              <h4 class="short-title">{{pageData.card_title}}</h4>
              <h2 class="long-title">{{pageData.long_title}}</h2>
              <div class="desc" v-html="pageData.description"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-for="(block, idx) in pageData.body" :key="block.id + idx">
        <component
          :is="block.type"
          :comp-id="block.id"
          :comp-data="block.value"
          :sm-controller="controller"
        />
      </div>
    </div>

</template>

<script lang="ts">
import { State, Action, Getter, Mutation } from "vuex-class";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { pageDataType } from "../types";
import FullWidthTextAndImage from "../components/FullWidthTextAndImage.vue";
import YoutubeVideo from "../components/YoutubeVideo.vue";
import { HOST } from "../global";
import { animeDict } from "../animations";
import { TimelineMax, TimelineLite, Expo, Power2 } from "gsap";
import ScrollMagic from "scrollmagic";
import "ScrollMagicGSAP";
import { ADD_ANIMATION, SET_PAGE_IMAGE_LOADED } from "../store/mutations.names";
import GoogleMap from "../components/GoogleMap.vue";
import ConcernCarousel from "../components/CocernCarousel.vue";
import ContactForm from "../components/ContactForm.vue";
import BasicHeader from "../components/BasicHeader.vue";

@Component({
  name: "BasicPage",
  components: {
    full_width_text_and_image: FullWidthTextAndImage,
    youtube_video: YoutubeVideo,
    google_map: GoogleMap,
    concern_carousel: ConcernCarousel,
    contact_form: ContactForm,
    BasicHeader
  }
})
export default class BasicPage extends Vue {
  @Getter("pageData") public pageData!: pageDataType;
  @Getter("mainTimeLine") public masterTl: any;
  @Getter("mainTimeLineIsFinished") public mtlFinished!: boolean;
  @Mutation(ADD_ANIMATION) public [ADD_ANIMATION]: any;
  @Getter("isPageImageLoaded") public isPageImageLoaded!: boolean;
  public HOST: string = HOST;
  public addedAnimation: boolean = false;
  public controller = new ScrollMagic.Controller();
  public pageLoaded: boolean = false;

  //public show: boolean = true;

  public emmited(){
      console.log("emmited")
  }

  @Watch("$route")
  public handleRouteChange(to: any, from: any) {
    //this.doPageLoad();
  }

  public mounted() {
    //this.doPageLoad();
  }

}
</script>
