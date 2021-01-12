import {
  Component,
  JSXComponent,
  InternalState,
  RefObject,
  Ref,
  Effect,
} from 'devextreme-generator/component_declaration/common';

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

const THUMB_MIN_SIZE = 15;

export const viewFunction = (viewModel: Scrollbar): JSX.Element => {
  const { cssClasses, styles, scrollRef } = viewModel;

  return (
    <div className={cssClasses}>
      <div className={SCROLLABLE_SCROLL_CLASS} style={styles} ref={scrollRef}>
        <div className={SCROLLABLE_SCROLL_CONTENT_CLASS} />
      </div>
    </div>
  );
};

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Scrollbar extends JSXComponent<ScrollbarProps>() {
  @InternalState() baseContainerToContentRatio = 0;

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

  private isHidden(): boolean {
    return this.props.visibilityMode === 'never';
  }

  private needScrollbar(): boolean {
    return !this.isHidden() && (this.baseContainerToContentRatio < 1);
  }

  private getDimension(): string {
    const { isHorizontal } = new ScrollDirection(this.props.direction);
    return isHorizontal ? 'width' : 'height';
  }
}
