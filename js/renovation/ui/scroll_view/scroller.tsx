import {
  Component,
  JSXComponent,
  Ref,
  RefObject,
} from 'devextreme-generator/component_declaration/common';
import { Scrollbar } from './scrollbar';

import { ScrollbarProps } from './scrollbar_props';

export const viewFunction = (viewModel: Scroller): JSX.Element => {
  const {
    scrollbarRef,
    props: {
      direction, visible, visibilityMode, expandable,
    },
  } = viewModel;

  return (
    <Scrollbar
      ref={scrollbarRef}
      direction={direction}
      visible={visible}
      visibilityMode={visibilityMode}
      expandable={expandable}
    />
  );
};

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Scroller extends JSXComponent<ScrollbarProps>() {
  @Ref() scrollbarRef!: RefObject<Scrollbar>;
}
