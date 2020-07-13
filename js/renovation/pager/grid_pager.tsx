import {
  Component, JSXComponent, TwoWay, ComponentBindings, Event,
} from 'devextreme-generator/component_declaration/common';

import PagerProps from './common/pager_props';
import { Pager } from './pager';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  pageIndex,
  pageIndexChange,
  props,
  restAttributes,
}: GridPager) => (
  <Pager
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...{
      ...props, pageIndex, pageIndexChange,
    } as PagerProps}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class GridPagerProps extends PagerProps {
  @Event() pageIndexChanged?: (newPageIndex: number) => void;

  @Event() pageSizeChanged?: (newPageSize: number) => void;

  @TwoWay() pageIndex?: number = 1;
}

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})
export class GridPager extends JSXComponent(GridPagerProps) {
  pageIndexChange(newPageIndex: number): void {
    this.props.pageIndexChange?.(newPageIndex + 1);
  }

  get pageIndex(): number {
    return this.props.pageIndex! - 1;
  }
}
