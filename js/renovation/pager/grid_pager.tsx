import {
  Component, JSXComponent, TwoWay, ComponentBindings,
} from 'devextreme-generator/component_declaration/common';

import PagerProps from './common/pager_props';
import { Pager } from './pager';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  pageIndex,
  className,
  pageIndexChange,
  props,
  restAttributes,
}: GridPager) => (
  <Pager
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...{
      ...props, className, pageIndex, pageIndexChange,
    } as PagerProps}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class GridPagerProps extends PagerProps {
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

  get className(): string {
    return this.props.className ? `${this.props.className} dx-gridpager` : ' dx-gridpager';
  }
}
