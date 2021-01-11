import {
  Component,
  JSXComponent,
  InternalState,
} from 'devextreme-generator/component_declaration/common';

import { combineClasses } from '../../utils/combine_classes';

import { ScrollbarProps } from './scrollbar_props';
import {
  ScrollDirection,
} from './scrollable_utils';

const SCROLLABLE_SCROLLBAR_CLASS = 'dx-scrollable-scrollbar';
const SCROLLABLE_SCROLL_CLASS = 'dx-scrollable-scroll';
const SCROLLABLE_SCROLL_CONTENT_CLASS = 'dx-scrollable-scroll-content';

const THUMB_MIN_SIZE = 15;

export const viewFunction = (viewModel: Scrollbar): JSX.Element => {
  const { cssClasses, styles } = viewModel;

  return (
    <div className={cssClasses}>
      <div className={SCROLLABLE_SCROLL_CLASS} style={styles}>
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

  get cssClasses(): string {
    const { direction } = this.props;

    const classesMap = {
      [SCROLLABLE_SCROLLBAR_CLASS]: true,
      [`dx-scrollbar-${direction}`]: true,
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
