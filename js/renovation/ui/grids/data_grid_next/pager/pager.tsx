/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings, OneWay, Consumer, InternalState, Effect,
} from '@devextreme-generator/declarations';
import { PlaceholderExtender } from '../../../../utils/plugin/placeholder_extender';

import messageLocalization from '../../../../../localization/message';

import { PagerContent } from '../../../pager/content';
import {
  PageIndex, PageSize, PageCount, SetPageIndex, SetPageSize,
} from '../paging/plugins';
import { TotalCount } from '../plugins';
import { FooterPlaceholder } from '../views/footer';
import { Plugins, PluginsContext } from '../../../../utils/plugin/context';

import CLASSES from '../classes';

export const viewFunction = ({
  allowedPageSizes, onPageIndexChange, onPageSizeChange,
  props: {
    displayMode, infoText, showInfo, showNavigationButtons, showPageSizeSelector, visible,
  },
}: DataGridNextPager): JSX.Element => (
  <PlaceholderExtender
    type={FooterPlaceholder}
    order={1}
    deps={[PageIndex, PageSize, TotalCount, PageCount]}
    template={({ deps }): JSX.Element => (
      <PagerContent
        className={CLASSES.pager}
        pageSizes={allowedPageSizes}
        displayMode={displayMode}
        infoText={infoText}
        showInfo={showInfo}
        showNavigationButtons={showNavigationButtons}
        showPageSizes={showPageSizeSelector}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        pageCount={deps[3]}
        visible={visible}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        totalCount={deps[2]}

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        pageIndex={deps[0]}
        pageIndexChange={onPageIndexChange}

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        pageSize={deps[1] === 'all' ? 0 : deps[1]}
        pageSizeChange={onPageSizeChange}
      />
    )}
  />
);

@ComponentBindings()
export class DataGridNextPagerProps {
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
  angular: {
    innerComponent: false,
  },
  view: viewFunction,
})
export class DataGridNextPager extends JSXComponent(DataGridNextPagerProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  @InternalState()
  pageSize: number | 'all' = 'all';

  @Effect()
  updatePageSize(): () => void {
    return this.plugins.watch(PageSize, (pageSize) => {
      this.pageSize = pageSize;
    });
  }

  onPageSizeChange(pageSize: number): void {
    if (pageSize === 0) {
      this.plugins.callAction(SetPageSize, 'all');
    } else {
      this.plugins.callAction(SetPageSize, pageSize);
    }
  }

  onPageIndexChange(pageIndex: number): void {
    this.plugins.callAction(SetPageIndex, pageIndex);
  }

  get allowedPageSizes(): (number | 'all')[] {
    // eslint-disable-next-line prefer-destructuring
    const pageSize = this.pageSize;

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
