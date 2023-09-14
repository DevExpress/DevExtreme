import {
  Component,
  JSXComponent,
  InternalState,
  RefObject,
  Ref,
  Effect,
  Method,
} from '@devextreme-generator/declarations';

import { combineClasses } from '../../../utils/combine_classes';
import { EffectReturn } from '../../../utils/effect_return';
import domAdapter from '../../../../core/dom_adapter';
import {
  DIRECTION_HORIZONTAL, SCROLLABLE_SCROLLBAR_CLASS,
  SCROLLABLE_SCROLL_CLASS,
  SCROLLABLE_SCROLL_CONTENT_CLASS,
  SCROLLABLE_SCROLLBAR_ACTIVE_CLASS,
  HOVER_ENABLED_STATE,
  ShowScrollbarMode,
} from '../common/consts';

import {
  subscribeToDXPointerDownEvent,
  subscribeToDXPointerUpEvent,
  subscribeToMouseEnterEvent,
  subscribeToMouseLeaveEvent,
} from '../../../utils/subscribe_to_event';

import { ScrollbarProps } from '../common/scrollbar_props';
import { ScrollableSimulatedProps } from '../common/simulated_strategy_props';

export const THUMB_MIN_SIZE = 15;

export const viewFunction = (viewModel: Scrollbar): JSX.Element => {
  const {
    scrollbarRef, thumbRef, scrollbarClasses, thumbClasses, thumbStyles, hidden,
  } = viewModel;

  return (
    <div className={scrollbarClasses} ref={scrollbarRef} hidden={hidden}>
      <div className={thumbClasses} style={thumbStyles} ref={thumbRef}>
        <div className={SCROLLABLE_SCROLL_CONTENT_CLASS} />
      </div>
    </div>
  );
};

export type ScrollbarPropsType = ScrollbarProps
// eslint-disable-next-line @typescript-eslint/no-type-alias
& Pick<ScrollableSimulatedProps, 'bounceEnabled' | 'showScrollbar' | 'scrollByThumb'>;

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class Scrollbar extends JSXComponent<ScrollbarPropsType>() {
  @Ref() scrollbarRef!: RefObject<HTMLDivElement>;

  @Ref() scrollRef!: RefObject<HTMLDivElement>;

  @Ref() thumbRef!: RefObject<HTMLDivElement>;

  @InternalState() hovered = false;

  @InternalState() active = false;

  @Effect({ run: 'once' })
  pointerDownEffect(): EffectReturn {
    return subscribeToDXPointerDownEvent(
      this.thumbRef.current, () => {
        this.active = true;
      },
    );
  }

  @Effect({ run: 'once' })
  pointerUpEffect(): EffectReturn {
    return subscribeToDXPointerUpEvent(
      domAdapter.getDocument(), () => {
        this.active = false;
      },
    );
  }

  @Effect()
  mouseEnterEffect(): EffectReturn {
    if (this.isExpandable) {
      return subscribeToMouseEnterEvent(
        this.scrollbarRef.current, () => {
          this.hovered = true;
        },
      );
    }

    return undefined;
  }

  @Effect()
  mouseLeaveEffect(): EffectReturn {
    if (this.isExpandable) {
      return subscribeToMouseLeaveEvent(
        this.scrollbarRef.current, () => {
          this.hovered = false;
        },
      );
    }

    return undefined;
  }

  @Method()
  isThumb(element: EventTarget | null): boolean {
    return this.scrollbarRef.current!.querySelector(`.${SCROLLABLE_SCROLL_CLASS}`) === element
      || this.scrollbarRef.current!.querySelector(`.${SCROLLABLE_SCROLL_CONTENT_CLASS}`) === element;
  }

  @Method()
  isScrollbar(element: EventTarget | null): boolean {
    return element === this.scrollbarRef.current;
  }

  @Method()
  setActiveState(): void {
    this.active = true;
  }

  get dimension(): 'width' | 'height' {
    return this.isHorizontal ? 'width' : 'height';
  }

  get isHorizontal(): boolean {
    return this.props.direction === DIRECTION_HORIZONTAL;
  }

  get scrollSize(): number {
    return Math.max(this.props.containerSize * this.containerToContentRatio, THUMB_MIN_SIZE);
  }

  get containerToContentRatio(): number {
    return this.props.contentSize
      ? this.props.containerSize / this.props.contentSize
      : this.props.containerSize;
  }

  get scrollRatio(): number {
    const scrollOffsetMax = Math.abs(this.props.maxOffset);

    if (scrollOffsetMax) {
      return (this.props.containerSize - this.scrollSize) / scrollOffsetMax;
    }

    return 1;
  }

  get scrollbarClasses(): string {
    const classesMap = {
      [SCROLLABLE_SCROLLBAR_CLASS]: true,
      [`dx-scrollbar-${this.props.direction}`]: true,
      [SCROLLABLE_SCROLLBAR_ACTIVE_CLASS]: this.active,
      [HOVER_ENABLED_STATE]: this.isExpandable,
      'dx-state-invisible': this.hidden,
      'dx-state-hover': this.isExpandable && this.hovered,
    };
    return combineClasses(classesMap);
  }

  get thumbStyles(): { [key: string]: string | number } {
    return {
      [this.dimension]: Math.round(this.scrollSize) || THUMB_MIN_SIZE,
      transform: this.isNeverMode ? 'none' : this.thumbTransform,
    };
  }

  get thumbTransform(): string {
    const translateValue = -this.props.scrollLocation * this.scrollRatio;

    if (this.isHorizontal) {
      return `translate(${translateValue}px, 0px)`;
    }

    return `translate(0px, ${translateValue}px)`;
  }

  get thumbClasses(): string {
    return combineClasses({
      [SCROLLABLE_SCROLL_CLASS]: true,
      'dx-state-invisible': !this.isThumbVisible,
    });
  }

  get hidden(): boolean {
    return this.isNeverMode || this.props.maxOffset === 0 || this.props.containerSize < 15;
  }

  get isThumbVisible(): boolean {
    if (this.hidden) {
      return false;
    }
    if (this.isHoverMode) {
      return this.props.visible || this.hovered || this.active;
    }
    if (this.isAlwaysMode) {
      return true;
    }

    return this.props.visible;
  }

  get isExpandable(): boolean {
    return (this.isHoverMode || this.isAlwaysMode) && this.props.scrollByThumb;
  }

  get isHoverMode(): boolean {
    return this.props.showScrollbar === ShowScrollbarMode.HOVER;
  }

  get isAlwaysMode(): boolean {
    return this.props.showScrollbar === ShowScrollbarMode.ALWAYS;
  }

  get isNeverMode(): boolean {
    return this.props.showScrollbar === ShowScrollbarMode.NEVER;
  }
}
