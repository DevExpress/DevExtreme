/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings,
  OneWay, Effect, InternalState, Nested,
} from '@devextreme-generator/declarations';

import { Widget } from '../../common/widget';
import { BaseWidgetProps } from '../../common/base_props';

import type { TRowData } from './types';

import { TableContent } from './views/table_content';
import { TableHeader } from './views/table_header';

import { GridPager, BaseGridPagerProps } from './widgets/pager';

export const viewFunction = (viewModel: DataGridLight): JSX.Element => (
  <Widget // eslint-disable-line jsx-a11y/no-access-key
    accessKey={viewModel.props.accessKey}
    activeStateEnabled={viewModel.props.activeStateEnabled}
    aria={viewModel.aria}
    disabled={viewModel.props.disabled}
    focusStateEnabled={viewModel.props.focusStateEnabled}
    height={viewModel.props.height}
    hint={viewModel.props.hint}
    hoverStateEnabled={viewModel.props.hoverStateEnabled}
    rtlEnabled={viewModel.props.rtlEnabled}
    tabIndex={viewModel.props.tabIndex}
    visible={viewModel.props.visible}
    width={viewModel.props.width}
    {...viewModel.restAttributes} // eslint-disable-line react/jsx-props-no-spreading
  >
    <div className="dx-datagrid dx-gridbase-container" role="grid" aria-label="Data grid">
      <TableHeader columns={viewModel.props.columns} />
      <TableContent columns={viewModel.props.columns} dataSource={viewModel.visibleItems} />
      <GridPager
        allowedPageSizes={viewModel.props.pager.allowedPageSizes}
        displayMode={viewModel.props.pager.displayMode}
        infoText={viewModel.props.pager.infoText}
        showInfo={viewModel.props.pager.showInfo}
        showNavigationButtons={viewModel.props.pager.showNavigationButtons}
        showPageSizeSelector={viewModel.props.pager.showPageSizeSelector}
        visible={viewModel.props.pager.visible}
        pageCount={viewModel.pagingPageCount}
        totalCount={viewModel.props.dataSource.length}

        pageIndex={viewModel.pagingPageIndex}
        pageIndexChange={viewModel.onPageIndexChange}

        pageSize={viewModel.pagingPageSize}
        pageSizeChange={viewModel.onPageSizeChange}
      />
    </div>
  </Widget>
);

@ComponentBindings()
class PagingProps {
  @OneWay()
  enabled = true;

  @OneWay()
  pageIndex = 0;

  @OneWay()
  pageSize: number | 'all' = 20;
}

@ComponentBindings()
export class DataGridLightProps extends BaseWidgetProps {
  @OneWay()
  dataSource: TRowData[] = [];

  @OneWay()
  columns: string[] = [];

  @Nested()
  pager: BaseGridPagerProps = {
    allowedPageSizes: 'auto',
    displayMode: 'adaptive',
    infoText: 'Page {0} of {1} ({2} items)',
    showInfo: false,
    showNavigationButtons: false,
    showPageSizeSelector: false,
    visible: 'auto',
  };

  @Nested()
  paging: PagingProps = {
    pageSize: 20,
    pageIndex: 0,
    enabled: true,
  };
}

const aria = {
  role: 'presentation',
};

@Component({
  defaultOptionRules: null,
  jQuery: { register: false },
  view: viewFunction,
})
export class DataGridLight extends JSXComponent(DataGridLightProps) {
  // eslint-disable-next-line class-methods-use-this
  get aria(): Record<string, string> {
    return aria;
  }

  get visibleItems(): TRowData[] {
    if (!this.pagingEnabled || this.pagingPageSize === 'all') {
      return this.props.dataSource;
    }

    const start = this.pagingPageIndex * this.pagingPageSize;
    const end = start + this.pagingPageSize;

    return this.props.dataSource.slice(start, end);
  }

  get pagingPageCount(): number {
    if (this.pagingPageSize === 'all') {
      return 1;
    }

    return Math.ceil(this.props.dataSource.length / this.pagingPageSize);
  }

  @InternalState()
  pagingEnabled = true;

  @InternalState()
  pagingPageIndex = 0;

  @InternalState()
  pagingPageSize: number | 'all' = 20;

  @Effect()
  updatePagingProps(): void {
    this.pagingEnabled = this.props.paging.enabled;
    this.pagingPageIndex = this.props.paging.pageIndex;
    this.pagingPageSize = this.props.paging.pageSize;
  }

  onPageSizeChange(pageSize: number | 'all'): void {
    this.pagingPageSize = pageSize;
  }

  onPageIndexChange(pageIndex: number): void {
    this.pagingPageIndex = pageIndex;
  }
}
