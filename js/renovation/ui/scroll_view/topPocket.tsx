import {
  JSXComponent,
  ComponentBindings,
  Component,
} from 'devextreme-generator/component_declaration/common';

import {
  SCROLLVIEW_TOP_POCKET_CLASS,
} from './scrollable_utils';

const SCROLLVIEW_PULLDOWN = 'dx-scrollview-pull-down';
const SCROLLVIEW_PULLDOWN_IMAGE_CLASS = 'dx-scrollview-pull-down-image';
const SCROLLVIEW_PULLDOWN_INDICATOR_CLASS = 'dx-scrollview-pull-down-indicator';
const SCROLLVIEW_PULLDOWN_TEXT_CLASS = 'dx-scrollview-pull-down-text';

export const viewFunction = (): JSX.Element => (
  <div className={SCROLLVIEW_TOP_POCKET_CLASS}>
    <div className={SCROLLVIEW_PULLDOWN}>
      <div className={SCROLLVIEW_PULLDOWN_IMAGE_CLASS} />
      <div className={SCROLLVIEW_PULLDOWN_INDICATOR_CLASS} />
      <div className={SCROLLVIEW_PULLDOWN_TEXT_CLASS} />
    </div>
  </div>
);

@ComponentBindings()
export class TopPocketProps {
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class TopPocket extends JSXComponent(TopPocketProps) {
}
