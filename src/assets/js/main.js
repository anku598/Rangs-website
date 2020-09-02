//Smooth Scroll

new SmoothScroll();

function SmoothScroll(el) {
  var t = this,
    h = document.documentElement;
  el = el || window;
  t.rAF = false;
  t.target = 0;
  t.scroll = 0;
  t.animate = function () {
    t.scroll += (t.target - t.scroll) * 0.1;
    if (Math.abs(t.scroll.toFixed(5) - t.target) <= 0.47131) {
      cancelAnimationFrame(t.rAF);
      t.rAF = false;
    }
    if (el == window) scrollTo(0, t.scroll);
    else el.scrollTop = t.scroll;
    if (t.rAF) t.rAF = requestAnimationFrame(t.animate);
  };
  el.onmousewheel = function (e) {
    e.preventDefault();
    e.stopPropagation();
    var scrollEnd =
      el == window ?
      h.scrollHeight - h.clientHeight :
      el.scrollHeight - el.clientHeight;
    t.target += e.wheelDelta > 0 ? -50 : 50;
    if (t.target < 0) t.target = 0;
    if (t.target > scrollEnd) t.target = scrollEnd;
    if (!t.rAF) t.rAF = requestAnimationFrame(t.animate);
  };
  el.onscroll = function () {
    if (t.rAF) return;
    t.target = el == window ? pageYOffset || h.scrollTop : el.scrollTop;
    t.scroll = t.target;
  };
}

// Menu Bar Animation
let headerBar = document.querySelector(".header");
let brandLogo = document.querySelector(".brand-logo > img");
var Menu = document.querySelector("#navbar-toggle");
var navItem = document.querySelectorAll(".nav-item");
var navbarNav = document.querySelector(".navbar-nav");
var navItem = document.querySelectorAll(".nav-item");
let open = true;

masterTl = new TimelineMax({});

document.addEventListener("DOMContentLoaded", function () {
  function Preloader() {
    var preloader = document.querySelector("#overlay");
    var bigText = document.querySelectorAll(".big-text");
    var subText = document.querySelectorAll(".rgroup");
    var svgLogo = document.querySelectorAll("svg");

    var preloadeTl = new TimelineMax({});
    preloadeTl
      .staggerFromTo(
        bigText,
        0.7, {
          cycle: {
            y: [200, -200]
          },
          opacity: 0
        }, {
          y: 0,
          opacity: 1
          // clearProps: 'all'
        },
        -0.2
      )
      .staggerFromTo(
        subText,
        1, {
          opacity: 0
        }, {
          opacity: 1
          // clearProps: 'all'
        },
        "-=0.6"
      )
      .to(
        svgLogo,
        0.5, {
          opacity: 0
        },
        "-=0.3"
      )
      .fromTo(
        preloader,
        2, {
          height: "100vh"
        }, {
          height: "0",
          ease: Expo.easeInOut
        },
        "-=0.7"
      );
    return preloadeTl;
  }
  // Home Content TimeLine
  function homeContent() {
    var navBaranim = document.querySelector(".navbar");
    var navBaranimLi = document.querySelectorAll(".navbar li");
    var timelineAnimation = new TimelineMax({
      paused: true
    });
    if (window.innerWidth >= 768) {
      timelineAnimation
        .staggerFromTo(
          ".title , .sub-text, .scroll-btn",
          1, {
            yPercent: 100,
            autoAlpha: 0
          }, {
            yPercent: 0,
            autoAlpha: 1,
            ease: Expo.easeOut
            // clearProps: 'all'
          },
          0.2
        )
        .fromTo(
          ".scroll-text",
          0.6, {
            yPercent: 50,
            opacity: 0
          }, {
            yPercent: 0,
            opacity: 1
            // clearProps: 'all'
          },
          "-=0.6"
        )
        .fromTo(
          ".down-scroll",
          1.5, {
            yPercent: 0,
            opacity: 1
          }, {
            yPercent: 12,
            opacity: 1,
            repeat: -1,
            yoyo: true
          },
          "-=0.5"
        )

        .fromTo(
          ".brand-logo",
          1, {
            y: -80,
            autoAlpha: 0
          }, {
            y: 0,
            autoAlpha: 1,
            ease: Expo.easeOut
            // clearProps: 'all'
          },
          "-=1.4"
        )
        .staggerFromTo(
          navBaranimLi,
          1, {
            autoAlpha: 0,
            y: 30
          }, {
            autoAlpha: 1,
            y: 0,
            ease: Expo.easeOut
            // clearProps: 'all'
          },
          0.06,
          "-=1"
        );
    } else {
      timelineAnimation
        .staggerFromTo(
          ".title .animation",
          1.9, {
            yPercent: 100,
            autoAlpha: 0
          }, {
            yPercent: 0,
            autoAlpha: 1,
            ease: Expo.easeOut
          },
          0.1,
          "-=0.5"
        )
        .fromTo(
          ".logo",
          1, {
            y: -80,
            autoAlpha: 0
          }, {
            y: 0,
            autoAlpha: 1,
            ease: Expo.easeOut
          },
          "-=1.5"
        )
        .fromTo(
          "#menu-toggle",
          0.8, {
            x: 600,
            autoAlpha: 0
          }, {
            x: 0,
            autoAlpha: 1
          },
          "-=1.5"
        )
        .fromTo(
          ".btn",
          1.3, {
            yPercent: -50,
            autoAlpha: 0
          }, {
            yPercent: 0,
            autoAlpha: 1,
            ease: Expo.easeOut
          },
          "-=1"
        );
    }
    return timelineAnimation;
  }

  masterTl.add(Preloader()).add(homeContent().play(), "-=0.8");
});

Menu.addEventListener("click", revealMenu);

var menuTl = new TimelineMax({
  paused: true
});

menuTl.to(".top-bar", 0.4, {
  rotation: 45,
  y: 10
});
menuTl.to(
  ".mid-bar",
  0.4, {
    x: 100
  },
  "-=0.3"
);

menuTl.to(
  ".bottom-bar",
  0.4, {
    rotation: -45,
    y: -10
  },
  "-=0.3"
);
// menuTl.fromTo(navbarNav, 0.8,{x:1000}, {x:0},'-=0.7');
// menuTl.staggerFromTo(navItem, 0.8,{x:50,opacity:0} ,{x:0,opacity:1,ease:Expo.easeOut},0.2,'-=0.1');

function revealMenu() {
  if (open === false) {
    menuTl.play();
    navbarNav.style.display = "inline-flex";
  }
  if (open === true) {
    menuTl.reverse();
  }
  open = !open;
}

// Scroll Menu Goes Here

window.addEventListener("scroll", function (e) {
  if (window.pageYOffset > 50) {
    headerBar.style.background = "#204498";
    headerBar.style.position = "fixed";
    headerBar.style.zIndex = "4";
    headerBar.style.height = "90px";
  } else {
    headerBar.style.background = "none";
    headerBar.style.height = "120px";
  }
});

// About page Loader Animation

var aboutImg = document.querySelector(".about-img > picture > img");
var fakeLoader = document.querySelector(".blank-div");
console.log(aboutImg);

document.addEventListener("DOMContentLoaded", pageLoad);

function pageLoad() {
  var pageloadTl = new TimelineMax({});

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
      1, {
        left: "7.5%",
        right: "7.5%",
        transformOrigin: "center center",
        ease: Expo.easeOut
      },
      "-=0.01"
    )
    .to(
      fakeLoader,
      1, {
        height: 0,
        ease: Power2.easeOut
      },
      "-=0.45"
    )
    .fromTo(
      aboutImg,
      2.9, {
        scale: 1.2
      }, {
        scale: 1
        // ease: SlowMo.ease.config(0.1, 0.1, false)
      },
      "-=2.6"
    )
    .staggerFromTo(
      ".short-title, .long-title, .desc",
      1, {
        yPercent: 70,
        opacity: 0
      }, {
        yPercent: 0,
        opacity: 1,
        ease: Expo.easeOut
      },
      0.15,
      "-=1.1"
    );
}


// Concern Block Content Reveal
var blockContent = document.querySelectorAll('.concern-content')
var blockContentTl = new TimelineMax({})
blockContent.forEach(function (blocks, index) {
  blocks.addEventListener('mouseenter', function () {
    blockContentTl
      .fromTo('.block-reveals', 1, {
        display: 'none',
        height: 0,
      }, {
        display: 'block',
        height: '100%',
        ease: Expo.easeOut
      })
  })
})
var blockRevealTl = new TimelineMax({})

// blockRevealTl
//   .fromTo('.concern-content', 1, {
//     xPercent: 0,
//   }, {
//     xPercent: 100,
//     ease: Expo.easeOut
//   })


var controller = new ScrollMagic.Controller();

// Image reveal for About page
var animateImgOverlay = new TimelineMax({});
animateImgOverlay.fromTo(
  ".overlay-block",
  2, {
    skewX: 30,
    scale: 1.7
  }, {
    skewX: 0,
    xPercent: 110,
    transformOrigin: "0% 100%",
    ease: Power4.easeOut
  }
);

var scene = new ScrollMagic.Scene({
    triggerElement: ".strengths",
    offset: 10,
    reverse: false,
    triggerHook: "onCenter"
  })
  .setTween(animateImgOverlay)
  .addTo(controller);

//Video Reveal for About Page

var animateVideoOverlay = new TimelineMax({});
animateVideoOverlay.fromTo(
  ".video-overlay",
  2, {
    skewX: 30,
    scale: 1.7
  }, {
    skewX: 0,
    xPercent: 110,
    transformOrigin: "0 100%",
    ease: Power4.easeOut
  }
);

var scene2 = new ScrollMagic.Scene({
    triggerElement: ".video-container",
    reverse: false,
    offset: 70
  })
  .setTween(animateVideoOverlay)
  .addTo(controller);

//Content image Reveal for Concern Page
var concernOverlayTl = new TimelineMax({});
concernOverlayTl
  .fromTo(
    ".concern-overlay-reveal",
    2, {
      // skewY: 15,
      scale: 1.7
    }, {
      // skewY: 0,
      scale: 1,
      yPercent: 100,
      transformOrigin: "0 100%",
      ease: Power4.easeOut
    }
  )
  .fromTo(
    ".concern-details .bigImg",
    2.5, {
      scale: 1.5
    }, {
      scale: 1,
      ease: Power4.easeOut,
      clearProps: "all"
    },
    "-=2.1"
  );

var scene3 = new ScrollMagic.Scene({
    triggerElement: ".bigImg",
    reverse: false,
    offset: 50,
    duration: 1800,
    triggerHook: "onEnter"
  })
  .setTween(concernOverlayTl)
  .addTo(controller);

//Content image reveal Two for Concern page

var concernOverlayTl2 = new TimelineMax({});

concernOverlayTl2
  .staggerFromTo(
    ".concern-smallImg-reveal",
    2.5, {
      skewX: 30,
      scale: 1.7
    }, {
      skewX: 0,
      xPercent: 110,
      transformOrigin: "0 100%",
      ease: Power4.easeOut
    },
    0.5
  )
  .staggerFromTo(
    ".concern-details .smallImg",
    2.5, {
      scale: 1.5
    }, {
      scale: 1,
      ease: Power4.easeOut,
      clearProps: "all"
    },
    0.5,
    "-=3"
  );

var scene4 = new ScrollMagic.Scene({
    triggerElement: ".smallImg",
    reverse: false,
    offset: -200,
    triggerHook: "onCenter"
  })
  .setTween(concernOverlayTl2)
  .addTo(controller);

// Contact Map Animation

var MapAreaTl = new TimelineMax({});

MapAreaTl.fromTo(
  ".map-overlay",
  2, {
    scaleY: 1
  }, {
    scaleY: 0,
    ease: Power4.easeInOut,
    transformOrigin: "center bottom"
  }
).fromTo(
  ".map-address",
  1, {
    yPercent: 20,
    opacity: 0
  }, {
    yPercent: 0,
    opacity: 1,
    ease: Power4.easeInOut,
    clearProps: "all"
  },
  "-=0.8"
);

var scene5 = new ScrollMagic.Scene({
    triggerElement: "#rg-map",
    reverse: false,
    offset: -40,
    triggerHook: "onEnter"
  })
  .setTween(MapAreaTl)
  .addTo(controller);

// Contact Form Animation

var contactFormTl = new TimelineMax({});
contactFormTl
  .staggerFromTo(
    ".custom-radio",
    1, {
      yPercent: 100,
      opacity: 0
    }, {
      opacity: 1,
      yPercent: 0,
      ease: Expo.easeOut,
      clearProps: "all"
    },
    0.12
  )
  .fromTo(
    ".form-row",
    1, {
      yPercent: 100,
      opacity: 0
    }, {
      yPercent: 0,
      opacity: 1,
      ease: Expo.easeOut
    },
    "-=0.9"
  );

var scene6 = new ScrollMagic.Scene({
    triggerElement: ".contact-form",
    reverse: false,
    offset: -150,
    duration: "100%",
    triggerHook: "onCenter"
  })
  .setTween(contactFormTl)
  .addTo(controller);