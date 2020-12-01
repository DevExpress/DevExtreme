import {
  Component,
  JSXComponent,
  Method,
  Ref,
  Effect,
  InternalState,
} from 'devextreme-generator/component_declaration/common';
import {
  dxPointerDown,
} from '../../../events/short';
import { Widget } from '../common/widget';
import { combineClasses } from '../../utils/combine_classes';
import { EffectReturn } from '../../utils/effect_return.d';

import { ScrollbarProps } from './common/scrollbar_props';
import { move } from '../../../animation/translator';

// const SCROLLBAR = 'dxScrollbar';
// const SCROLLABLE_SCROLLBAR_CLASS = 'dx-scrollable-scrollbar';
const SCROLLABLE_SCROLLBAR_ACTIVE_CLASS = 'dx-scrollable-scrollbar-active';
const SCROLLABLE_SCROLL_CLASS = 'dx-scrollable-scroll';
const SCROLLABLE_SCROLL_CONTENT_CLASS = 'dx-scrollable-scroll-content';
// const HOVER_ENABLED_STATE = 'dx-scrollbar-hoverable';
// const HORIZONTAL = 'horizontal';
const THUMB_MIN_SIZE = 15;

// const DIRECTION_VERTICAL = 'vertical';
const DIRECTION_HORIZONTAL = 'horizontal';

// const SCROLLBAR_VISIBLE = {
//   onScroll: 'onScroll',
//   onHover: 'onHover',
//   always: 'always',
//   never: 'never',
// };

// const activeScrollbar = null;

const getCssClasses = (model: Partial<ScrollBar> & Partial<ScrollbarProps>): string => {
  const { direction, active } = model;

  const classesMap = {
    'dx-scrollable-scrollbar': true,
    [`dx-scrollbar-${direction}`]: true,
    [SCROLLABLE_SCROLLBAR_ACTIVE_CLASS]: !!active,
  };

  return combineClasses(classesMap);
};

export const viewFunction = ({
  cssClasses, scrollbarRef, scrollRef, scrollContentRef, styles,
  restAttributes,
}: ScrollBar): JSX.Element => (
  <Widget // TODO: id attribute
    ref={scrollbarRef as any}
    classes={cssClasses}
    {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
  >
    <div className={SCROLLABLE_SCROLL_CLASS} style={styles} ref={scrollRef as any}>
      <div className={SCROLLABLE_SCROLL_CONTENT_CLASS} ref={scrollContentRef as any} />
    </div>
  </Widget>
);

/* istanbul ignore next: class has only props default */

@Component({
  jQuery: { register: true },
  view: viewFunction,
})

export class ScrollBar extends JSXComponent<ScrollbarProps>() {
  @InternalState() active = false;

  @Ref() scrollbarRef!: HTMLDivElement;

  @Ref() scrollRef!: HTMLDivElement;

  @Ref() scrollContentRef!: HTMLDivElement;

  @Method()
  moveTo(location: any): void { // TODO: any
    // if (this._isHidden()) {
    //   return;
    // }

    // if (isPlainObject(location)) {
    //   location = location[this._prop] || 0;
    // }

    const scrollBarLocation = {};
    scrollBarLocation[this.getProp()] = this.calculateScrollBarPosition(location);
    move(this.scrollRef, scrollBarLocation);
  }

  @Effect()
  cancelEffect(): EffectReturn {
    const namespace = 'dxScrollbar';

    dxPointerDown.on(this.scrollRef,
      (e: Event) => {
        this.pointerDownHandler(e);
      }, { namespace });

    return (): void => dxPointerDown.off(this.scrollRef, { namespace });
  }

  private calculateScrollBarPosition(location: any): number { // todo: Any
    console.log(this);
    return -location * 1; // this._thumbRatio;
  }

  private pointerDownHandler(e: Event): void {
    console.log(e);
    this.active = true;
    this.moveTo(-100);
  }

  get cssClasses(): string {
    return getCssClasses({ ...this.props, active: this.active });
  }

  get styles(): { [key: string]: string | number } {
    const style = this.restAttributes.style || {};
    const { scaleRatio } = this.props;

    const containerSize = Math.round(this.props.containerSize);
    const contentSize = Math.round(this.props.contentSize);
    let baseContainerSize = Math.round(this.props.baseContainerSize);
    // let baseContentSize = Math.round(this.props.baseContentSize);

    // NOTE: if current scrollbar's using outside of scrollable
    // if (isNaN(baseContainerSize)) {
    if (baseContainerSize) {
      baseContainerSize = containerSize;
      // baseContentSize = contentSize;
    }

    // TODO: How To save this values?
    // const baseContainerToContentRatio = (baseContentSize
    //   ? baseContainerSize / baseContentSize : baseContainerSize);
    const realContainerToContentRatio = (contentSize
      ? containerSize / contentSize : containerSize);
    const thumbSize = Math.round(Math.max(Math.round(containerSize
      * realContainerToContentRatio), THUMB_MIN_SIZE));
    // const thumbRatio = (containerSize - thumbSize)
    //   / (scaleRatio * (contentSize - containerSize));

    // this.$element().css('display', this._needScrollbar() ? '' : 'none'); //TODO

    return {
      ...style,
      [`${this.getDimension()}`]: thumbSize / scaleRatio,
    };
  }

  private getDimension(): string {
    const { direction } = this.props;
    return direction === DIRECTION_HORIZONTAL ? 'width' : 'height';
  }

  private getProp(): string {
    const { direction } = this.props;
    return direction === DIRECTION_HORIZONTAL ? 'left' : 'top';
  }
}
