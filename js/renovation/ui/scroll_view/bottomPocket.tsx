import {
  JSXComponent,
  ComponentBindings,
  Component,
} from 'devextreme-generator/component_declaration/common';

import {
  SCROLLVIEW_BOTTOM_POCKET_CLASS,
} from './scrollable_utils';

const SCROLLVIEW_REACHBOTTOM_CLASS = 'dx-scrollview-scrollbottom';
const SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS = 'dx-scrollview-scrollbottom-indicator';
const SCROLLVIEW_REACHBOTTOM_TEXT_CLASS = 'dx-scrollview-scrollbottom-text';

export const viewFunction = (): JSX.Element => (
  <div className={SCROLLVIEW_BOTTOM_POCKET_CLASS}>
    <div className={SCROLLVIEW_REACHBOTTOM_CLASS}>
      <div className={SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS} />
      <div className={SCROLLVIEW_REACHBOTTOM_TEXT_CLASS} />
    </div>
  </div>
);

@ComponentBindings()
export class BottomPocketProps {
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class BottomPocket extends JSXComponent(BottomPocketProps) {
}
