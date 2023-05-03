import $ from '../../../core/renderer';
import CalendarStrategy from '../../date_box/ui.date_box.strategy.calendar';
import { extend } from '../../../core/utils/extend';
import { isSameDateArrays } from '../ui.date_range.utils';
import { isFunction } from '../../../core/utils/type';

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
            onShowing: () => {
                this._widget.option('_currentSelection', 'startDate');
            }
        });
    }

    supportedKeys() {
        const supportedKeys = {
            ...super.supportedKeys(),
            rightArrow: () => {
                if(this.dateRangeBox.option('opened')) {
                    return true;
                }
            },
            leftArrow: () => {
                if(this.dateRangeBox.option('opened')) {
                    return true;
                }
            }
        };

        delete supportedKeys.enter;

        return supportedKeys;
    }

    _getWidgetOptions() {
        let { disabledDates } = this.dateRangeBox.option();

        disabledDates = isFunction(disabledDates)
            ? this._injectComponent(disabledDates)
            : disabledDates;

        return extend(super._getWidgetOptions(), {
            disabledDates,
            values: this.dateRangeBox.option('value'),
            selectionMode: 'range',
            viewsCount: 2,
            width: 260,
            _allowChangeSelectionOrder: true,
            _currentSelection: 'startDate',
        });
    }

    _injectComponent(func) {
        return (params) => func(extend(params, { component: this.dateRangeBox }));
    }

    getKeyboardListener() {
        return this.dateRangeBox.getStartDateBox()
            ? this.dateRangeBox.getStartDateBox()._strategy._widget
            : this._widget;
    }

    getValue() {
        return this._widget.option('values');
    }

    _updateValue() {
        if(!this._widget) {
            return;
        }

        this._widget.option('values', this.dateRangeBox.option('value'));
    }

    _valueChangedHandler({ value, previousValue, event }) {
        if(!this.isStartDateBoxActive()) {
            this.setActiveStartDateBox();
        }

        if(isSameDateArrays(value, previousValue)) {
            return;
        }

        const isInstantlyMode = this.dateRangeBox.option('applyValueMode') === 'instantly';

        if(!isInstantlyMode && !event) {
            this.dateRangeBox.updateValue(value);

            return;
        }

        if(this._widget.option('_currentSelection') === 'startDate') {
            if(isInstantlyMode) {
                this.dateRangeBox.updateValue(value);
            }
            this.getDateRangeBox().getEndDateBox().focus();
            this._widget.option('_currentSelection', 'endDate');

            if(value[1]) {
                this._widget.option('currentDate', value[1]);
            }
        } else {
            this.setActiveEndDateBox();

            if(isInstantlyMode) {
                this.dateRangeBox.updateValue(value);
                this.getDateRangeBox().close();
            } else {
                this.setActiveStartDateBox();
                this.getDateRangeBox().getStartDateBox().focus();
            }
            this._widget.option('_currentSelection', 'startDate');
        }
    }

    isStartDateBoxActive() {
        return this.dateBox.$element().hasClass('dx-start-datebox');
    }

    _closeDropDownByEnter() {
        if(this._widget.option('_currentSelection') === 'startDate') {
            return false;
        } else {
            return true;
        }
    }

    dateBoxValue() {
        if(arguments.length) {
            return this.dateBox.dateValue.apply(this.dateBox, arguments);
        } else {
            return this.dateBox.dateOption.apply(this.dateBox, ['value']);
        }
    }

    _cellClickHandler() { }

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
