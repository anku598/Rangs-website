<template>
  <transition v-on:enter="doPageLoad" v-bind:css="false" appear>
    <div
      class="basic-page"
      :key="pageData.id"
      v-show="pageData && isPageImageLoaded"
      :style="{paddingBottom: pageData.padding}"
    >
      <BasicHeader></BasicHeader>

      <div class="section-start">
        <div class="row m-0">
          <div class="col-md-12 p-0">
            <div class="card-details">
              <h4 class="short-title">JOIN TEAM RANGS</h4>
              <h2 class="long-title">{{pageData.title}}</h2>
              <div class="desc" v-html="pageData.description"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-for="(block, idx) in pageData.body" :key="block.id + idx">
        <component :is="block.type" :comp-data="block.value" :sm-controller="controller"/>
      </div>
      <div class="section-start">
        <div class="rg-career-apply-area">
          <div class="rg-career-form-area">
            <div class="row mx-0">
              <div class="col-lg-12 pl-0 pr-0">
                <div class="rg-career-apply-form">
                  <form v-if="!submitted" id="apply-form" action>
                    <div class="row">
                      <div class="col-md-6">
                        <label for="fname">
                          Full Name
                          <sup>*</sup>
                        </label>
                        <input
                          type="text"
                          name="Full Name"
                          id="fname"
                          :class="{'error': errors.has('Full Name')}"
                          v-model="applicationData.full_name"
                          v-validate="'required|alpha_spaces'"
                        >
                      </div>

                      <div class="col-md-6">
                        <label for="email">
                          Email
                          <sup>*</sup>
                        </label>
                        <input
                          :class="{'error': errors.has('Email')}"
                          type="email"
                          name="Email"
                          id="email"
                          v-model="applicationData.email"
                          v-validate="'required|email'"
                        >
                      </div>

                      <div class="col-md-6">
                        <label for="phnum">
                          Phone
                          <sup>*</sup>
                        </label>
                        <input
                          type="tel"
                          name="Phone Number"
                          :class="{'error': errors.has('Phone Number')}"
                          id="phnum"
                          v-model="applicationData.phone"
                          v-validate="'required'"
                        >
                      </div>

                      <div class="col-md-6">
                        <label for="linkedin">LinkedIn Profile</label>
                        <input
                          type="url"
                          name="LinkedIn"
                          id="linkedin"
                          v-model="applicationData.linkedin"
                        >
                      </div>

                      <div class="col-md-12">
                        <label for="message">
                          Additional Message
                          <sup>*</sup>
                        </label>
                        <textarea
                          name="Message"
                          id="message"
                          cols="60"
                          rows="15"
                          :class="{'error': errors.has('Message')}"
                          v-model="applicationData.message"
                          v-validate="'required'"
                        ></textarea>
                      </div>

                      <div class="col-md-12">
                        <span class="btn custom-form-btn cv-upload-btn">
                          <label class="btn btn-file">
                            Attach CV
                            <input
                              type="file"
                              v-validate="'required|ext:pdf,doc,docx'"
                              data-vv-name="cv"
                              ref="cv"
                              hidden
                            >
                            <img src="../assets/img/upload-icon.svg" alt="Rangs Group">
                          </label>
                        </span>
                        
                        <button
                          type="submit"
                          class="btn custom-form-btn"
                          v-on:click.prevent="submitForm()"
                        >
                          Send Message
                          <img src="../assets/img/right-arrow.svg" alt="Rangs Group">
                        </button>
                      </div>
                    </div>
                  </form>
                  <div v-else class="thanks-message">
                    <h2>Thank you!</h2>
                    <p>We will get back to you as soon as possible.</p>
                    <button type="submit" class="btn custom-form-btn" v-on:click="resetForm()">
                      Submit Again
                      <img src="../assets/img/right-arrow.svg" alt>
                    </button>
                  </div>
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
import { HOST, API_URL } from "../global";
import { animeDict } from "../animations";
import { TimelineMax, TimelineLite, Expo, Power2 } from "gsap";
import ScrollMagic from "scrollmagic";
import { ADD_ANIMATION, SET_PAGE_IMAGE_LOADED } from "../store/mutations.names";
import GoogleMap from "../components/GoogleMap.vue";
import ConcernCarousel from "../components/CocernCarousel.vue";
import ContactForm from "../components/ContactForm.vue";
import RichText from "../components/RichText.vue";
import BasicHeader from "../components/BasicHeader.vue";
import axios from "axios";

const DEFAULT_APPLICATION_DATA: { [key: string]: any } = {
  job: null,
  full_name: "",
  email: "",
  phone: "",
  linkedin: "",
  message: ""
};

@Component({
  name: "JobPostPage",
  components: {
    rich_text: RichText,
    BasicHeader
  }
})
export default class JobPostPage extends Vue {
  @Getter("pageData") public pageData!: pageDataType;
  @Getter("mainTimeLine") public masterTl: any;
  @Getter("mainTimeLineIsFinished") public mtlFinished!: boolean;
  @Mutation(ADD_ANIMATION) public [ADD_ANIMATION]: any;
  @Mutation(SET_PAGE_IMAGE_LOADED) public setPageImageLoaded: any;
  @Getter("isPageImageLoaded") public isPageImageLoaded!: boolean;
  public HOST: string = HOST;
  public addedAnimation: boolean = false;
  public controller = new ScrollMagic.Controller();
  public applicationData: { [key: string]: any } = JSON.parse(
    JSON.stringify(DEFAULT_APPLICATION_DATA)
  );
  public errors: any | null;
  public submitted: boolean = false;
  public $validator: any | null;
  @Watch("$route")
  public handleRouteChange(to: any, from: any) {
    // this.doPageLoad();
  }

  public mounted() {
    // this.doPageLoad();
    this.applicationData.job = this.pageData.id;
  }

  public resetForm() {
    this.applicationData = JSON.parse(JSON.stringify(DEFAULT_APPLICATION_DATA));
    this.applicationData.job = this.pageData.id;
    this.submitted = false;
  }

  public submitForm() {
    this.$validator.validate().then(() => {
      console.log(this.errors);

      if (this.errors.items.length == 0) {
        const data = JSON.parse(JSON.stringify(this.applicationData));
        data.job = this.pageData.id;
        const formData = new FormData();
        if (this.$refs.cv) {
          formData.append("cv", (this.$refs!.cv as any).files[0]);
          Object.keys(data).map((key: string) => {
            formData.append(key, data[key]);
          });
          axios
            .post(`${API_URL}/others/apply/`, formData, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            })
            .then(resp => {
              this.submitted = true;
            });
        }
      }
    });
  }

  public doPageLoad(el: any, done: any) {
    if (this.mtlFinished) {
      this.pageLoad();
    } else {
      this[ADD_ANIMATION](this.pageLoad, "-=0.65");
    }
    // this.addAnimation();
  }

  public addAnimation(): void {
    if (!this.addedAnimation && this.pageData.body != null) {
      const keys = this.pageData.body.map((item: any) => {
        return item.type;
      });
      const keySets = new Set(keys);
      for (const item of keySets) {
        const anim: any = animeDict[item as string] as any;
        if (anim) {
          anim().addTo(this.controller);
        }
      }
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
