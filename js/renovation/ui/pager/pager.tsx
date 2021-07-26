import {
  Component,
  JSXComponent,
} from '@devextreme-generator/declarations';

import { ResizableContainer } from './resizable_container';
import { PagerProps } from './common/pager_props';
import { PagerContent } from './content';
import { GridPagerWrapper } from '../../component_wrapper/grid_pager';
import { combineClasses } from '../../utils/combine_classes';
import { InternalPagerProps } from './common/internal_page_props';

export const viewFunction = ({
  pagerProps,
  restAttributes,
}: Pager): JSX.Element => (
  <ResizableContainer
    contentTemplate={PagerContent}
    pagerProps={pagerProps}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

// eslint-disable-next-line @typescript-eslint/no-type-alias
type PagesLargePropsType = Pick<InternalPagerProps, 'pageSizeChange' | 'pageIndexChange' | 'pageIndex'> & PagerProps;

@Component({
  defaultOptionRules: null,
  jQuery: { register: true, component: GridPagerWrapper },
  view: viewFunction,
})

export class Pager extends JSXComponent<PagesLargePropsType>() {
  pageIndexChange(newPageIndex: number): void {
    if (this.props.gridCompatibility) {
      this.props.pageIndexChange(newPageIndex + 1);
    } else {
      this.props.pageIndexChange(newPageIndex);
    }
  }

  get pageIndex(): number {
    if (this.props.gridCompatibility) {
      return this.props.pageIndex - 1;
    }
    return this.props.pageIndex;
  }

  pageSizeChange(newPageSize: number): void {
    this.props.pageSizeChange(newPageSize);
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

  get pagerProps(): PagesLargePropsType {
    return {
      ...this.props,
      className: this.className,
      pageIndex: this.pageIndex,
      pageIndexChange: (pageIndex: number): void => this.pageIndexChange(pageIndex),
      pageSizeChange: (pageSize: number): void => this.pageSizeChange(pageSize),
    };
  }
}
