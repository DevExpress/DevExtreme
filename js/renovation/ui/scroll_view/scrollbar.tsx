import {
  Component,
  JSXComponent,
} from 'devextreme-generator/component_declaration/common';

import { combineClasses } from '../../utils/combine_classes';

import { ScrollbarProps } from './scrollbar_props';

const SCROLLABLE_SCROLLBAR_CLASS = 'dx-scrollable-scrollbar';
const SCROLLBAR_SCROLL_CLASS = 'dx-scrollable-scroll';
const SCROLLBAR_SCROLL_CONTENT_CLASS = 'dx-scrollable-scroll-content';

export const viewFunction = ({ cssClasses }: Scrollbar): JSX.Element => (
  <div className={cssClasses}>
    <div className={SCROLLBAR_SCROLL_CLASS}>
      <div className={SCROLLBAR_SCROLL_CONTENT_CLASS} />
    </div>
  </div>
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Scrollbar extends JSXComponent<ScrollbarProps>() {
  get cssClasses(): string {
    const { direction } = this.props;

    const classesMap = {
      [SCROLLABLE_SCROLLBAR_CLASS]: true,
      [`dx-scrollbar-${direction}`]: true,
    };
    return combineClasses(classesMap);
  }
}
