import {
  Component, JSXComponent, ComponentBindings,
  Consumer, Effect, OneWay, Fragment,
  InternalState,
} from '@devextreme-generator/declarations';
import {
  Plugins, PluginsContext,
} from '../../../../utils/plugin/context';
import { ValueSetter } from '../../../../utils/plugin/value_setter';
import { GetterExtender } from '../../../../utils/plugin/getter_extender';
import { ScrollOffset } from '../../../scroll_view/common/types';
import { SetRowsViewScrollPositionAction } from '../views/table_content';
import {
  TotalCount, VisibleRows,
} from '../data_grid_light';
import {
  SetPageIndex, PageSize, SetLoadPageCount,
} from '../paging/plugins';
import {
  ExtendVisibleRows, CalculateVisibleRows, ViewportParamsValue,
  CalculateViewportParams, ScrollingPositionValue,
} from './plugins';
import { VirtualContent } from './virtual_content';

export const viewFunction = ({
  onRowsScrollPositionChange, scrollPosition,
}: VirtualScrolling): JSX.Element => (
  <Fragment>
    <ValueSetter type={SetRowsViewScrollPositionAction} value={onRowsScrollPositionChange} />
    <ValueSetter type={ScrollingPositionValue} value={scrollPosition} />
    <GetterExtender type={VisibleRows} order={1} value={ExtendVisibleRows} />
    <GetterExtender type={VisibleRows} order={2} value={CalculateVisibleRows} />
    <GetterExtender type={ViewportParamsValue} order={0} value={CalculateViewportParams} />
    <VirtualContent />
  </Fragment>
);

@ComponentBindings()
export class VirtualScrollingProps {
  @OneWay()
  mode: 'virtual' | 'infinite' = 'virtual';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class VirtualScrolling extends JSXComponent(VirtualScrollingProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  @InternalState()
  scrollPosition = { top: 0, left: 0 };

  @Effect()
  watchTotalCount(): () => void {
    return this.plugins.watch(TotalCount, () => {
      this.loadViewport();
    });
  }

  onRowsScrollPositionChange(offset: ScrollOffset): void {
    let { top, left } = offset;
    top = Math.abs(top);
    left = Math.abs(left);
    if (this.scrollPosition.top !== top || this.scrollPosition.left !== left) {
      this.scrollPosition = { top, left };
      this.loadViewport();
    }
  }

  loadViewport(): void {
    let pageSize = this.plugins.getValue(PageSize) ?? 0;
    pageSize = typeof pageSize !== 'number' ? 0 : pageSize;
    const { skip = 0, take = 0 } = this.plugins.getValue(ViewportParamsValue) ?? {};
    const pageIndex = Math.floor(pageSize > 0 ? skip / pageSize : 0);
    const pageOffset = pageIndex * pageSize;
    const skipForCurrentPage = skip - pageOffset;
    const loadPageCount = Math.ceil(pageSize > 0 ? (take + skipForCurrentPage) / pageSize : 0);

    this.plugins.callAction(SetPageIndex, pageIndex);
    this.plugins.callAction(SetLoadPageCount, loadPageCount);
  }
}
