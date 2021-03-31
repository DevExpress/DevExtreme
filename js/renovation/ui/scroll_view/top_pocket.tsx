import {
  JSXComponent,
  Component,
  Fragment, InternalState,
} from '@devextreme-generator/declarations';
import devices from '../../../core/devices';
import { isDefined } from '../../../core/utils/type';

import messageLocalization from '../../../localization/message';
import { TopPocketProps, TopPocketState } from './top_pocket_props';

const SCROLLVIEW_TOP_POCKET_CLASS = 'dx-scrollview-top-pocket';
const SCROLLVIEW_PULLDOWN = 'dx-scrollview-pull-down';
const SCROLLVIEW_PULLDOWN_IMAGE_CLASS = 'dx-scrollview-pull-down-image';
const SCROLLVIEW_PULLDOWN_INDICATOR_CLASS = 'dx-scrollview-pull-down-indicator';
const SCROLLVIEW_PULLDOWN_TEXT_CLASS = 'dx-scrollview-pull-down-text';
const SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS = 'dx-scrollview-pull-down-text-visible';

function getVisibleClass(currentState, expectedState): string | undefined {
  return currentState === expectedState
    ? SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS
    : undefined;
}

export const viewFunction = (viewModel: TopPocket): JSX.Element => {
  const {
    pullingDownText, pulledDownText, refreshingText, refreshStrategy, pocketState,
  } = viewModel;

  return (
    <div className={SCROLLVIEW_TOP_POCKET_CLASS}>
      <div className={SCROLLVIEW_PULLDOWN}>
        <div className={SCROLLVIEW_PULLDOWN_IMAGE_CLASS} />
        <div className={SCROLLVIEW_PULLDOWN_INDICATOR_CLASS} />
        <div className={SCROLLVIEW_PULLDOWN_TEXT_CLASS}>
          {refreshStrategy !== 'swipeDown' && (
            <Fragment>
              <div className={getVisibleClass(pocketState, TopPocketState.STATE_RELEASED)}>
                {pullingDownText}
              </div>
              <div className={getVisibleClass(pocketState, TopPocketState.STATE_READY)}>
                {pulledDownText}
              </div>
              <div className={getVisibleClass(pocketState, TopPocketState.STATE_REFRESHING)}>
                {refreshingText}
              </div>
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
  @InternalState() pocketState = TopPocketState.STATE_RELEASED;

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
