import {
  JSXComponent,
  Component,
  Fragment,
} from 'devextreme-generator/component_declaration/common';
import devices from '../../../core/devices';

import messageLocalization from '../../../localization/message';
import { TopPocketProps } from './topPocket_props';

const SCROLLVIEW_TOP_POCKET_CLASS = 'dx-scrollview-top-pocket';
const SCROLLVIEW_PULLDOWN = 'dx-scrollview-pull-down';
const SCROLLVIEW_PULLDOWN_IMAGE_CLASS = 'dx-scrollview-pull-down-image';
const SCROLLVIEW_PULLDOWN_INDICATOR_CLASS = 'dx-scrollview-pull-down-indicator';
const SCROLLVIEW_PULLDOWN_TEXT_CLASS = 'dx-scrollview-pull-down-text';

export const viewFunction = (viewModel: TopPocket): JSX.Element => {
  const {
    pullingDownText, pulledDownText, refreshingText, refreshStrategy,
  } = viewModel;

  return (
    <div className={SCROLLVIEW_TOP_POCKET_CLASS}>
      <div className={SCROLLVIEW_PULLDOWN}>
        <div className={SCROLLVIEW_PULLDOWN_IMAGE_CLASS} />
        <div className={SCROLLVIEW_PULLDOWN_INDICATOR_CLASS} />
        <div className={SCROLLVIEW_PULLDOWN_TEXT_CLASS}>
          {refreshStrategy !== 'swipeDown' && (
            <Fragment>
              <div>{pullingDownText}</div>
              <div>{pulledDownText}</div>
              <div>{refreshingText}</div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class TopPocket extends JSXComponent<TopPocketProps>() {
  get refreshStrategy(): string {
    return this.props.refreshStrategy || (devices.real().platform === 'android' ? 'swipeDown' : 'pullDown');
  }

  get pullingDownText(): string {
    const { pullingDownText } = this.props;

    if (pullingDownText === undefined || pullingDownText === null) {
      return messageLocalization.format('dxScrollView-pullingDownText');
    }

    return pullingDownText;
  }

  get pulledDownText(): string {
    const { pulledDownText } = this.props;

    if (pulledDownText === undefined || pulledDownText === null) {
      return messageLocalization.format('dxScrollView-pulledDownText');
    }

    return pulledDownText;
  }

  get refreshingText(): string {
    const { refreshingText } = this.props;

    if (refreshingText === undefined || refreshingText === null) {
      return messageLocalization.format('dxScrollView-refreshingText');
    }

    return refreshingText;
  }
}
