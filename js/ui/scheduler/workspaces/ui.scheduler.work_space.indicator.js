import $ from '../../../core/renderer';
import SchedulerWorkSpace from './ui.scheduler.work_space';
import registerComponent from '../../../core/component_registrator';
import dateUtils from '../../../core/utils/date';
import { extend } from '../../../core/utils/extend';
import { getBoundingRect } from '../../../core/utils/position';
import { hasWindow } from '../../../core/utils/window';

const toMs = dateUtils.dateToMilliseconds;

const SCHEDULER_DATE_TIME_INDICATOR_CLASS = 'dx-scheduler-date-time-indicator';
const TIME_PANEL_CURRENT_TIME_CELL_CLASS = 'dx-scheduler-time-panel-current-time-cell';
const HEADER_CURRENT_TIME_CELL_CLASS = 'dx-scheduler-header-panel-current-time-cell';

class SchedulerWorkSpaceIndicator extends SchedulerWorkSpace {
    _getTimeZoneCalculator() {
        return this.invoke('getTimeZoneCalculator');
    }
    _getToday() {
        const todayDate = this.option('indicatorTime') || new Date();
        const timeZoneCalculator = this._getTimeZoneCalculator();

        return timeZoneCalculator?.createDate(todayDate, { path: 'toGrid' }) || todayDate;
    }

    isIndicationOnView() {
        if(this.option('showCurrentTimeIndicator')) {
            const today = this._getToday();
            const endViewDate = dateUtils.trimTime(this.getEndViewDate());

            return dateUtils.dateInRange(today, this._firstViewDate, new Date(endViewDate.getTime() + toMs('day')));
        }
        return false;
    }

    isIndicationAvailable() {
        if(!hasWindow()) {
            return false;
        }

        const today = this._getToday();

        return today >= dateUtils.trimTime(new Date(this.getStartViewDate()));
    }

    isIndicatorVisible() {
        const today = this._getToday();
        const endViewDate = new Date(this.getEndViewDate());
        const firstViewDate = new Date(this.getStartViewDate());
        firstViewDate.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
        endViewDate.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());

        return dateUtils.dateInRange(today, firstViewDate, endViewDate);
    }

    _renderDateTimeIndication() {
        if(this.isIndicationAvailable()) {
            if(this.option('shadeUntilCurrentTime')) {
                this._shader.render();
            }

            if(this.isIndicationOnView() && this.isIndicatorVisible()) {
                const groupCount = this._getGroupCount() || 1;
                const $container = this._dateTableScrollable.$content();
                const height = this.getIndicationHeight();
                const rtlOffset = this._getRtlOffset(this.getCellWidth());

                this._renderIndicator(height, rtlOffset, $container, groupCount);
            }
        }
    }

    _renderIndicator(height, rtlOffset, $container, groupCount) {
        const groupedByDate = this.isGroupedByDate();
        const repeatCount = groupedByDate ? 1 : groupCount;

        for(let i = 0; i < repeatCount; i++) {
            const $indicator = this._createIndicator($container);

            $indicator.width(groupedByDate ? this.getCellWidth() * groupCount : this.getCellWidth());
            this._groupedStrategy.shiftIndicator($indicator, height, rtlOffset, i);
        }
    }

    _createIndicator($container) {
        const $indicator = $('<div>').addClass(SCHEDULER_DATE_TIME_INDICATOR_CLASS);
        $container.append($indicator);

        return $indicator;
    }

    _getRtlOffset(width) {
        return this.option('rtlEnabled') ? getBoundingRect(this._dateTableScrollable.$content().get(0)).width - this.getTimePanelWidth() - width : 0;
    }

    _setIndicationUpdateInterval() {
        if(!this.option('showCurrentTimeIndicator') || this.option('indicatorUpdateInterval') === 0) {
            return;
        }

        this._clearIndicatorUpdateInterval();

        this._indicatorInterval = setInterval(function() {
            this._refreshDateTimeIndication();
        }.bind(this), this.option('indicatorUpdateInterval'));
    }

    _clearIndicatorUpdateInterval() {
        if(this._indicatorInterval) {
            clearInterval(this._indicatorInterval);
            delete this._indicatorInterval;
        }
    }

    _isVerticalShader() {
        return true;
    }

    getIndicationWidth(groupIndex) {
        const maxWidth = this.getCellWidth() * this._getCellCount();

        let difference = this._getIndicatorDuration();
        if(difference > this._getCellCount()) {
            difference = this._getCellCount();
        }
        const width = difference * this.getRoundedCellWidth(groupIndex, groupIndex * this._getCellCount(), difference);

        return maxWidth < width ? maxWidth : width;
    }

    getIndicatorOffset(groupIndex) {
        const difference = this._getIndicatorDuration() - 1;
        const offset = difference * this.getRoundedCellWidth(groupIndex, groupIndex * this._getCellCount(), difference);

        return offset;
    }

    _getIndicatorDuration() {
        const today = this._getToday();
        const firstViewDate = new Date(this._firstViewDate);
        let timeDiff = today.getTime() - firstViewDate.getTime();
        if(this.option('type') === 'workWeek') {
            timeDiff = timeDiff - (this._getWeekendsCount(Math.round(timeDiff / toMs('day'))) * toMs('day'));
        }

        return Math.ceil((timeDiff + 1) / toMs('day'));
    }

    getIndicationHeight() {
        const today = this._getToday();
        const cellHeight = this.getCellHeight();
        const date = new Date(this._firstViewDate);

        if(this.isIndicationOnView()) {
            date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
        }

        const duration = today.getTime() - date.getTime();
        const cellCount = duration / this.getCellDuration();

        return cellCount * cellHeight;
    }

    _dispose() {
        this._clearIndicatorUpdateInterval();
        super._dispose.apply(this, arguments);
    }

    _refreshDateTimeIndication() {
        this._cleanDateTimeIndicator();
        this._shader && this._shader.clean();
        this._renderDateTimeIndication();
    }

    _isCurrentTime(date) {
        if(this.isIndicationOnView()) {
            const today = this._getToday();
            let result = false;
            date = new Date(date);

            date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());

            let startCellDate = new Date(date);
            let endCellDate = new Date(date);

            if(dateUtils.sameDate(today, date)) {
                startCellDate = startCellDate.setMilliseconds(date.getMilliseconds() - this.getCellDuration() + 1);
                endCellDate = endCellDate.setMilliseconds(date.getMilliseconds() + this.getCellDuration());

                result = dateUtils.dateInRange(today, startCellDate, endCellDate);
            }
            return result;
        }
    }

    _isCurrentTimeHeaderCell(headerIndex) {
        if(this.isIndicationOnView()) {
            const date = this._getDateByIndex(headerIndex);
            return dateUtils.sameDate(date, this._getToday());
        }

        return false;
    }

    _getTimeCellClass(i) {
        const startViewDate = this._getTimeCellDate(i);
        const cellClass = super._getTimeCellClass(i);

        if(this._isCurrentTime(startViewDate)) {
            return cellClass + ' ' + TIME_PANEL_CURRENT_TIME_CELL_CLASS;
        }

        return cellClass;
    }

    _getHeaderPanelCellClass(i) {
        const cellClass = super._getHeaderPanelCellClass(i);

        if(this._isCurrentTimeHeaderCell(i)) {
            return cellClass + ' ' + HEADER_CURRENT_TIME_CELL_CLASS;
        }

        return cellClass;
    }

    _cleanView() {
        super._cleanView();

        this._cleanDateTimeIndicator();
    }

    _dimensionChanged() {
        super._dimensionChanged();

        this._refreshDateTimeIndication();
    }

    _cleanDateTimeIndicator() {
        this.$element().find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).remove();
    }

    _cleanWorkSpace() {
        super._cleanWorkSpace();

        this._renderDateTimeIndication();
        this._setIndicationUpdateInterval();
    }

    _optionChanged(args) {

        switch(args.name) {
            case 'showCurrentTimeIndicator':
            case 'indicatorTime':
                this._cleanWorkSpace();
                break;
            case 'indicatorUpdateInterval':
                this._setIndicationUpdateInterval();
                break;
            case 'showAllDayPanel':
                super._optionChanged(args);
                this._refreshDateTimeIndication();
                break;
            case 'allDayExpanded':
                super._optionChanged(args);
                this._refreshDateTimeIndication();
                break;
            case 'crossScrollingEnabled':
                super._optionChanged(args);
                this._refreshDateTimeIndication();
                break;
            case 'shadeUntilCurrentTime':
                this._refreshDateTimeIndication();
                break;
            default:
                super._optionChanged(args);
        }
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            showCurrentTimeIndicator: true,
            indicatorTime: new Date(),
            indicatorUpdateInterval: 5 * toMs('minute'),
            shadeUntilCurrentTime: true
        });
    }
}

registerComponent('dxSchedulerWorkSpace', SchedulerWorkSpaceIndicator);
export default SchedulerWorkSpaceIndicator;
