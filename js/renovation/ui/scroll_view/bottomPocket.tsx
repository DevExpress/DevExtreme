import {
  JSXComponent,
  Component,
} from 'devextreme-generator/component_declaration/common';

import {
  SCROLLVIEW_BOTTOM_POCKET_CLASS,
} from './scrollable_utils';

import messageLocalization from '../../../localization/message';

import { BottomPocketProps } from './bottomPocket_props';

const SCROLLVIEW_REACHBOTTOM_CLASS = 'dx-scrollview-scrollbottom';
const SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS = 'dx-scrollview-scrollbottom-indicator';
const SCROLLVIEW_REACHBOTTOM_TEXT_CLASS = 'dx-scrollview-scrollbottom-text';

export const viewFunction = (viewModel: BottomPocket): JSX.Element => {
  const {
    reachBottomText,
  } = viewModel;

  return (
    <div className={SCROLLVIEW_BOTTOM_POCKET_CLASS}>
      <div className={SCROLLVIEW_REACHBOTTOM_CLASS}>
        <div className={SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS} />
        <div className={SCROLLVIEW_REACHBOTTOM_TEXT_CLASS}>
          <div>{reachBottomText}</div>
        </div>
      </div>
    </div>
  );
};

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class BottomPocket extends JSXComponent(BottomPocketProps) {
  get reachBottomText(): string {
    const { reachBottomText } = this.props;

    if (reachBottomText === undefined || reachBottomText === null) {
      return messageLocalization.format('dxScrollView-reachBottomText');
    }

    return reachBottomText;
  }
}
