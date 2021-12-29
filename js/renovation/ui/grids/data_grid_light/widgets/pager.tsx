/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings, OneWay, Consumer,
} from '@devextreme-generator/declarations';
import { PlaceholderExtender } from '../../../../utils/plugin/placeholder_extender';

import messageLocalization from '../../../../../localization/message';

import { PagerContent } from '../../../pager/content';
import {
  PageIndex, PageSize, PageCount, SetPageIndex, SetPageSize,
} from './paging';
import { TotalCount } from '../data_grid_light';
import { FooterPlaceholder } from '../views/footer';
import { Plugins, PluginsContext } from '../../../../utils/plugin/context';

const DATAGRID_PAGER_CLASS = 'dx-datagrid-pager';

export const viewFunction = (viewModel: Pager): JSX.Element => (
  <PlaceholderExtender
    type={FooterPlaceholder}
    order={1}
    deps={[PageIndex, PageSize, TotalCount, PageCount]}
    template={([pageIndex, pageSize, totalCount, pageCount]): JSX.Element => (
      <PagerContent
        className={DATAGRID_PAGER_CLASS}
        pageSizes={viewModel.allowedPageSizes}
        displayMode={viewModel.props.displayMode}
        infoText={viewModel.props.infoText}
        showInfo={viewModel.props.showInfo}
        showNavigationButtons={viewModel.props.showNavigationButtons}
        showPageSizes={viewModel.props.showPageSizeSelector}
        pageCount={pageCount}
        visible={viewModel.props.visible}
        totalCount={totalCount}

        pageIndex={pageIndex}
        pageIndexChange={viewModel.onPageIndexChange}

        pageSize={pageSize === 'all' ? 0 : pageSize}
        pageSizeChange={viewModel.onPageSizeChange}
      />
    )}
  />
);

@ComponentBindings()
export class PagerProps {
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
  visible = true;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Pager extends JSXComponent(PagerProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  onPageSizeChange(pageSize: number): void {
    const setPageSize = this.plugins.getValue(SetPageSize);
    if (!setPageSize) {
      return;
    }

    if (pageSize === 0) {
      setPageSize('all');
    } else {
      setPageSize(pageSize);
    }
  }

  onPageIndexChange(pageIndex: number): void {
    this.plugins.getValue(SetPageIndex)?.(pageIndex);
  }

  get allowedPageSizes(): (number | 'all')[] {
    const pageSize = this.plugins.getValue(PageSize);

    if (this.props.allowedPageSizes === 'auto') {
      if (pageSize === 'all') {
        return [];
      }
      return [
        Math.floor(pageSize / 2),
        pageSize,
        pageSize * 2,
      ];
    }

    return this.props.allowedPageSizes;
  }
}
