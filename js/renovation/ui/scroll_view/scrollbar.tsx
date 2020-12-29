import {
  Component,
  JSXComponent,
} from 'devextreme-generator/component_declaration/common';

import { combineClasses } from '../../utils/combine_classes';

import { ScrollbarProps } from './scrollbar_props';

import {
  SCROLLABLE_SCROLLBAR_CLASS,
  SCROLLBAR_SCROLL_CLASS,
  SCROLLBAR_SCROLL_CONTENT_CLASS,
} from './scrollable_utils';

export const viewFunction = ({ cssClasses }: Scrollbar): JSX.Element => (
  <div className={cssClasses}>
    <div className={SCROLLBAR_SCROLL_CLASS}>
      <div className={SCROLLBAR_SCROLL_CONTENT_CLASS} />
    </div>
  </div>
);

@Component({
  view: viewFunction,
  defaultOptionRules: null,
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
