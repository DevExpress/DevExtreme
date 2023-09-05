import { isDefined } from '../../core/utils/type';
import dateUtils from '../../core/utils/date';

class CalendarSelectionStrategy {
    constructor(component) {
        this.calendar = component;
    }

    dateOption(optionName) {
        return this.calendar._dateOption(optionName);
    }

    dateValue(value, e) {
        this.calendar._dateValue(value, e);
    }

    skipNavigate() {
        this.calendar._skipNavigate = true;
    }

    updateAriaSelected(value, previousValue) {
        this.calendar._updateAriaSelected(value, previousValue);

        if(value[0] && this.calendar.option('currentDate').getTime() === value[0].getTime()) {
            this.calendar._updateAriaId(value[0]);
        }
    }

    processValueChanged(value, previousValue) {
        if(isDefined(value) && !Array.isArray(value)) {
            value = [value];
        }
        if(isDefined(previousValue) && !Array.isArray(previousValue)) {
            previousValue = [previousValue];
        }
        value = value?.map((item) => this._convertToDate(item)) || [];
        previousValue = previousValue?.map((item) => this._convertToDate(item)) || [];

        this._updateViewsValue(value);
        this.updateAriaSelected(value, previousValue);

        if(!this._currentDateChanged) {
            this.calendar._initCurrentDate();
        }
        this._currentDateChanged = false;
    }

    _isDateDisabled(date) {
        const min = this.calendar._dateOption('min');
        const max = this.calendar._dateOption('max');
        const isLessThanMin = isDefined(min) && date < min && !dateUtils.sameDate(min, date);
        const isBiggerThanMax = isDefined(max) && date > max && !dateUtils.sameDate(max, date);

        return this.calendar._view.isDateDisabled(date) || isLessThanMin || isBiggerThanMax;
    }

    _getLowestDateInArray(dates) {
        if(dates.length) {
            return new Date(Math.min(...dates));
        }
    }

    _convertToDate(value) {
        return this.calendar._convertToDate(value);
    }

    _isMaxZoomLevel() {
        return this.calendar._isMaxZoomLevel();
    }

    _updateViewsOption(optionName, optionValue) {
        this.calendar._updateViewsOption(optionName, optionValue);
    }

    _updateViewsValue(value) {
        this._updateViewsOption('value', value);
    }

    _updateCurrentDate(value) {
        this.calendar.option('currentDate', value ?? new Date());
    }

    _shouldHandleWeekNumberClick() {
        const { selectionMode, selectWeekOnClick } = this.calendar.option();

        return selectWeekOnClick && selectionMode !== 'single';
    }
}

export default CalendarSelectionStrategy;
