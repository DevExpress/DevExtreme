import {
  JSXComponent,
  Component,
  Fragment, InternalState,
} from 'devextreme-generator/component_declaration/common';
import devices from '../../../core/devices';
import { isDefined } from '../../../core/utils/type';

import messageLocalization from '../../../localization/message';
import { TopPocketProps } from './topPocket_props';

const SCROLLVIEW_TOP_POCKET_CLASS = 'dx-scrollview-top-pocket';
const SCROLLVIEW_PULLDOWN = 'dx-scrollview-pull-down';
const SCROLLVIEW_PULLDOWN_IMAGE_CLASS = 'dx-scrollview-pull-down-image';
const SCROLLVIEW_PULLDOWN_INDICATOR_CLASS = 'dx-scrollview-pull-down-indicator';
const SCROLLVIEW_PULLDOWN_TEXT_CLASS = 'dx-scrollview-pull-down-text';
const SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS = 'dx-scrollview-pull-down-text-visible';

const STATE_RELEASED = 0;
const STATE_READY = 1;
const STATE_REFRESHING = 2;

function getCssClass(currentState, expectedState): string {
  return currentState === expectedState
    ? SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS
    : '';
}

export const viewFunction = (viewModel: TopPocket): JSX.Element => {
  const {
    pullingDownText, pulledDownText, refreshingText, refreshStrategy,
  } = viewModel;

  // eslint-disable-next-line no-underscore-dangle
  const state = viewModel._state;

  return (
    <div className={SCROLLVIEW_TOP_POCKET_CLASS}>
      <div className={SCROLLVIEW_PULLDOWN}>
        <div className={SCROLLVIEW_PULLDOWN_IMAGE_CLASS} />
        <div className={SCROLLVIEW_PULLDOWN_INDICATOR_CLASS} />
        <div className={SCROLLVIEW_PULLDOWN_TEXT_CLASS}>
          {refreshStrategy !== 'swipeDown' && (
            <Fragment>
              <div className={getCssClass(state, STATE_RELEASED)}>{pullingDownText}</div>
              <div className={getCssClass(state, STATE_READY)}>{pulledDownText}</div>
              <div className={getCssClass(state, STATE_REFRESHING)}>{refreshingText}</div>
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
  @InternalState() _state = STATE_RELEASED;

  get refreshStrategy(): string {
    return this.props.refreshStrategy || (devices.real().platform === 'android' ? 'swipeDown' : 'pullDown');
  }

  get pullingDownText(): string | undefined {
    const { pullingDownText } = this.props;

    if (isDefined(pullingDownText)) {
      return pullingDownText;
    }

    return messageLocalization.format('dxScrollView-pullingDownText');
  }

  get pulledDownText(): string | undefined {
    const { pulledDownText } = this.props;

    if (isDefined(pulledDownText)) {
      return pulledDownText;
    }

    return messageLocalization.format('dxScrollView-pulledDownText');
  }

  get refreshingText(): string | undefined {
    const { refreshingText } = this.props;

    if (isDefined(refreshingText)) {
      return refreshingText;
    }

    return messageLocalization.format('dxScrollView-refreshingText');
  }
}
