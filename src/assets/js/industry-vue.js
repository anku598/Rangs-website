var industryApp = new Vue({
  el: "#app",
  data() {
    return {
      currentPage: 0,
      lock: false,
      nextAnime: null,
      beforeAnime: null,
      pages: [
        {
          name: "Automotive",
          text:
            "The market leader having biggest global automotive brands with unbeatable experience, wide variation of vehicles and consistent quality service.",
          img: "assets/img/industries/automotive.jpg",
          concerns: [
            {
              name: "Rangs MOtors",
              link: "http://google.com"
            },
            {
              name: "Rangs Power",
              link: "http://google.com"
            }
          ]
        },
        {
          name: "Real Estate",
          text: "The market leader having biggest global automotive brands..",
          img: "assets/img/industries/automotive.jpg",
          concerns: [
            {
              name: "Rangs Power",
              link: "http://google.com"
            }
          ]
        },
        {
          name: "Agro",
          text: "The market leader having biggest global automotive brands..",
          img: "assets/img/industries/automotive.jpg",
          concerns: [
            {
              name: "Rangs Power",
              link: "http://google.com"
            },
            {
              name: "Rangs MOtors",
              link: "http://google.com"
            }
          ]
        },
        {
          name: "Power",
          text: "The market leader having biggest global automotive brands..",
          img: "assets/img/industries/automotive.jpg",
          concerns: [
            {
              name: "Rangs Power",
              link: "http://google.com"
            },
            {
              name: "Rangs MOtors",
              link: "http://google.com"
            }
          ]
        },
        {
          name: "Life Style",
          text: "The market leader having biggest global automotive brands..",
          img: "assets/img/industries/automotive.jpg",
          concerns: [
            {
              name: "Rangs Power",
              link: "http://google.com"
            },
            {
              name: "Rangs MOtors",
              link: "http://google.com"
            }
          ]
        },
        {
          name: "Consumer Product",
          text: "The market leader having biggest global automotive brands..",
          img: "assets/img/industries/automotive.jpg",
          concerns: [
            {
              name: "Rangs Power",
              link: "http://google.com"
            },
            {
              name: "Rangs MOtors",
              link: "http://google.com"
            }
          ]
        },
        {
          name: "Pharma",
          text: "The market leader having biggest global automotive brands..",
          img: "assets/img/industries/automotive.jpg",
          concerns: [
            {
              name: "Rangs Power",
              link: "http://google.com"
            },
            {
              name: "Rangs MOtors",
              link: "http://google.com"
            }
          ]
        },
        {
          name: "Construction",
          text: "The market leader having biggest global automotive brands..",
          img: "assets/img/industries/automotive.jpg",
          concerns: [
            {
              name: "Rangs Power",
              link: "http://google.com"
            },
            {
              name: "Rangs MOtors",
              link: "http://google.com"
            }
          ]
        }
      ]
    };
  },
  watch: {
    nextAnime(val) {
      if (val === null && this.lock) {
        return false;
      }
      this.lock = true;
      this.$refs.headWrap.children[this.nextAnime].classList.add("after");
      this.$refs.textWrap.children[this.nextAnime].classList.add("after");
      this.$refs.imgWrap.children[this.nextAnime].classList.add("after");
      this.$refs.concerns.children[this.nextAnime].classList.add("after");
      var self = this;
      var basicTimeline = new TimelineMax({});
      basicTimeline
        .to("#img-column .img-wrapper .active", 1, {
          scaleY: 0,
          transformOrigin: "center bottom",
          ease: Expo.easeInOut,
          clearProps: "all",
          onComplete: function() {
            self.currentPage = val;
            self.nextAnime = null;
          }
        })
        .fromTo(
          "#img-column .img-wrapper .after",
          1,
          {
            height: "0%",
            autoAlpha: 0
          },
          {
            autoAlpha: 1,
            height: "100%",
            ease: Expo.easeInOut,
            clearProps: "all",
            onComplete: function() {
              self.currentPage = val;
              self.nextAnime = null;
            }
          },
          "-=0.8"
        )
        .to(
          "#text-column .main .header-wrapper .active",
          1,
          {
            y: 50,
            autoAlpha: 0,
            ease: Expo.easeInOut,
            clearProps: "all",
            onComplete: function() {
              self.currentPage = val;
              self.nextAnime = null;
            }
          },
          "-=1.1"
        )
        .fromTo(
          "#text-column .main .header-wrapper .after",
          1,
          {
            yPercent: -50,
            autoAlpha: 0
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: Expo.easeOut,
            clearProps: "all",
            onComplete: function() {
              self.currentPage = val;
              self.nextAnime = null;
            }
          },
          "-=0.6"
        )

        .to(
          "#text-column .main .paragraph-wrapper .active",
          1,
          {
            yPercent: 50,
            autoAlpha: 0,
            clearProps: "all",
            onComplete: function() {
              self.currentPage = val;
              self.nextAnime = null;
            }
          },
          "-=1.3"
        )
        .fromTo(
          "#text-column .main .paragraph-wrapper .after",
          1,
          {
            yPercent: -50,
            autoAlpha: 0
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: Expo.easeInOut,
            clearProps: "all",
            onComplete: function() {
              self.currentPage = val;
              self.nextAnime = null;
            }
          },
          "-=1.3"
        )
        .fromTo(
          "#text-column .main .paragraph-wrapper .after",
          1,
          {
            yPercent: -50,
            autoAlpha: 0
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: Expo.easeInOut,
            clearProps: "all",
            onComplete: function() {
              self.currentPage = val;
              self.nextAnime = null;
            }
          },
          "-=1.3"
        )
        .staggerTo(
          "#sub-company .active .concern",
          1,
          {
            yPercent: 100,
            autoAlpha: 0,
            ease: Expo.easeInOut,
            clearProps: "all"
          },
          0.3,
          "-=1.5"
        )
        .staggerFromTo(
          "#sub-company .after .concern",
          1,
          {
            yPercent: -100,
            autoAlpha: 0
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: Expo.easeOut,
            clearProps: "all",
            onComplete: function() {
              self.currentPage = val;
              self.nextAnime = null;
              self.lock = false;
            }
          },
          0.3,
          "-=0.9"
        );
    },
    beforeAnime(val) {
      if (val === null) {
        return false;
      }
      this.$refs.headWrap.children[this.beforeAnime].classList.add("before");
      this.$refs.textWrap.children[this.beforeAnime].classList.add("before");
      this.$refs.imgWrap.children[this.beforeAnime].classList.add("before");
      this.$refs.concerns.children[this.beforeAnime].classList.add("before");
      var self = this;
      var basicTimeline = new TimelineMax({});
      basicTimeline
        .to("#img-column .img-wrapper .active", 1, {
          scaleY: 0,
          transformOrigin: "center top",
          ease: Expo.easeInOut,
          clearProps: "all"
        })
        .fromTo(
          "#img-column .img-wrapper .before",
          1,
          {
            // height: "0%",
            autoAlpha: 0,
            scaleY: 0
          },
          {
            scaleY: 1,
            autoAlpha: 1,
            // height: "100%",
            transformOrigin: "center bottom",
            ease: Expo.easeInOut,
            clearProps: "all",
            onComplete: function() {
              self.currentPage = val;
              self.beforeAnime = null;
            }
          },
          "-=0.8"
        )
        .to(
          "#text-column .main .header-wrapper .active",
          1,
          {
            y: -50,
            autoAlpha: 0,
            ease: Expo.easeInOut,
            clearProps: "all",
            onComplete: function() {
              self.currentPage = val;
              self.beforeAnime = null;
            }
          },
          "-=1.1"
        )
        .fromTo(
          "#text-column .main .header-wrapper .before",
          1,
          {
            yPercent: 50,
            autoAlpha: 0
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: Expo.easeOut,
            clearProps: "all",
            onComplete: function() {
              self.currentPage = val;
              self.beforeAnime = null;
            }
          },
          "-=0.6"
        )

        .to(
          "#text-column .main .paragraph-wrapper .active",
          1,
          {
            yPercent: -50,
            autoAlpha: 0,
            clearProps: "all",
            onComplete: function() {
              self.currentPage = val;
              self.beforeAnime = null;
            }
          },
          "-=1.3"
        )
        .fromTo(
          "#text-column .main .paragraph-wrapper .before",
          1,
          {
            yPercent: 50,
            autoAlpha: 0
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: Expo.easeInOut,
            clearProps: "all",
            onComplete: function() {
              self.currentPage = val;
              self.beforeAnime = null;
            }
          },
          "-=1.3"
        )

        .staggerTo(
          "#sub-company .active .concern",
          1,
          {
            yPercent: -100,
            autoAlpha: 0,
            ease: Expo.easeInOut,
            clearProps: "all"
          },
          0.3,
          "-=1.5"
        )
        .staggerFromTo(
          "#sub-company .before .concern",
          1,
          {
            yPercent: 100,
            autoAlpha: 0
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: Expo.easeOut,
            clearProps: "all",
            onComplete: function() {
              self.currentPage = val;
              self.beforeAnime = null;
            }
          },
          0.3,
          "-=0.9"
        );
    }
  },
  mounted() {},
  methods: {
    handlePageChange(idx) {
      if (idx > this.currentPage) {
        this.nextAnime = idx;
      } else if (idx < this.currentPage) {
        this.beforeAnime = idx;
      }
    }
  }
});

var mastertl = new TimelineMax({});

document.addEventListener("DOMContentLoaded", function() {
  function header() {
    var navLinkTl = new TimelineMax({});

    navLinkTl.staggerFromTo(
      ".nav-item",
      0.9,
      {
        yPercent: 70,
        autoAlpha: 0
      },
      {
        yPercent: 0,
        autoAlpha: 1,
        ease: Expo.easeOut
      },
      0.06
    );

    return navLinkTl;
  }

  function bodyContent() {
    var contentTl = new TimelineMax({});

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
        "-=1.5"
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
        "-=1.1"
      );
    return contentTl;
  }

  function subCompany() {
    var subCompanyTl = new TimelineMax({});

    subCompanyTl
      .set(".concern", {
        autoAlpha: 0
      })
      .set(".sub-company", {
        width: "14%"
      })
      .fromTo(
        ".sub-company",
        1.5,
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
        "-=0.1"
      )
      .to(
        ".sub-company",
        1,
        {
          width: "100%",
          tranformOrigin: "left"
        },
        "-=0.3"
      )
      .staggerFromTo(
        ".concern",
        0.8,
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
        0.09,
        "-=0.5"
      );
    return subCompanyTl;
  }

  mastertl
    .add(header())
    .add(bodyContent(), "-=1")
    .add(subCompany(), "-=1.4");
});
