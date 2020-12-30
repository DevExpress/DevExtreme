import {
  JSXComponent,
  ComponentBindings,
  Component,
  Fragment,
} from 'devextreme-generator/component_declaration/common';

import {
  SCROLLVIEW_TOP_POCKET_CLASS,
} from './scrollable_utils';
import { ScrollViewPropsType } from './scrollview_props';

const SCROLLVIEW_PULLDOWN = 'dx-scrollview-pull-down';
const SCROLLVIEW_PULLDOWN_IMAGE_CLASS = 'dx-scrollview-pull-down-image';
const SCROLLVIEW_PULLDOWN_INDICATOR_CLASS = 'dx-scrollview-pull-down-indicator';
const SCROLLVIEW_PULLDOWN_TEXT_CLASS = 'dx-scrollview-pull-down-text';

export const viewFunction = (viewModel: TopPocket): JSX.Element => {
  const {
    props: {
      pullingDownText, pulledDownText, refreshingText, refreshStrategy,
    },
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

@ComponentBindings()
export class TopPocketProps {
}

export type TopPocketPropsType = TopPocketProps & Pick<ScrollViewPropsType, 'refreshStrategy' | 'pullingDownText' | 'pulledDownText' | 'refreshingText'>;
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class TopPocket extends JSXComponent<TopPocketPropsType>() {
}
