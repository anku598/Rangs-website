import { TimelineMax, TimelineLite, Expo, Power4 } from 'gsap';
import ScrollMagic from 'scrollmagic';
import 'ScrollMagicGSAP';

export function textWithImageScene(): any {
  const animateImgOverlay = new TimelineMax({});
  animateImgOverlay.fromTo(
    '.overlay-block',
    2,
    {
      skewX: 30,
      scale: 1.7,
    },
    {
      skewX: 0,
      xPercent: 110,
      transformOrigin: '0% 100%',
      ease: Power4.easeOut,
    },
  );
  return new ScrollMagic.Scene({
    triggerElement: '.strengths',
    offset: 10,
    reverse: false,
    triggerHook: 'onCenter',
  }).setTween(animateImgOverlay);
}

// Video Reveal for About Page

function youtubeVideoScene(): any {
  const animateVideoOverlay = new TimelineMax({});
  animateVideoOverlay.fromTo(
    '.video-overlay',
    2,
    {
      skewX: 30,
      scale: 1.7,
    },
    {
      skewX: 0,
      xPercent: 110,
      transformOrigin: '0 100%',
      ease: Power4.easeOut,
    },
  );
  return new ScrollMagic.Scene({
    triggerElement: '.video-container',
    reverse: false,
    offset: 70,
  }).setTween(animateVideoOverlay);
}

export const animeDict: { [key: string]: any } = {
  youtube_video: youtubeVideoScene,
  full_width_text_and_image: textWithImageScene,
};
