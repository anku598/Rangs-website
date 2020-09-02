<template>
  <div class="section-start">
    <div class="row m-0">
      <div class="col-md-12 p-0">
        <form
          v-if="!submitted"
          class="contact-form"
          ref="form"
        >
          <div class="check-control">
            <div
              v-for="(subject, idx) in subjects"
              class="custom-control custom-radio custom-style"
              :key="'customRadio' + idx"
            >
              <input
                type="radio"
                :id="'customRadio' + idx"
                name="customRadio"
                :value="subject.id"
                v-model="submissionForm.subject"
                class="custom-control-input"
                v-validate="'required'"
              >
              <label
                class="custom-control-label"
                :for="'customRadio' + idx"
              >{{subject.text}}</label>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-6 pr-2">
              <label for="fullname">Full Name
                <sup>*</sup>
              </label>
              <input
                type="text"
                :class="{'form-control': true, 'error': errors.has('Full Name')}"
                name="Full Name"
                v-model="submissionForm.full_name"
                v-validate="'required|alpha_spaces'"
                required
              >
            </div>
            <div class="form-group col-md-6 pl-2">
              <label for="company">Company</label>
              <input
                type="text"
                name="Company"
                class="form-control"
                v-model="submissionForm.company"
              >
            </div>

            <div class="form-group col-md-6 pr-2">
              <label for="email">Email
                <sup>*</sup>
              </label>
              <input
                type="email"
                name="Email"
                :class="{'form-control': true, 'error': errors.has('Email')}"
                v-model="submissionForm.email"
                v-validate="'required|email'"
                required
              >
            </div>

            <div class="form-group col-md-6 pl-2">
              <label for="phone">Phone</label>
              <input
                type="text"
                name="Phone"
                :class="{'form-control': true, 'error': errors.has('Phone')}"
                v-model="submissionForm.phone"
              >
            </div>

            <div class="form-group col-md-12">
              <label for="comment">Message
                <sup>*</sup>
              </label>
              <textarea
                :class="{'form-control': true, 'error': errors.has('Message')}"
                rows="15"
                id="comment"
                name="Message"
                v-model="submissionForm.message"
                v-validate="'required'"
                required
              ></textarea>
            </div>
          </div>
          <button
            v-on:click.prevent="submitForm()"
            type="submit"
            class="btn custom-form-btn"
          >Send Message
            <img
              src="../assets/img/right-arrow.svg"
              alt
            >
          </button>
        </form>
        <div
          v-else
          class="thanks-message"
        >
          <h2>Thank you!</h2>
          <p>We will get back to you as soon as possible.</p>
          <button
            type="submit"
            class="btn custom-form-btn"
            v-on:click="resetForm()"
          >Submit Again
            <img
              src="../assets/img/right-arrow.svg"
              alt
            >
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import axios from "axios";
import { API_URL } from "../global";
import { TimelineMax, Expo } from "gsap";
import ScrollMagic from "scrollmagic";

const DEFAULT_FORM: { [key: string]: any } = {
  full_name: "",
  email: "",
  company: "",
  phone: "",
  message: "",
  subject: null
};

@Component({
  name: "ContactForm"
})
export default class ContactForm extends Vue {
  @Prop() public compData!: string | null;
  @Prop() public smController!: any | null;
  public subjects: any | null = [];
  public errors!: any | null;
  public submitted: boolean = false;
  public $validator!: any | null;
  public submissionForm: { [key: string]: any } = JSON.parse(
    JSON.stringify(DEFAULT_FORM)
  );

  public addAnimation(): void {
    const { form } = this.$refs;
    const customRadios = (form as HTMLElement).querySelectorAll(
      ".custom-radio"
    );
    const formRows = (form as HTMLElement).querySelectorAll(".form-row");
    console.log(this.smController, form, customRadios, formRows);
    const contactFormTl = new TimelineMax({ paused: true });
    contactFormTl
      .staggerFromTo(
        customRadios,
        1,
        {
          yPercent: 100,
          opacity: 0
        },
        {
          opacity: 1,
          yPercent: 0,
          ease: Expo.easeOut,
          clearProps: "all"
        },
        0.12
      )
      .fromTo(
        formRows,
        1,
        {
          yPercent: 100,
          opacity: 0
        },
        {
          yPercent: 0,
          opacity: 1,
          ease: Expo.easeOut
        },
        "-=0.9"
      );

    new ScrollMagic.Scene({
      triggerElement: ".contact-form",
      reverse: false,
      offset: 250,
      duration: "100%",
      triggerHook: "onEnter"
    })
      .setTween(contactFormTl.progress(0).resume())
      .addTo(this.smController);
  }

  public mounted() {
    this.getSubjects();
    this.$nextTick(() => {
      this.addAnimation();
    });
  }

  public resetForm() {
    this.submissionForm = JSON.parse(JSON.stringify(DEFAULT_FORM));
    this.submitted = false;
  }

  public submitForm() {
    this.$validator.validate().then(() => {
      console.log(this.errors);
      if (this.errors.items.length == 0) {
        axios
          .post(`${API_URL}/others/contact/`, this.submissionForm)
          .then(resp => {
            this.submitted = true;
          });
      }
    });
  }

  public getSubjects(): void {
    axios.get(`${API_URL}/others/contact-subjects/`).then(({ data }) => {
      this.subjects = data;
      this.$nextTick(() => {
        this.addAnimation();
      });
    });
  }
}
</script>
