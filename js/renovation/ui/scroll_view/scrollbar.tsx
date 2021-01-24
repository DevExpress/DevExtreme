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
import { move } from '../../../animation/translator';

import { ScrollbarProps } from './scrollbar_props';
import {
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
    return -location * this.props.thumbRatio;
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

  isScrollbar(element: HTMLDivElement): boolean {
    return element === this.scrollbarRef;
  }

  @Method()
  validateEvent(event): boolean {
    const { target } = event.originalEvent;

    return (this.isThumb(target) || this.isScrollbar(target));
  }

  @Method()
  getDirection(): string {
    return this.props.direction;
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
      width: this.props.width,
      height: this.props.height,
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
