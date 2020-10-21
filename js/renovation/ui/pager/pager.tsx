import {
  Component, JSXComponent,
} from 'devextreme-generator/component_declaration/common';

import { ResizableContainer } from './resizable_container';
import PagerProps from './common/pager_props';
import { PagerContent } from './content';
import { GridPagerWrapper } from '../../preact_wrapper/grid_pager';
import { combineClasses } from '../../utils/combine_classes';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  pagerProps,
  restAttributes,
}: Pager) => (
  <ResizableContainer
    contentTemplate={PagerContent}
    pagerProps={pagerProps}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@Component({
  defaultOptionRules: null,
  jQuery: { register: true, component: GridPagerWrapper },
  view: viewFunction,
})
export class Pager extends JSXComponent<PagerProps>() {
  pageIndexChange(newPageIndex: number): void {
    if (this.props.gridCompatibility) {
      this.props.pageIndex = newPageIndex + 1;
    } else {
      this.props.pageIndex = newPageIndex;
    }
  }

  get pageIndex(): number {
    if (this.props.gridCompatibility) {
      return this.props.pageIndex - 1;
    }
    return this.props.pageIndex;
  }

  pageSizeChange(newPageSize: number): void {
    this.props.pageSize = newPageSize;
  }

  get className(): string | undefined {
    if (this.props.gridCompatibility) {
      return combineClasses({
        'dx-datagrid-pager': true,
        [`${this.props.className}`]: !!this.props.className,
      });
    }
    return this.props.className;
  }

  get pagerProps(): PagerProps {
    return {
      ...this.props,
      className: this.className,
      pageIndex: this.pageIndex,
      pageIndexChange: (pageIndex: number): void => this.pageIndexChange(pageIndex),
      pageSizeChange: (pageSize: number): void => this.pageSizeChange(pageSize),
    };
  }
}
