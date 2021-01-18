import {
  Component,
  JSXComponent,
  InternalState,
  RefObject,
  Ref,
  Effect,
} from 'devextreme-generator/component_declaration/common';

import { Widget } from '../common/widget';
import { combineClasses } from '../../utils/combine_classes';
import { DisposeEffectReturn } from '../../utils/effect_return.d';
import domAdapter from '../../../core/dom_adapter';

import { ScrollbarProps } from './scrollbar_props';
import {
  ScrollDirection,
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
    cssClasses, styles, scrollRef, hoverStateEnabled,
    props: { activeStateEnabled },
    restAttributes,
  } = viewModel;

  return (
    <Widget
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

  @Ref() scrollRef!: RefObject<HTMLDivElement>;

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
      display: this.needScrollbar() ? '' : 'none',
      [`${this.getDimension()}`]: THUMB_MIN_SIZE,
    };
  }

  get scrollClasses(): string {
    return combineClasses({
      [SCROLLABLE_SCROLL_CLASS]: true,
      'dx-state-invisible': !this.props.visible,
    });
  }

  private needScrollbar(): boolean {
    return this.props.visibilityMode !== 'never' && ((this.props.baseContainerToContentRatio || 0) < 1);
  }

  private getDimension(): string {
    const { isHorizontal } = new ScrollDirection(this.props.direction);
    return isHorizontal ? 'width' : 'height';
  }

  get hoverStateEnabled(): boolean {
    const { visibilityMode, expandable } = this.props;
    return (visibilityMode === 'onHover' || visibilityMode === 'always') && expandable;
  }
}
