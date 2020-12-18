import {
  Component,
  JSXComponent,
} from 'devextreme-generator/component_declaration/common';

import { Widget } from '../common/widget';
import { combineClasses } from '../../utils/combine_classes';

import {
  ScrollbarProps,
} from './scrollbar_props';

const SCROLLBAR_SCROLL_CLASS = 'dx-scrollable-scroll';
const SCROLLBAR_SCROLL_CONTENT_CLASS = 'dx-scrollable-scroll-content';

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
      [`dx-scrollable-scrollbar dx-scrollbar-${direction}`]: true,
      'dx-scrollbar-hoverable': isHoverable,
    };
    return combineClasses(classesMap);
  }
}
