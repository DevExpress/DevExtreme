import {
  Component,
  JSXComponent,
  InternalState,
  RefObject,
  Ref,
  Effect,
  Method,
} from 'devextreme-generator/component_declaration/common';

import { Widget } from '../common/widget';
import { combineClasses } from '../../utils/combine_classes';
import { DisposeEffectReturn } from '../../utils/effect_return.d';
import domAdapter from '../../../core/dom_adapter';
import { isPlainObject } from '../../../core/utils/type';
import { move } from '../../../animation/translator'; // resetPosition
import { isDxMouseWheelEvent } from '../../../events/utils/index';
import { Deferred } from '../../../core/utils/deferred';
import type { dxPromise } from '../../../core/utils/deferred';

import { ScrollbarProps } from './scrollbar_props';
import {
  /* getElementHeight, */
  DIRECTION_HORIZONTAL,
} from './scrollable_utils';

import {
  dxPointerDown,
  dxPointerUp,
} from '../../../events/short';

const SCROLLABLE_SCROLLBAR_CLASS = 'dx-scrollable-scrollbar';
const SCROLLABLE_SCROLLBAR_ACTIVE_CLASS = 'dx-scrollable-scrollbar-active';
const SCROLLABLE_SCROLL_CLASS = 'dx-scrollable-scroll';
const SCROLLABLE_SCROLL_CONTENT_CLASS = 'dx-scrollable-scroll-content';
const HOVER_ENABLED_STATE = 'dx-scrollbar-hoverable';

const THUMB_MIN_SIZE = 15;

export const viewFunction = (viewModel: Scrollbar): JSX.Element => {
  const {
    cssClasses, styles, scrollRef, scrollbarRef, hoverStateEnabled,
    props: { activeStateEnabled },
    restAttributes,
  } = viewModel;

  return (
    <Widget
      rootElementRef={scrollbarRef}
      classes={cssClasses}
      activeStateEnabled={activeStateEnabled}
      hoverStateEnabled={hoverStateEnabled}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restAttributes}
    >
      <div className={viewModel.scrollClasses} style={styles} ref={scrollRef}>
        <div className={SCROLLABLE_SCROLL_CONTENT_CLASS} />
      </div>
    </Widget>
  );
};

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class Scrollbar extends JSXComponent<ScrollbarProps>() {
  @InternalState() active = false;

  @InternalState() cachedVariables = {
    location: 0,
  };

  @Ref() scrollbarRef!: RefObject<HTMLDivElement>;

  @Ref() scrollRef!: RefObject<HTMLDivElement>;

  @Method()
  moveTo(location): void {
    const { visibilityMode } = this.props;

    if (visibilityMode === 'never') {
      return;
    }

    let position = location;
    const prop = this.props.direction === DIRECTION_HORIZONTAL ? 'left' : 'top';

    if (isPlainObject(location)) {
      position = location[prop] || 0;
    }

    const scrollBarLocation = {};
    scrollBarLocation[prop] = this.calculateScrollBarPosition(position);
    move(this.scrollRef, scrollBarLocation);
  }

  calculateScrollBarPosition(location): number {
    return -location * this.thumbRatio();
  }

  @Effect()
  pointerDownEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollbar';

    dxPointerDown.on(this.scrollRef,
      () => {
        this.feedbackOn();
      }, { namespace });

    return (): void => dxPointerDown.off(this.scrollRef, { namespace });
  }

  @Effect()
  pointerUpEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollbar';

    dxPointerUp.on(domAdapter.getDocument(),
      () => {
        this.feedbackOff();
      }, { namespace });

    return (): void => dxPointerUp.off(this.scrollRef, { namespace });
  }

  // eslint-disable-next-line class-methods-use-this
  isThumb(element: HTMLDivElement): boolean {
    return element.classList.contains(SCROLLABLE_SCROLL_CLASS)
    || element.classList.contains(SCROLLABLE_SCROLL_CONTENT_CLASS);
  }

  @Method()
  isScrollbar(element: HTMLDivElement): boolean {
    return element === this.scrollbarRef;
  }

  @Method()
  validateEvent(event): boolean {
    const { target } = event.originalEvent;

    return (this.isThumb(target) || this.isScrollbar(target));
  }

  @Method()
  // eslint-disable-next-line class-methods-use-this
  getLocation(): number {
    return this.cachedVariables.location;
  }

  @Method()
  setLocation(location: number): void {
    this.cachedVariables.location = location;
  }

  // @Method()
  // inBounds(): boolean {
  //   const location = this.getLocation();

  //   return this.boundLocation(location) === location;
  // }

  // @Method()
  // boundLocation(location?: number): number {
  //   const currentLocation = location !== undefined ? location : this.getLocation();

  //   return Math.max(Math.min(currentLocation, this.getMaxOffset()), this.getMinOffset());
  // }

  @Method()
  // eslint-disable-next-line class-methods-use-this
  getMaxOffset(): number {
    return 0;
  }

  @Method()
  getMinOffset(): number {
    return -Math.max(this.props.contentSize - this.props.containerSize, 0);
  }

  @Method()
  getDirection(): string {
    return this.props.direction;
  }

  // getAxis(): string {
  //   return this.props.direction === DIRECTION_HORIZONTAL ? 'x' : 'y';
  // }

  @Method()
  initHandler(e): dxPromise<void> {
    const stopDeferred = Deferred<void>();

    // this.stopScrolling();
    this.prepareThumbScrolling(e);
    return stopDeferred.promise();
  }

  prepareThumbScrolling(e): void {
    if (isDxMouseWheelEvent(e.originalEvent)) {
      return;
    }

    const { target } = e.originalEvent;
    const scrollbarClicked = this.isScrollbar(target);

    if (scrollbarClicked) {
      this.moveToMouseLocation(e);
    }

    // const thumbScrolling = scrollbarClicked || this.isThumb(target);
    // (this.cachedVariables as any).thumbScrolling = thumbScrolling;
    // (this.cachedVariables as any).crossThumbScrolling = !thumbScrolling
    // && this.isAnyThumbScrolling(target);

    // if (thumbScrolling) {
    //   this.feedbackOn();
    // }
  }

  // eslint-disable-next-line
  moveToMouseLocation(e): void {
    // const { containerRef, scrollableOffset } = this.props;

    // const mouseLocation = e[`page${this.getAxis().toUpperCase()}`] - scrollableOffset;
    // const location = this.getLocation() + mouseLocation
    // / this.containerToContentRatio() - getElementHeight(containerRef.current) / 2;

    // this.scrollStep(-Math.round(location));
  }

  // scrollStep(delta): void {
  //   const prevLocation = this.getLocation();

  //   this.setLocation(prevLocation + delta);
  //   this.suppressBounce();
  //   this.move();

  //   if (Math.abs(prevLocation - this.getLocation()) < 1) {
  //     // eslint-disable-next-line no-useless-return
  //     return;
  // }

  //   // eventsEngine.triggerHandler(this.containerRef, { type: 'scroll' });
  // }

  // suppressBounce(): void {
  //   if (this.props.bounceEnabled || this.inBounds()) {
  //     return;
  //   }

  //   (this.cachedVariables as any).velocity = 0;
  //   this.setLocation(this.boundLocation());
  // }

  // move(location?: number): void {
  //   const currentLocation = location !== undefined
  //     ? location * this.props.scaleRatio
  //     : this.getLocation();

  //   this.setLocation(currentLocation);

  //   this.moveContent();
  //   this.moveTo(this.getLocation());
  // }

  // moveContent(): void {
  //   const scrollProp = this.getDirection()
  // === DIRECTION_HORIZONTAL ? 'scrollLeft' : 'scrollTop';
  //   const location = this.getLocation();

  //   this.props.containerRef.current[scrollProp] = -location / this.props.scaleRatio;
  //   this.moveContentByTranslator(location);
  // }

  // moveContentByTranslator(location): undefined | void {
  //   const direction = this.getDirection();
  //   let translateOffset;
  //   const prop = direction === DIRECTION_HORIZONTAL ? 'left' : 'top';
  //   const minOffset = this.getMinOffset();

  //   if (location > 0) {
  //     translateOffset = location;
  //   } else if (location <= minOffset) {
  //     translateOffset = location - minOffset;
  //   } else {
  //     translateOffset = location % 1;
  //   }

  //   if ((this.cachedVariables as any).translateOffset === translateOffset) {
  //     return;
  //   }

  //   const targetLocation = {};
  //   targetLocation[prop] = translateOffset;
  //   (this.cachedVariables as any).translateOffset = translateOffset;

  //   if (translateOffset === 0) {
  //     resetPosition(this.props.contentRef.current);
  //     return;
  //   }

  //   move(this.props.contentRef.current, targetLocation);
  // }

  // eslint-disable-next-line class-methods-use-this
  // isAnyThumbScrolling(target): boolean {
  //   const result = false;

  //   // this._eventHandler('isThumbScrolling', $target)
  //   .done(function(isThumbScrollingVertical, isThumbScrollingHorizontal) {
  //   //     result = isThumbScrollingVertical || isThumbScrollingHorizontal;
  //   // });
  //   return result;
  // }

  thumbSize(): number {
    const { containerSize, scaleRatio } = this.props;

    const size = Math.round(
      Math.max(Math.round(containerSize * this.containerToContentRatio()), THUMB_MIN_SIZE),
    );

    return size / scaleRatio;
  }

  thumbRatio(): number {
    const { contentSize, containerSize, scaleRatio } = this.props;

    return (containerSize - this.thumbSize()) / (scaleRatio * (contentSize - containerSize));
  }

  containerToContentRatio(): number {
    const { contentSize, containerSize } = this.props;

    return (contentSize ? containerSize / contentSize : containerSize);
  }

  private getDimension(): string {
    return this.props.direction === DIRECTION_HORIZONTAL ? 'width' : 'height';
  }

  private feedbackOn(): void {
    this.active = true;
  }

  private feedbackOff(): void {
    this.active = false;
  }

  get cssClasses(): string {
    const { direction } = this.props;

    const classesMap = {
      [SCROLLABLE_SCROLLBAR_CLASS]: true,
      [`dx-scrollbar-${direction}`]: true,
      [SCROLLABLE_SCROLLBAR_ACTIVE_CLASS]: !!this.active,
      [HOVER_ENABLED_STATE]: !!this.hoverStateEnabled,
    };
    return combineClasses(classesMap);
  }

  get styles(): { [key: string]: string | number } {
    const style = this.restAttributes.style || {};

    return {
      ...style,
      display: this.props.needScrollbar ? '' : 'none',
      [this.getDimension()]: this.thumbSize() || THUMB_MIN_SIZE,
    };
  }

  get scrollClasses(): string {
    return combineClasses({
      [SCROLLABLE_SCROLL_CLASS]: true,
      'dx-state-invisible': !this.props.visible,
    });
  }

  get hoverStateEnabled(): boolean {
    const { visibilityMode, expandable } = this.props;
    return (visibilityMode === 'onHover' || visibilityMode === 'always') && expandable;
  }
}
