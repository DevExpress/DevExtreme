import {
  JSXComponent,
  Component,
  ComponentBindings,
  OneWay,
  ForwardRef,
  RefObject,
} from '@devextreme-generator/declarations';
import { LoadIndicator } from '../../../load_indicator';

import {
  SCROLLVIEW_BOTTOM_POCKET_CLASS,
  SCROLLVIEW_REACHBOTTOM_CLASS,
  SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS,
  SCROLLVIEW_REACHBOTTOM_TEXT_CLASS,
} from '../../common/consts';

import { current, isMaterial } from '../../../../../ui/themes';
import { combineClasses } from '../../../../utils/combine_classes';
import messageLocalization from '../../../../../localization/message';

export const viewFunction = (viewModel: BottomPocket): JSX.Element => {
  const {
    reachBottomClasses,
    props: { bottomPocketRef, reachBottomText },
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

  @OneWay() reachBottomText: string = isMaterial(current()) ? '' : messageLocalization.format('dxScrollView-reachBottomText');

  @OneWay() visible = true;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class BottomPocket extends JSXComponent<BottomPocketProps>() {
  get reachBottomClasses(): string {
    const { visible } = this.props;

    const classesMap = {
      [SCROLLVIEW_REACHBOTTOM_CLASS]: true,
      'dx-state-invisible': !visible,
    };

    return combineClasses(classesMap);
  }
}
