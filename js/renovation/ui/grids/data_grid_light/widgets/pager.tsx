/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings, OneWay, TwoWay,
} from '@devextreme-generator/declarations';

import messageLocalization from '../../../../../localization/message';

import { Pager as BasePager } from '../../../pager/pager';

export const viewFunction = (viewModel: GridPager): JSX.Element => (
  <BasePager
    pageSizes={viewModel.allowedPageSizes}
    displayMode={viewModel.props.displayMode}
    infoText={viewModel.props.infoText}
    showInfo={viewModel.props.showInfo}
    showNavigationButtons={viewModel.props.showNavigationButtons}
    showPageSizes={viewModel.props.showPageSizeSelector}
    pageCount={viewModel.props.pageCount}
    visible={viewModel.visible}
    totalCount={viewModel.props.totalCount}

    pageIndex={viewModel.props.pageIndex + 1}
    pageIndexChange={viewModel.onPageIndexChange}

    pageSize={viewModel.pageSize === 'all' ? 0 : viewModel.pageSize}
    pageSizeChange={viewModel.onPageSizeChange}
  />
);

@ComponentBindings()
export class GridPagerUserProps {
  @OneWay()
  allowedPageSizes: (number | 'all')[] | 'auto' = 'auto';

  @OneWay()
  displayMode: 'adaptive' | 'compact' | 'full' = 'adaptive';

  @OneWay()
  infoText = messageLocalization.format('dxPager-infoText');

  @OneWay()
  showInfo = false;

  @OneWay()
  showNavigationButtons = false;

  @OneWay()
  showPageSizeSelector = false;

  @OneWay()
  visible: boolean | 'auto' = 'auto';
}

@ComponentBindings()
export class GridPagerProps extends GridPagerUserProps {
  @TwoWay()
  pageSize: number | 'all' = 20;

  @TwoWay()
  pageIndex = 0;

  @OneWay()
  pageCount = 0;

  @OneWay()
  totalCount = 0;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class GridPager extends JSXComponent(GridPagerProps) {
  onPageSizeChange(pageSize: number): void {
    if (pageSize === 0) {
      this.props.pageSize = 'all';
    } else {
      this.props.pageSize = pageSize;
    }
  }

  onPageIndexChange(pageIndex: number): void {
    this.props.pageIndex = pageIndex - 1;
  }

  get visible(): boolean {
    if (this.props.visible === 'auto') {
      return this.props.pageCount > 1;
    }

    return this.props.visible;
  }

  get allowedPageSizes(): (number | 'all')[] {
    if (this.props.allowedPageSizes === 'auto') {
      if (this.pageSize === 'all') {
        return [];
        // eslint-disable-next-line no-else-return
      } else {
        return [
          Math.floor((this.pageSize as number) / 2),
          this.pageSize as number,
          (this.pageSize as number) * 2,
        ];
      }
    }

    return this.props.allowedPageSizes;
  }

  get pageSize(): number | 'all' {
    if (this.props.pageSize === 0) {
      return 'all';
    }

    return this.props.pageSize;
  }
}
