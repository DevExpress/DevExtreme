import { getWidth, getHeight, setHeight, setWidth } from '../../core/utils/size';
import { hasWindow } from '../../core/utils/window';

export class GanttSizeHelper {
    constructor(gantt) {
        this._gantt = gantt;
    }

    _setTreeListDimension(dimension, value) {
        const setter = dimension === 'width' ? setWidth : setHeight;
        const getter = dimension === 'width' ? getWidth : getHeight;
        setter(this._gantt._$treeListWrapper, value);
        this._gantt._ganttTreeList?.setOption(dimension, getter(this._gantt._$treeListWrapper));
    }
    _setGanttViewDimension(dimension, value) {
        const setter = dimension === 'width' ? setWidth : setHeight;
        const getter = dimension === 'width' ? getWidth : getHeight;
        setter(this._gantt._$ganttView, value);
        this._gantt._setGanttViewOption(dimension, getter(this._gantt._$ganttView));
    }
    _getPanelsWidthByOption() {
        const ganttWidth = getWidth(this._gantt._$element);
        const leftPanelWidth = this._gantt.option('taskListWidth');
        let rightPanelWidth;
        if(!isNaN(leftPanelWidth)) {
            rightPanelWidth = ganttWidth - parseInt(leftPanelWidth);
        } else if(leftPanelWidth.indexOf?.('px') > 0) {
            rightPanelWidth = (ganttWidth - parseInt(leftPanelWidth.replace('px', ''))) + 'px';
        } else if(leftPanelWidth.indexOf?.('%') > 0) {
            rightPanelWidth = (100 - parseInt(leftPanelWidth.replace('%', ''))) + '%';
        }
        return { leftPanelWidth: leftPanelWidth, rightPanelWidth: rightPanelWidth };
    }

    onAdjustControl() {
        const elementHeight = getHeight(this._gantt._$element);
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
        const takeWithFromOption = !widths;
        if(takeWithFromOption) {
            widths = this._getPanelsWidthByOption();
            this._setTreeListDimension('width', 0);
            this._setGanttViewDimension('width', 0);
        }
        this._setTreeListDimension('width', widths.leftPanelWidth);
        this._setGanttViewDimension('width', widths.rightPanelWidth);
        if(takeWithFromOption) {
            this._gantt._splitter._setSplitterPositionLeft();
        }
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
