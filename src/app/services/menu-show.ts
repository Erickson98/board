export class sikFloatingMenu {
  menuEl = null;
  constructor(_menu:any) {
    this.menuEl =
      typeof _menu === "string" ? document.querySelector(_menu) : _menu;
    this.attachHandlers();
  }
  attachHandlers() {
    if (this.menuEl) {
      this._on(this.menuEl, "click", ".trigger-menu", this._handler.bind(this));
    }
  }
  _open(item:any) {
    let opened = item.closest(".fmenu").querySelectorAll(".trigger-menu.open");
    for (const ele of opened) {
      this._close(ele);
    }
    item.classList.add("open");
    let list = item.closest("li").querySelector(".floating-menu");
    list.style.setProperty("max-height", this._measureExpandableList(list));
    list.style.setProperty("opacity", "1");
    item.style.setProperty("max-width", this._measureExpandableTrigger(item));
  }
  _close(item:any) {
    let list = item.closest("li").querySelector(".floating-menu");
    item.classList.remove("open");
    list.style.removeProperty("max-height");
    list.style.removeProperty("opacity");
    item.style.removeProperty("max-width");
  }
  _measureExpandableList(list:any) {
    const items = list.querySelectorAll("li");
    return items.length * this._getHeight(items[0], "outer") + 10 + "px";
  }
  _measureExpandableTrigger(item:any) {
    const textEle = item.querySelector(".text");
    const sizeBase = this._getWidth(item, "outer");
    const sizeExpandLabel = this._getWidth(textEle, "outer");
    return sizeBase + sizeExpandLabel + 6 + "px";
  }
  _handler(el:any, ev:any) {
    if (el.classList.contains("open")) {
      this._close(el);
    } else {
      this._open(el);
    }
  }
  _on(ele: any, type: any, selector: any, handler: any) {
      ele.addEventListener(type, (ev: any) => {
        let el = ev.target.closest(selector);
        if (el) handler.call(this, el, ev); // 'this' refers to the class instance here
      });
    }

  _getWidth(el:any, type:any) {
    if (type === "inner") return el.clientWidth;
    else if (type === "outer") return el.offsetWidth;
    return 0;
  }
  _getHeight(el:any, type:any) {
    if (type === "inner") return el.clientHeight;
    else if (type === "outer") return el.offsetHeight;
    return 0;
  }
}
