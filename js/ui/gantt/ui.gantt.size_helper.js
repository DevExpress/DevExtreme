import { hasWindow } from '../../core/utils/window';

export class GanttSizeHelper {
    constructor(gantt) {
        this._gantt = gantt;
    }

    _setTreeListDimension(dimension, value) {
        this._gantt._$treeListWrapper[dimension](value);
        this._gantt._ganttTreeList?.setOption(dimension, this._gantt._$treeListWrapper[dimension]());
    }
    _setGanttViewDimension(dimension, value) {
        this._gantt._$ganttView[dimension](value);
        this._gantt._setGanttViewOption(dimension, this._gantt._$ganttView[dimension]());
    }
    _getPanelsWidthByOption() {
        return {
            leftPanelWidth: this._gantt.option('taskListWidth'),
            rightPanelWidth: this._gantt._$element.width() - this._gantt.option('taskListWidth')
        };
    }

    onAdjustControl() {
        const elementHeight = this._gantt._$element.height();
        this.updateGanttWidth();
        this.setGanttHeight(elementHeight);
    }
    onApplyPanelSize(e) {
        this.setInnerElementsWidth(e);
        this.updateGanttRowHeights();
    }
    updateGanttRowHeights() {
        const rowHeight = this._gantt._ganttTreeList.getRowHeight();
        if(this._gantt._getGanttViewOption('rowHeight') !== rowHeight) {
            this._gantt._setGanttViewOption('rowHeight', rowHeight);
            this._gantt._ganttView?._ganttViewCore.updateRowHeights(rowHeight);
        }
    }
    adjustHeight() {
        if(!this._gantt._hasHeight) {
            this._gantt._setGanttViewOption('height', 0);
            this._gantt._setGanttViewOption('height', this._gantt._ganttTreeList.getOffsetHeight());
        }
    }
    setInnerElementsWidth(widths) {
        if(!hasWindow()) {
            return;
        }
        if(!widths) {
            widths = this._getPanelsWidthByOption();
        }
        this._setTreeListDimension('width', widths.leftPanelWidth);
        this._setGanttViewDimension('width', widths.rightPanelWidth);
    }
    updateGanttWidth() {
        this._gantt._splitter._dimensionChanged();
    }
    setGanttHeight(height) {
        const toolbarHeightOffset = this._gantt._$toolbarWrapper.get(0).offsetHeight;
        const mainWrapperHeight = height - toolbarHeightOffset;
        this._setTreeListDimension('height', mainWrapperHeight);
        this._setGanttViewDimension('height', mainWrapperHeight);
        this._gantt._ganttView?._ganttViewCore.resetAndUpdate();
    }
}
