/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  getHeight,
  getWidth,
  setHeight,
  setWidth,
} from '@js/core/utils/size';
import { hasWindow } from '@js/core/utils/window';
import type Gantt from '@ts/ui/gantt/ui.gantt';
import type { ApplyPanelSizeEvent } from '@ts/ui/splitter_control';

type Dimension = 'width' | 'height';

export class GanttSizeHelper {
  _gantt: Gantt;

  constructor(gantt: Gantt) {
    this._gantt = gantt;
  }

  _setTreeListDimension(dimension: Dimension, value): void {
    const setter = dimension === 'width' ? setWidth : setHeight;
    const getter = dimension === 'width' ? getWidth : getHeight;
    setter(this._gantt._$treeListWrapper, value);
    this._gantt._ganttTreeList?.setOption(
      dimension,
      getter(this._gantt._$treeListWrapper),
    );
  }

  _setGanttViewDimension(dimension: Dimension, value): void {
    const setter = dimension === 'width' ? setWidth : setHeight;
    const getter = dimension === 'width' ? getWidth : getHeight;
    setter(this._gantt._$ganttView, value);
    this._gantt._setGanttViewOption(dimension, getter(this._gantt._$ganttView));
  }

  _getPanelsWidthByOption(): ApplyPanelSizeEvent {
    const ganttWidth = getWidth(this._gantt.$element());
    const { taskListWidth: leftPanelWidth } = this._gantt.option();
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let rightPanelWidth;
    // @ts-expect-error ts-error
    if (!isNaN(leftPanelWidth)) {
      // @ts-expect-error ts-error
      rightPanelWidth = ganttWidth - parseInt(leftPanelWidth, 10);
      // @ts-expect-error ts-error
    } else if (leftPanelWidth.indexOf?.('px') > 0) {
      // @ts-expect-error ts-error
      rightPanelWidth = `${ganttWidth - parseInt(leftPanelWidth.replace('px', ''), 10)}px`;
      // @ts-expect-error ts-error
    } else if (leftPanelWidth.indexOf?.('%') > 0) {
      // @ts-expect-error ts-error
      rightPanelWidth = `${100 - parseInt(leftPanelWidth.replace('%', ''), 10)}%`;
    }
    // @ts-expect-error ts-error
    return { leftPanelWidth, rightPanelWidth };
  }

  onAdjustControl(): void {
    const elementHeight = getHeight(this._gantt.$element());
    this.updateGanttWidth();
    this.setGanttHeight(elementHeight);
  }

  onApplyPanelSize(e): void {
    this.setInnerElementsWidth(e);
    this.updateGanttRowHeights();
  }

  updateGanttRowHeights(): void {
    const rowHeight = this._gantt._ganttTreeList?.getRowHeight();
    if (this._gantt._getGanttViewOption('rowHeight') !== rowHeight) {
      this._gantt._setGanttViewOption('rowHeight', rowHeight);
      this._gantt._ganttView?._ganttViewCore.updateRowHeights(rowHeight);
    }
  }

  adjustHeight(): void {
    if (!this._gantt._hasHeight) {
      this._gantt._setGanttViewOption('height', 0);
      this._gantt._setGanttViewOption(
        'height',
        this._gantt._ganttTreeList?.getOffsetHeight(),
      );
    }
  }

  setInnerElementsWidth(widths?: ApplyPanelSizeEvent): void {
    if (!hasWindow()) {
      return;
    }
    const takeWithFromOption = !widths;
    if (takeWithFromOption) {
      // eslint-disable-next-line no-param-reassign
      widths = this._getPanelsWidthByOption();
      this._setTreeListDimension('width', 0);
      this._setGanttViewDimension('width', 0);
    }
    this._setTreeListDimension('width', widths?.leftPanelWidth);
    this._setGanttViewDimension('width', widths?.rightPanelWidth);
    if (takeWithFromOption) {
      this._gantt._splitter?._setSplitterPositionLeft();
    }
  }

  updateGanttWidth(): void {
    this._gantt._splitter?._dimensionChanged();
  }

  setGanttHeight(height): void {
    // @ts-expect-error ts-error
    const toolbarHeightOffset = this._gantt._$toolbarWrapper.get(0).offsetHeight;
    const mainWrapperHeight = height - toolbarHeightOffset;
    this._setTreeListDimension('height', mainWrapperHeight);
    this._setGanttViewDimension('height', mainWrapperHeight);
    this._gantt._ganttView?._ganttViewCore.resetAndUpdate();
  }
}
