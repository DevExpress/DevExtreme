import {
  JSXComponent,
  Component,
  ComponentBindings,
  OneWay,
  ForwardRef,
  RefObject,
} from '@devextreme-generator/declarations';
import { LoadIndicator } from '../load_indicator';
import devices from '../../../core/devices';
import { isDefined } from '../../../core/utils/type';

import messageLocalization from '../../../localization/message';

import { ScrollableProps } from './scrollable_props';
import { BaseWidgetProps } from '../common/base_props';

import { combineClasses } from '../../utils/combine_classes';

import {
  PULLDOWN_ICON_CLASS,
  SCROLLVIEW_PULLDOWN,
  SCROLLVIEW_PULLDOWN_IMAGE_CLASS,
  SCROLLVIEW_PULLDOWN_INDICATOR_CLASS,
  SCROLLVIEW_PULLDOWN_READY_CLASS,
  SCROLLVIEW_PULLDOWN_REFRESHING_CLASS,
  SCROLLVIEW_PULLDOWN_TEXT_CLASS,
  SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS,
  SCROLLVIEW_TOP_POCKET_CLASS,
  TopPocketState,
} from './common/consts';
import {
  RefreshStrategy,
} from './types.d';

export const viewFunction = (viewModel: TopPocket): JSX.Element => {
  const {
    releaseVisibleClass, readyVisibleClass, refreshVisibleClass,
    pullDownClasses, pullingDownText, pulledDownText, refreshingText, refreshStrategy,
    props: { useNative, topPocketRef },
  } = viewModel;

  return (
    <div ref={topPocketRef} className={SCROLLVIEW_TOP_POCKET_CLASS}>
      <div className={pullDownClasses} style={{ opacity: useNative && refreshStrategy === 'swipeDown' ? 0 : undefined }}>
        { refreshStrategy !== 'swipeDown' && <div className={SCROLLVIEW_PULLDOWN_IMAGE_CLASS} /> }
        { useNative && refreshStrategy === 'swipeDown' && <div className={PULLDOWN_ICON_CLASS} />}
        <div className={SCROLLVIEW_PULLDOWN_INDICATOR_CLASS}>
          <LoadIndicator />
        </div>
        { refreshStrategy !== 'swipeDown' && (
        <div className={SCROLLVIEW_PULLDOWN_TEXT_CLASS}>
          <div className={releaseVisibleClass}>
            {pullingDownText}
          </div>
          <div className={readyVisibleClass}>
            {pulledDownText}
          </div>
          <div className={refreshVisibleClass}>
            {refreshingText}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

@ComponentBindings()
export class TopPocketProps {
  @ForwardRef() topPocketRef?: RefObject<HTMLDivElement>;

  @OneWay() refreshStrategy?: RefreshStrategy;

  @OneWay() pullingDownText?: string;

  @OneWay() pulledDownText?: string;

  @OneWay() refreshingText?: string;

  @OneWay() pocketState: number = TopPocketState.STATE_RELEASED;
}

export type TopPocketPropsType = TopPocketProps & Pick<ScrollableProps, 'useNative'> & Pick<BaseWidgetProps, 'visible'>;
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class TopPocket extends JSXComponent<TopPocketPropsType>() {
  get releaseVisibleClass(): string | undefined {
    return this.props.pocketState === TopPocketState.STATE_RELEASED
      ? SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS
      : undefined;
  }

  get readyVisibleClass(): string | undefined {
    return this.props.pocketState === TopPocketState.STATE_READY
      ? SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS
      : undefined;
  }

  get refreshVisibleClass(): string | undefined {
    return this.props.pocketState === TopPocketState.STATE_REFRESHING
      ? SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS
      : undefined;
  }

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

  get pullDownClasses(): string {
    const { pocketState, visible } = this.props;

    const classesMap = {
      [SCROLLVIEW_PULLDOWN]: true,
      [SCROLLVIEW_PULLDOWN_READY_CLASS]: pocketState === TopPocketState.STATE_READY,
      [SCROLLVIEW_PULLDOWN_REFRESHING_CLASS]: pocketState === TopPocketState.STATE_REFRESHING,
      'dx-state-invisible': !visible,
    };

    return combineClasses(classesMap);
  }
}
