import {
  Component,
  JSXComponent,
} from 'devextreme-generator/component_declaration/common';

import { Widget } from '../common/widget';
import { combineClasses } from '../../utils/combine_classes';
import { ScrollbarProps } from './scrollbar_props';

export const viewFunction = ({
  cssClasses,
  restAttributes,
}: Scrollbar): JSX.Element => (
  <Widget
    classes={cssClasses}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  >
    <div />
  </Widget>
);

@Component({
  view: viewFunction,
})
export class Scrollbar extends JSXComponent<ScrollbarProps>() {
  // eslint-disable-next-line class-methods-use-this
  get cssClasses(): string {
    const classesMap = {
    };
    return combineClasses(classesMap);
  }
}
