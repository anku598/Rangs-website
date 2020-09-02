export class SmoothScroll {
  constructor(public el: any | null = null) {
    const t: any = this;
    const h = document.documentElement;
    el = el || window;
    t.rAF = false;
    t.target = 0;
    t.scroll = 0;
    t.animate = () => {
      t.scroll += (t.target - t.scroll) * 0.1;
      if (Math.abs(t.scroll.toFixed(5) - t.target) <= 0.47131) {
        cancelAnimationFrame(t.rAF);
        t.rAF = false;
      }
      if (el == window) {
        scrollTo(0, t.scroll);
      } else {
        el.scrollTop = t.scroll;
      }
      if (t.rAF) {
        t.rAF = requestAnimationFrame(t.animate);
      }
    };
    el.onmousewheel = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      const scrollEnd =
        el === window
          ? h.scrollHeight - h.clientHeight
          : el.scrollHeight - el.clientHeight;
      t.target += e.wheelDelta > 0 ? -50 : 50;
      if (t.target < 0) {
        t.target = 0;
      }
      if (t.target > scrollEnd) {
        t.target = scrollEnd;
      }
      if (!t.rAF) {
        t.rAF = requestAnimationFrame(t.animate);
      }
    };
    el.onscroll = () => {
      if (t.rAF) {
        return;
      }
      t.target = el === window ? pageYOffset || h.scrollTop : el.scrollTop;
      t.scroll = t.target;
    };
  }
}
