import {
  Component, Fragment,
  JSXComponent,
} from 'devextreme-generator/component_declaration/common';

import { ScrollbarProps } from './scrollbar_props';

export const viewFunction = (): JSX.Element => (
  <Fragment>
    <div />
  </Fragment>
);

@Component({
  view: viewFunction,
  defaultOptionRules: null,
})
export class Scrollbar extends JSXComponent<ScrollbarProps>() {
}
