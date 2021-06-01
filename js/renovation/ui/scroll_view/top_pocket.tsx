import {
  JSXComponent,
  Component,
  ComponentBindings,
  OneWay,
  ForwardRef,
  RefObject,
  Ref,
} from '@devextreme-generator/declarations';
import { LoadIndicator } from '../load_indicator';
import { isDefined } from '../../../core/utils/type';
import messageLocalization from '../../../localization/message';
import { BaseWidgetProps } from '../common/base_props';
import { combineClasses } from '../../utils/combine_classes';

import {
  PULLDOWN_ICON_CLASS,
  SCROLLVIEW_PULLDOWN,
  SCROLLVIEW_PULLDOWN_IMAGE_CLASS,
  SCROLLVIEW_PULLDOWN_INDICATOR_CLASS,
  SCROLLVIEW_PULLDOWN_READY_CLASS,
  SCROLLVIEW_PULLDOWN_LOADING_CLASS,
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
    topPocketClasses, pullDownClasses, pullingDownText, pulledDownText, refreshingText,
    pullDownStyles, pullDownIconStyles, pullDownRef, topPocketStyles,
    props: { topPocketRef, refreshStrategy },
  } = viewModel;

  return (
    <div ref={topPocketRef} className={topPocketClasses} style={topPocketStyles}>
      <div ref={pullDownRef} className={pullDownClasses} style={pullDownStyles}>
        { refreshStrategy !== 'swipeDown' && <div className={SCROLLVIEW_PULLDOWN_IMAGE_CLASS} /> }
        { refreshStrategy === 'swipeDown' && <div className={PULLDOWN_ICON_CLASS} style={pullDownIconStyles} />}
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

  @OneWay() pullDownTranslateTop = 0;

  @OneWay() pullDownIconAngle = 0;

  @OneWay() pullDownOpacity = 0;

  @OneWay() pocketTop = 0;

  @OneWay() topPocketTranslateTop = 0;
}

export type TopPocketPropsType = TopPocketProps & Pick<BaseWidgetProps, 'visible'>;
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class TopPocket extends JSXComponent<TopPocketPropsType>() {
  @Ref() pullDownRef!: RefObject<HTMLDivElement>;

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
      [SCROLLVIEW_PULLDOWN_LOADING_CLASS]: pocketState === TopPocketState.STATE_REFRESHING,
      'dx-state-invisible': !visible,
    };

    return combineClasses(classesMap);
  }

  get topPocketClasses(): string {
    const classesMap = {
      [SCROLLVIEW_TOP_POCKET_CLASS]: true,
      'dx-state-invisible': !this.props.visible,
    };

    return combineClasses(classesMap);
  }

  get pullDownStyles(): { [key: string]: string | number } | undefined {
    if (this.props.refreshStrategy === 'swipeDown') {
      return {
        opacity: this.props.pullDownOpacity,
        transform: `translate(0px, ${this.props.pullDownTranslateTop}px)`,
      };
    }

    return undefined;
  }

  get topPocketStyles(): { [key: string]: string | number } | undefined {
    if (this.props.refreshStrategy === 'pullDown') {
      return {
        top: `${-this.props.pocketTop}px`,
        transform: `translate(0px, ${this.props.topPocketTranslateTop}px)`,
      };
    }

    return undefined;
  }

  get pullDownIconStyles(): { [key: string]: string | number } {
    return {
      transform: `rotate(${this.props.pullDownIconAngle}deg)`,
    };
  }
}
