export default class AutoScrollHandler {
  scroll: HTMLElement;
  scrollSpeed: number = 0;
  scrollThreshold: number = 100;
  animationFrame: number | null = null;
  direction: number = 0;
  initialSpeed: number = 0;
  maxSpeed: number = 50;
  acceleration: number = 0.8;

  constructor(scroll: HTMLElement) {
    this.scroll = scroll;
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.mouseLeaveHandler = this.mouseLeaveHandler.bind(this);
    this.animateScroll = this.animateScroll.bind(this);
  }

  start() {
    this.scroll.addEventListener('mousemove', this.mouseMoveHandler);
    this.scroll.addEventListener('mouseleave', this.mouseLeaveHandler);
  }

  stop() {
    this.scroll.removeEventListener('mousemove', this.mouseMoveHandler);
    this.scroll.removeEventListener('mouseleave', this.mouseLeaveHandler);
    this.stopAutoScroll();
  }

  mouseMoveHandler(e: MouseEvent) {
    const { left, right } = this.scroll.getBoundingClientRect();
    const x = e.clientX;

    if (x < left + this.scrollThreshold) {
      const distance = left + this.scrollThreshold - x;
      this.direction = -1;
      this.initialSpeed = this.calculateInitialSpeed(distance);
      this.scrollSpeed = this.initialSpeed;
      this.startAutoScroll();
    } else if (x > right - this.scrollThreshold) {
      const distance = x - (right - this.scrollThreshold);
      this.direction = 1;
      this.initialSpeed = this.calculateInitialSpeed(distance);
      this.scrollSpeed = this.initialSpeed;
      this.startAutoScroll();
    } else {
      this.direction = 0;
      this.scrollSpeed = 0;
    }
  }

  mouseLeaveHandler() {
    this.direction = 0;
    this.scrollSpeed = 0;
    this.initialSpeed = 0;
    this.stopAutoScroll(); // <- esto cancela el frame inmediatamente
  }

  startAutoScroll() {
    if (this.animationFrame === null) {
      this.animateScroll();
    }
  }

  stopAutoScroll() {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  animateScroll() {
    if (this.direction !== 0) {
      this.scroll.scrollLeft += this.scrollSpeed * this.direction;

      if (this.scrollSpeed < this.maxSpeed) {
        this.scrollSpeed += this.acceleration;
      }

      this.animationFrame = requestAnimationFrame(this.animateScroll);
    } else {
      this.stopAutoScroll();
    }
  }

  calculateInitialSpeed(distance: number): number {
    const normalized = Math.min(distance / this.scrollThreshold, 1);
    const eased = Math.pow(normalized, 2);
    return eased * this.maxSpeed * 0.3;
  }
}
