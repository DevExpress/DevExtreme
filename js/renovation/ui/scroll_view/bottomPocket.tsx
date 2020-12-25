import {
  JSXComponent,
  OneWay,
  ComponentBindings,
  Component,
  Ref,
  RefObject,
} from 'devextreme-generator/component_declaration/common';

import {
  SCROLLVIEW_BOTTOM_POCKET_CLASS,
} from './scrollable_utils';

const SCROLLVIEW_REACHBOTTOM_CLASS = 'dx-scrollview-scrollbottom';
const SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS = 'dx-scrollview-scrollbottom-indicator';
const SCROLLVIEW_REACHBOTTOM_TEXT_CLASS = 'dx-scrollview-scrollbottom-text';

export const viewFunction = (viewModel: BottomPocket): JSX.Element => {
  const {
    bottomPocketRef,
  } = viewModel;

  return (
    <div className={SCROLLVIEW_BOTTOM_POCKET_CLASS} ref={bottomPocketRef}>
      <div className={SCROLLVIEW_REACHBOTTOM_CLASS}>
        <div className={SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS} />
        <div className={SCROLLVIEW_REACHBOTTOM_TEXT_CLASS} />
      </div>
    </div>
  );
};

@ComponentBindings()
export class BottomPocketProps {
  @OneWay() someProp = false;
}

@Component({
  view: viewFunction,
})

export class BottomPocket extends JSXComponent(BottomPocketProps) {
  @Ref() bottomPocketRef!: RefObject<HTMLDivElement>;
}
