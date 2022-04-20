import {
  Component, JSXComponent, ComponentBindings,
  Consumer, Effect, OneWay, Fragment,
  InternalState, Mutable,
} from '@devextreme-generator/declarations';
import {
  Plugins, PluginsContext,
} from '../../../../utils/plugin/context';
import { ValueSetter } from '../../../../utils/plugin/value_setter';
import { GetterExtender } from '../../../../utils/plugin/getter_extender';
import { ScrollOffset } from '../../../scroll_view/common/types';
import { SetRowsViewScrollPositionAction, SetRowsViewContentRenderAction } from '../views/table_content';
import {
  TotalCount, VisibleRows,
} from '../plugins';
import {
  SetPageIndex, PageSize, SetLoadPageCount,
} from '../paging/plugins';
import {
  AddLoadIndexToVisibleRows, CalculateVisibleRowsInViewport,
  ScrollingPositionValue,
  RowHeightValue, ItemHeightsValue,
  ViewportSkipValue,
  ViewportTakeValue,
  CalculateViewportSkipValue, CalculateViewportTakeValue,
} from './plugins';
import CLASSES from '../classes';
import { VirtualContent } from './virtual_content';
import { getElementHeight } from '../utils';
import { DEFAULT_ROW_HEIGHT, calculateRowHeight, calculateItemHeights } from './utils';
import { Row } from '../types';

export const viewFunction = ({
  onRowsScrollPositionChange, scrollPosition, onRowsViewContentRender,
  rowHeight, itemHeights,
}: VirtualScrolling): JSX.Element => (
  <Fragment>
    <ValueSetter type={SetRowsViewScrollPositionAction} value={onRowsScrollPositionChange} />
    <ValueSetter type={SetRowsViewContentRenderAction} value={onRowsViewContentRender} />
    <ValueSetter type={ScrollingPositionValue} value={scrollPosition} />
    <ValueSetter type={RowHeightValue} value={rowHeight} />
    <ValueSetter type={ItemHeightsValue} value={itemHeights} />
    <GetterExtender type={ViewportSkipValue} order={0} value={CalculateViewportSkipValue} />
    <GetterExtender type={ViewportTakeValue} order={0} value={CalculateViewportTakeValue} />
    <GetterExtender type={VisibleRows} order={1} value={AddLoadIndexToVisibleRows} />
    <GetterExtender type={VisibleRows} order={2} value={CalculateVisibleRowsInViewport} />
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

  @InternalState()
  rowHeight = DEFAULT_ROW_HEIGHT;

  @InternalState()
  itemHeights: Record<number, number> = {};

  @Mutable()
  visibleRowHeights: number[] = [];

  @Mutable()
  viewportSkipValue = 0;

  @Mutable()
  viewportTakeValue = 0;

  @Effect()
  watchTotalCount(): () => void {
    return this.plugins.watch(TotalCount, () => {
      this.loadViewport();
    });
  }

  @Effect()
  watchViewportSkipValue(): () => void {
    return this.plugins.watch(ViewportSkipValue, (skipValue) => {
      this.viewportSkipValue = skipValue;
    });
  }

  @Effect()
  watchViewportTakeValue(): () => void {
    return this.plugins.watch(ViewportTakeValue, (takeValue) => {
      this.viewportTakeValue = takeValue;
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
    pageSize = pageSize === 'all' ? 0 : pageSize;
    const pageIndex = Math.floor(pageSize > 0 ? this.viewportSkipValue / pageSize : 0);
    const pageOffset = pageIndex * pageSize;
    const skipForCurrentPage = this.viewportSkipValue - pageOffset;
    const loadPageCount = Math.ceil(pageSize > 0
      ? (this.viewportTakeValue + skipForCurrentPage) / pageSize : 0);

    this.plugins.callAction(SetPageIndex, pageIndex);
    this.plugins.callAction(SetLoadPageCount, loadPageCount);
  }

  onRowsViewContentRender(element: HTMLElement): void {
    const rowElements = Array.from(element.querySelectorAll(`tr.${CLASSES.row}:not(.${CLASSES.virtualRow})`));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    this.visibleRowHeights = rowElements.map((el) => getElementHeight(el));
    this.updateRowHeights();
  }

  updateRowHeights(): void {
    const visibleRows: Row[] = this.plugins.getValue(VisibleRows) ?? [];
    const newRowHeight = calculateRowHeight(this.visibleRowHeights, visibleRows.length);
    const skip = this.plugins.getValue(ViewportSkipValue) ?? 0;
    const calculatedRowHeights = calculateItemHeights(visibleRows, this.visibleRowHeights);

    calculatedRowHeights.forEach((height, index) => {
      this.itemHeights[skip + index] = height;
    });
    this.rowHeight = newRowHeight;
  }
}
