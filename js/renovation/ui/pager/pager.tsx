import {
  Component, JSXComponent,
} from 'devextreme-generator/component_declaration/common';

import { ResizableContainer } from './resizable_container';
import PagerProps from './common/pager_props';
import { PagerContentComponent } from './content';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  pageSizeChange,
  pageIndexChange,
  props,
  restAttributes,
}: Pager) => (
  <ResizableContainer
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...{ ...props as PagerProps, ...restAttributes }}
    contentTemplate={PagerContentComponent}
    pageSizeChange={pageSizeChange}
    pageIndexChange={pageIndexChange}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Pager extends JSXComponent(PagerProps) {
  pageIndexChange(newPageIndex: number): void {
    this.props.pageIndex = newPageIndex;
  }

  pageSizeChange(newPageSize: number): void {
    this.props.pageSize = newPageSize;
  }
}
