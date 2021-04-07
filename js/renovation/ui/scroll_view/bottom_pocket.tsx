import {
  JSXComponent,
  Component,
  ComponentBindings,
  OneWay,
  ForwardRef,
  RefObject,
} from '@devextreme-generator/declarations';
import { LoadIndicator } from '../load_indicator';
import { isDefined } from '../../../core/utils/type';

import {
  SCROLLVIEW_BOTTOM_POCKET_CLASS,
  SCROLLVIEW_REACHBOTTOM_CLASS,
  SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS,
  SCROLLVIEW_REACHBOTTOM_TEXT_CLASS,
} from './common/consts';

import messageLocalization from '../../../localization/message';

import { BaseWidgetProps } from '../../utils/base_props';

import { combineClasses } from '../../utils/combine_classes';

export const viewFunction = (viewModel: BottomPocket): JSX.Element => {
  const {
    reachBottomText, reachBottomClasses,
    props: { bottomPocketRef },
  } = viewModel;

  return (
    <div ref={bottomPocketRef} className={SCROLLVIEW_BOTTOM_POCKET_CLASS}>
      <div className={reachBottomClasses}>
        <div className={SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS}>
          <LoadIndicator />
        </div>
        <div className={SCROLLVIEW_REACHBOTTOM_TEXT_CLASS}>
          <div>{reachBottomText}</div>
        </div>
      </div>
    </div>
  );
};

@ComponentBindings()
export class BottomPocketProps {
  @ForwardRef() bottomPocketRef?: RefObject<HTMLDivElement>;

  @OneWay() reachBottomText?: string;
}

export type BottomPocketPropsType = BottomPocketProps & Pick<BaseWidgetProps, 'visible'>;

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class BottomPocket extends JSXComponent<BottomPocketPropsType>() {
  get reachBottomText(): string | undefined {
    const { reachBottomText } = this.props;

    if (isDefined(reachBottomText)) {
      return reachBottomText;
    }

    return messageLocalization.format('dxScrollView-reachBottomText');
  }

  get reachBottomClasses(): string {
    const { visible } = this.props;

    const classesMap = {
      [SCROLLVIEW_REACHBOTTOM_CLASS]: true,
      'dx-state-invisible': !visible,
    };

    return combineClasses(classesMap);
  }
}
