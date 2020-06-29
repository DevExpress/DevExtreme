import {
  Component, JSXComponent,
} from 'devextreme-generator/component_declaration/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { ResizableContainer } from './resizable-container';
import PagerProps from './pager-props';
import { PagerContentComponent } from './pager-content';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  pageSizeChange,
  pageIndexChange,
  props,
}: Pager) => (
  <ResizableContainer
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props as PagerProps}
    contentTemplate={PagerContentComponent}
    pageSizeChange={pageSizeChange}
    pageIndexChange={pageIndexChange}
  />
);

// tslint:disable-next-line: max-classes-per-file
@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
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
