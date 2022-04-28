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
import {
  SetRowsViewScrollPositionAction, SetRowsViewContentRenderAction,
  SetRowsViewOffsetAction,
} from '../views/table_content';
import {
  VisibleRows, TotalCount,
} from '../plugins';
import {
  SetPageIndex, PageIndex, PageSize, SetLoadPageCount,
} from '../paging/plugins';
import {
  AddLoadIndexToVisibleRows, CalculateVisibleRowsInViewport,
  TopScrollingPositionValue, RowHeightValue, ItemHeightsValue,
  ViewportSkipValue, ViewportTakeValue, CalculateViewportSkipValue,
  CalculateViewportTakeValue, ViewportStateValue,
  ViewportPageIndex, ViewportLoadPageCount,
  CalculateViewportPageIndex, CalculateViewportLoadPageCount,
} from './plugins';
import CLASSES from '../classes';
import { VirtualContent } from './virtual_content';
import { getElementHeight } from '../utils';
import {
  DEFAULT_ROW_HEIGHT, calculateRowHeight, calculateItemHeights, getTopScrollPosition,
  calculateViewportItemIndex, getNormalizedPageSize, calculatePageIndexByItemIndex,
} from './utils';
import { Row, ViewportStateType, VirtualScrollingMode } from '../types';

interface StateAction {
  type: 'scrolling' | 'paging';
  value: number;
}

export const viewFunction = ({
  onRowsScrollPositionChange, topScrollPosition, onRowsViewContentRender,
  rowHeight, itemHeights, viewportState,
}: VirtualScrolling): JSX.Element => (
  <Fragment>
    <ValueSetter type={SetRowsViewScrollPositionAction} value={onRowsScrollPositionChange} />
    <ValueSetter type={SetRowsViewContentRenderAction} value={onRowsViewContentRender} />
    <ValueSetter type={TopScrollingPositionValue} value={topScrollPosition} />
    <ValueSetter type={RowHeightValue} value={rowHeight} />
    <ValueSetter type={ItemHeightsValue} value={itemHeights} />
    <ValueSetter type={ViewportStateValue} value={viewportState} />
    <GetterExtender type={ViewportSkipValue} order={0} value={CalculateViewportSkipValue} />
    <GetterExtender type={ViewportTakeValue} order={0} value={CalculateViewportTakeValue} />
    <GetterExtender type={VisibleRows} order={1} value={AddLoadIndexToVisibleRows} />
    <GetterExtender type={VisibleRows} order={2} value={CalculateVisibleRowsInViewport} />
    <GetterExtender type={ViewportPageIndex} order={0} value={CalculateViewportPageIndex} />
    <GetterExtender type={ViewportLoadPageCount} order={0} value={CalculateViewportLoadPageCount} />
    <VirtualContent />
  </Fragment>
);

@ComponentBindings()
export class VirtualScrollingProps {
  @OneWay()
  mode: VirtualScrollingMode = 'virtual';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class VirtualScrolling extends JSXComponent(VirtualScrollingProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  @InternalState()
  topScrollPosition = 0;

  @InternalState()
  rowHeight = DEFAULT_ROW_HEIGHT;

  @Mutable()
  visibleItemHeights: Record<number, number> = {};

  @InternalState()
  viewportState: ViewportStateType = 'synchronized';

  @Mutable()
  viewportPayload = { pageIndex: 0, topScrollPosition: 0 };

  get itemHeights(): Record<number, number> {
    return this.visibleItemHeights;
  }

  @Effect()
  watchViewportPageIndex(): () => void {
    return this.plugins.watch(ViewportPageIndex, (pageIndex) => {
      this.plugins.callAction(SetPageIndex, pageIndex);
    });
  }

  @Effect()
  watchViewportLoadPageCount(): () => void {
    return this.plugins.watch(ViewportLoadPageCount, (loadPageCount) => {
      this.plugins.callAction(SetLoadPageCount, loadPageCount);
    });
  }

  @Effect()
  watchPageIndex(): () => void {
    return this.plugins.watch(PageIndex, (pageIndex) => {
      this.updateViewportState({
        type: 'paging',
        value: pageIndex,
      });
    });
  }

  onRowsScrollPositionChange(offset: ScrollOffset): void {
    this.updateViewportState({
      type: 'scrolling',
      value: offset.top,
    });
  }

  onRowsViewContentRender(element: HTMLElement): void {
    const rowElements = Array.from(element.querySelectorAll(`tr.${CLASSES.row}:not(.${CLASSES.virtualRow})`));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const visibleRowHeights = rowElements.map((el) => getElementHeight(el));
    this.updateVisibleItemHeights(visibleRowHeights);
    this.updateRowHeight(visibleRowHeights);
  }

  updateVisibleItemHeights(visibleRowHeights: number[]): void {
    const visibleRows: Row[] = this.plugins.getValue(VisibleRows) ?? [];

    const skip = this.plugins.getValue(ViewportSkipValue) ?? 0;
    const calculatedRowHeights = calculateItemHeights(visibleRows, visibleRowHeights);

    calculatedRowHeights.forEach((height, index) => {
      this.visibleItemHeights[skip + index] = height;
    });
  }

  updateRowHeight(visibleRowHeights: number[]): void {
    const newRowHeight = calculateRowHeight(visibleRowHeights,
      this.visibleItemHeights);
    this.rowHeight = newRowHeight;
  }

  updateViewportState(action: StateAction): void {
    const topScrollPositionCurrent = action.type === 'scrolling' ? Math.abs(action.value) : 0;
    const pageIndexCurrent = action.type === 'paging' ? action.value : 0;
    const pageIndexState = this.plugins.getValue(PageIndex);
    const {
      pageIndex: pageIndexPayload,
      topScrollPosition: topScrollPositionPayload,
    } = this.viewportPayload;
    const isEqual = {
      pageIndexPayloadToState: pageIndexState === pageIndexPayload,
      pageIndexCurrentToPayload: pageIndexCurrent === pageIndexPayload,
      topScrollPayloadToState: topScrollPositionPayload === this.topScrollPosition,
      topScrollCurrentToPayload: topScrollPositionCurrent === topScrollPositionPayload,
    };

    switch (this.viewportState) {
      case 'scrolling': {
        if (!isEqual.topScrollPayloadToState) {
          this.topScrollPosition = topScrollPositionPayload;
          this.viewportState = 'synchronized';
        }
        break;
      }
      case 'paging': {
        const pageSize = getNormalizedPageSize(this.plugins.getValue(PageSize) ?? 0);
        const calculatedTopScrollPosition = Math.round(
          getTopScrollPosition(pageIndexPayload, pageSize,
            this.visibleItemHeights, this.rowHeight),
        );
        const viewportItemIndex = calculateViewportItemIndex(
          this.topScrollPosition, this.rowHeight, this.visibleItemHeights,
        );
        const totalCount = this.plugins.getValue(TotalCount) ?? 0;

        const calculatedPageIndex = calculatePageIndexByItemIndex(
          viewportItemIndex, pageSize, totalCount,
        );

        if ((isEqual.pageIndexPayloadToState && calculatedPageIndex !== pageIndexPayload)
         || !isEqual.pageIndexPayloadToState) {
          const offset = { top: calculatedTopScrollPosition };
          this.plugins.callAction(SetRowsViewOffsetAction, offset);
        }
        this.viewportState = 'synchronized';
        break;
      }
      default: {
        if (action.type === 'scrolling') {
          if (!isEqual.topScrollCurrentToPayload || !isEqual.topScrollPayloadToState) {
            this.viewportPayload.topScrollPosition = topScrollPositionCurrent;
            this.viewportState = 'scrolling';
          }
        } else if (action.type === 'paging') {
          if (!isEqual.pageIndexPayloadToState || !isEqual.pageIndexCurrentToPayload) {
            this.viewportPayload.pageIndex = pageIndexCurrent;
            this.viewportState = 'paging';
          }
        }
        break;
      }
    }
  }
}
