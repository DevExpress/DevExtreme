import {
  Component,
  JSXComponent,
} from 'devextreme-generator/component_declaration/common';

import { Widget } from '../common/widget';
import { combineClasses } from '../../utils/combine_classes';

import {
  ScrollbarProps,
} from './scrollbar_props';

import {
  SCROLLBAR_HOVERABLE_CLASS,
} from './scrollable_utils';

const SCROLLBAR_SCROLL_CLASS = 'dx-scrollable-scroll';
const SCROLLBAR_SCROLL_CONTENT_CLASS = 'dx-scrollable-scroll-content';
const SCROLLABLE_SCROLLBAR_CLASS = 'dx-scrollable-scrollbar';

export const viewFunction = ({
  cssClasses,
  restAttributes,
}: Scrollbar): JSX.Element => (
  <Widget
    classes={cssClasses}
    {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
  >
    <div className={SCROLLBAR_SCROLL_CLASS}>
      <div className={SCROLLBAR_SCROLL_CONTENT_CLASS} />
    </div>
  </Widget>
);

@Component({
  view: viewFunction,
})
export class Scrollbar extends JSXComponent<ScrollbarProps>() {
  get cssClasses(): string {
    const { direction, visibilityMode, expandable } = this.props;

    const isHoverable = (visibilityMode === 'onHover' || visibilityMode === 'always') && expandable;
    const classesMap = {
      [SCROLLABLE_SCROLLBAR_CLASS]: true,
      [`dx-scrollbar-${direction}`]: true,
      [SCROLLBAR_HOVERABLE_CLASS]: isHoverable,
    };
    return combineClasses(classesMap);
  }
}
