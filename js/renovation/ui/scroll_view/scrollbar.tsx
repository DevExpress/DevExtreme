import {
  Component,
  JSXComponent,
} from 'devextreme-generator/component_declaration/common';

import { Widget } from '../common/widget';
import { ScrollbarProps } from './scrollbar_props';

export const viewFunction = ({
  restAttributes,
}: Scrollbar): JSX.Element => (
  <Widget
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
}
