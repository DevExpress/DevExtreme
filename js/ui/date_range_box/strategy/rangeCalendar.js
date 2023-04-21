import $ from '../../../core/renderer';
import CalendarStrategy from '../../date_box/ui.date_box.strategy.calendar';
import { extend } from '../../../core/utils/extend';

const CALENDAR_RANGE_START_DATE_CLASS = 'dx-calendar-range-start-date';
const CALENDAR_RANGE_END_DATE_CLASS = 'dx-calendar-range-end-date';
class RangeCalendarStrategy extends CalendarStrategy {
    constructor(dateBox) {
        super();
        this.dateBox = dateBox;
        this.dateRangeBox = dateBox.option('_dateRangeBoxInstance');
    }

    popupConfig(popupConfig) {
        return extend(true, super.popupConfig(popupConfig), {
            position: { of: this.dateRangeBox.$element() },
        });
    }

    _getWidgetOptions() {
        return extend(super._getWidgetOptions(), {
            values: this.dateRangeBox.option('value'),
            selectionMode: 'range',
            viewsCount: 2,
            width: 260
        });
    }

    getValue() {
        return this._widget.option('values');
    }

    _updateValue() {
        if(!this._widget) {
            return;
        }

        this._widget.option('values', [this.dateRangeBox.getStartDateBox().option('value'), this.dateRangeBox.getEndDateBox().option('value')]);
    }

    _valueChangedHandler({ value, previousValue, event }) {
        this.tryUpdateValue(event, 0, value, previousValue);
        this.tryUpdateValue(event, 1, value, previousValue);
    }

    tryUpdateValue(event, index, value, previousValue) {
        if(this.getDateRangeBox()._isSameDates(value[index], previousValue[index])) {
            return;
        }

        if(this.dateBox.option('applyValueMode') === 'instantly') {
            this.dateBoxValue(this.getValue()[index], event);
        }
    }

    dateBoxValue() {
        if(arguments.length) {
            return this.dateBox.dateValue.apply(this.dateBox, arguments);
        } else {
            return this.dateBox.dateOption.apply(this.dateBox, ['value']);
        }
    }

    _cellClickHandler({ value, event }) {
        if(this.dateBox.option('applyValueMode') === 'instantly') {
            if(this.isStartDateSelected(event)) {
                this.setActiveStartDateBox();
                this.dateBoxValue(value, event);
                this.getDateRangeBox().getEndDateBox().focus();
                this.setActiveEndDateBox();
            } else {
                this.dateBoxValue(value, event);
                this.getDateRangeBox().close();
            }
        }
    }

    setActiveStartDateBox() {
        this.dateBox = this.dateRangeBox.getStartDateBox();
    }

    setActiveEndDateBox() {
        this.dateBox = this.dateRangeBox.getEndDateBox();
    }

    getDateRangeBox() {
        return this.dateRangeBox;
    }

    isStartDateSelected({ currentTarget }) {
        if($(currentTarget).hasClass(CALENDAR_RANGE_START_DATE_CLASS)) {
            return true;
        }

        return false;
    }

    isEndDateSelected({ currentTarget }) {
        if($(currentTarget).hasClass(CALENDAR_RANGE_END_DATE_CLASS)) {
            return true;
        }

        return false;
    }
}

export default RangeCalendarStrategy;
