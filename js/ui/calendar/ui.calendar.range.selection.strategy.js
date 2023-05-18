import dateUtils from '../../core/utils/date';
import CalendarSelectionStrategy from './ui.calendar.selection.strategy';

const DAY_INTERVAL = 86400000;
const RANGE_OFFSET = DAY_INTERVAL * 120;

class CalendarRangeSelectionStrategy extends CalendarSelectionStrategy {
    constructor(component) {
        super(component);
        this.NAME = 'RangeSelection';
    }

    getViewOptions() {
        const value = this._getValues();
        const range = this._getDaysInRange(value[0], value[1]);

        return {
            value,
            range,
            selectionMode: 'range',
            onCellHover: this._cellHoverHandler.bind(this),
        };
    }

    selectValue(selectedValue, e) {
        const [startDate, endDate] = this._getValues();

        this.skipNavigate();
        this._updateCurrentDate(selectedValue);
        this._currentDateChanged = true;

        if(this.calendar.option('_allowChangeSelectionOrder') === true) {
            if(this.calendar.option('_currentSelection') === 'startDate') {
                if(this.calendar._convertToDate(selectedValue) > this.calendar._convertToDate(endDate)) {
                    this.dateValue([selectedValue, null], e);
                } else {
                    this.dateValue([selectedValue, endDate], e);
                }

            } else {
                if(this.calendar._convertToDate(selectedValue) >= this.calendar._convertToDate(startDate)) {
                    this.dateValue([startDate, selectedValue], e);
                } else {
                    this.dateValue([null, selectedValue], e);
                }
            }
        } else {
            if(!startDate || endDate) {
                this.dateValue([selectedValue, null], e);
            } else {
                this.dateValue(startDate < selectedValue ? [startDate, selectedValue] : [selectedValue, startDate], e);
            }
        }
    }


    updateAriaSelected(value, previousValue) {
        value ??= this._getValues();
        previousValue ??= [];

        super.updateAriaSelected(value, previousValue);
    }

    processValueChanged(value, previousValue) {
        super.processValueChanged(value, previousValue);

        const range = this._getRange();
        this._updateViewsOption('range', range);
    }

    getDefaultCurrentDate() {
        const dates = this.dateOption('values').filter(value => value);
        return this._getLowestDateInArray(dates);
    }

    _getValues() {
        const values = this.dateOption('values');

        if(!values.length) {
            return values;
        }

        let [startDate, endDate] = values;

        if(startDate && endDate && startDate > endDate) {
            [startDate, endDate] = [endDate, startDate];
        }

        return [startDate, endDate];
    }

    _getRange() {
        const [startDate, endDate] = this._getValues();
        return this._getDaysInRange(startDate, endDate);
    }

    _getDaysInRange(startDate, endDate) {
        if(!startDate || !endDate) {
            return [];
        }

        // TODO: Rework this range reducing algorithm to support different multi views
        // and optimise single views.
        const currentDate = this.calendar.option('currentDate').getTime();
        const rangeStartDate = new Date(Math.max(currentDate - RANGE_OFFSET, startDate));
        const rangeEndDate = new Date(Math.min(currentDate + RANGE_OFFSET, endDate));

        return [...dateUtils.getDatesOfInterval(rangeStartDate, rangeEndDate, DAY_INTERVAL), rangeEndDate];
    }

    _cellHoverHandler(e) {
        const isMaxZoomLevel = this._isMaxZoomLevel();
        const [startDate, endDate] = this._getValues();
        const { _allowChangeSelectionOrder, _currentSelection } = this.calendar.option();
        const skipHoveredRange = _allowChangeSelectionOrder && _currentSelection === 'startDate';

        if(isMaxZoomLevel && startDate && !endDate && !skipHoveredRange) {
            if(startDate < e.value) {
                this._updateViewsOption('range', this._getDaysInRange(startDate, e.value));
            } else {
                this._updateViewsOption('range', this._getDaysInRange(e.value, startDate));
            }
        }
    }
}

export default CalendarRangeSelectionStrategy;
