/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { GanttView } from '@ts/ui/gantt/ui.gantt.view';
import ScrollView from '@ts/ui/scroll_view/scroll_view';

export class TaskAreaContainer {
  // @ts-expect-error ts-error
  _scrollView: ScrollView;

  _element: HTMLElement;

  constructor(element, ganttViewWidget: GanttView) {
    this._element = element;

    this._scrollView = ganttViewWidget._createComponent(this._element, ScrollView, {
      scrollByContent: false,
      scrollByThumb: true,
      showScrollbar: 'onHover',
      direction: 'both',
      onScroll: () => { ganttViewWidget.updateView(); },
    });
  }

  // ITaskAreaContainer
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get scrollTop() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._scrollView.scrollTop();
  }

  set scrollTop(value) {
    const diff = value - this._scrollView.scrollTop();
    if (diff !== 0) {
      this._scrollView.scrollBy({ left: 0, top: diff });
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get scrollLeft() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._scrollView.scrollLeft();
  }

  set scrollLeft(value) {
    const diff = value - this._scrollView.scrollLeft();
    if (diff !== 0) {
      this._scrollView.scrollBy({ left: diff, top: 0 });
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get scrollWidth() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._scrollView.scrollWidth();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get scrollHeight() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._scrollView.scrollHeight();
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  get isExternal(): boolean {
    return true;
  }

  getWidth(): number {
    return this._element.offsetWidth;
  }

  getHeight(): number {
    return this._element.offsetHeight;
  }

  getElement(): HTMLElement {
    return this._element;
  }
}
