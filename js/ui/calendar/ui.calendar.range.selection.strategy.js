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
            this.calendar._valueSelected = true;

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
                    this.dateValue([selectedValue, null], e);
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

        if(isMaxZoomLevel) {
            const skipHoveredRange = _allowChangeSelectionOrder && _currentSelection === 'startDate';

            if(startDate && !endDate && !skipHoveredRange) {
                if(e.value > startDate) {
                    this._updateViewsOption('hoveredRange', this._getDaysInRange(startDate, e.value));
                    return;
                }
            } else if(!startDate && endDate && !(_allowChangeSelectionOrder && _currentSelection === 'endDate')) {
                if(e.value < endDate) {
                    this._updateViewsOption('hoveredRange', this._getDaysInRange(e.value, endDate));
                    return;
                }
            } else if(startDate && endDate) {
                if(_currentSelection === 'startDate' && e.value < startDate) {
                    this._updateViewsOption('hoveredRange', this._getDaysInRange(e.value, startDate));
                    return;
                } else if(_currentSelection === 'endDate' && e.value > endDate) {
                    this._updateViewsOption('hoveredRange', this._getDaysInRange(endDate, e.value));
                    return;
                }
            }

            this._updateViewsOption('hoveredRange', []);
        }
    }
}

export default CalendarRangeSelectionStrategy;
