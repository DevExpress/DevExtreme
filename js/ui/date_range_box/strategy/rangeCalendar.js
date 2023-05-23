import $ from '../../../core/renderer';
import CalendarStrategy from '../../date_box/ui.date_box.strategy.calendar';
import { extend } from '../../../core/utils/extend';
import { isSameDateArrays, getDeserializedDate } from '../ui.date_range.utils';
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
        });
    }

    popupShowingHandler() {
        this._widget?._restoreViewsMinMaxOptions();
        this._dateSelectedCounter = 0;
    }

    _getPopup() {
        return super._getPopup() || this.dateRangeBox.getStartDateBox()._popup;
    }

    // TODO: think again about prevent render calendar inside overlay-content element
    renderPopupContent() {
        if(this.dateBox.NAME === '_EndDateBox') {
            return;
        }

        super.renderPopupContent();
    }

    supportedKeys() {
        const originalHandlers = super.supportedKeys();

        const supportedKeys = {
            ...originalHandlers,
            rightArrow: () => {
                if(this.dateRangeBox.option('opened')) {
                    return true;
                }
            },
            leftArrow: () => {
                if(this.dateRangeBox.option('opened')) {
                    return true;
                }
            },
            enter: (e) => {
                if(this.dateRangeBox.option('opened')) {
                    this.dateRangeBox.getStartDateBox()._strategy._widget._enterKeyHandler(e);
                    this.dateBox._valueChangeEventHandler(e);
                    this.dateRangeBox.getStartDateBox()._strategy._widget.option('values', this.dateRangeBox.option('value'));
                    return false;
                }
            },
            tab: (e) => {
                if(!this.dateRangeBox.option('opened')) {
                    return;
                }

                if(this.dateRangeBox.option('applyValueMode') === 'instantly') {
                    if(e.shiftKey) {
                        if(this.dateRangeBox._isActiveElement(this.dateRangeBox.startDateField())) {
                            this.dateRangeBox.close();
                        }
                    } else {
                        if(this.dateRangeBox._isActiveElement(this.dateRangeBox.endDateField())) {
                            this.dateRangeBox.close();
                        }
                    }
                    return;
                }

                originalHandlers.tab(e);
            }
        };

        return supportedKeys;
    }

    _getWidgetOptions() {
        const { disabledDates: disabledDatesValue, value, multiView } = this.dateRangeBox.option();

        const disabledDates = isFunction(disabledDatesValue)
            ? this._injectComponent(disabledDatesValue)
            : disabledDates;

        return extend(super._getWidgetOptions(), {
            disabledDates,
            values: value,
            selectionMode: 'range',
            viewsCount: multiView ? 2 : 1,
            width: 260,
            _allowChangeSelectionOrder: true,
            _currentSelection: this.getCurrentSelection(),
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
        const { value } = this.dateRangeBox.option();

        if(!this._widget) {
            return;
        }

        this._shouldPreventFocusChange = true;
        this._widget.option('values', value);
    }

    _valueChangedHandler({ value, previousValue, event }) {
        if(isSameDateArrays(value, previousValue) && !this._widget._valueSelected) {
            this._shouldPreventFocusChange = false;
            return;
        }

        this._widget._valueSelected = false;

        const isInstantlyMode = this.dateRangeBox.option('applyValueMode') === 'instantly';

        if(!isInstantlyMode && !event) {
            this.dateRangeBox.updateValue(value);

            return;
        }

        if(isInstantlyMode) {
            if(this.dateRangeBox.option('selectionBehavior') === 'normal') {
                if(this._widget.option('_currentSelection') === 'startDate') {
                    this._dateSelectedCounter = 0;
                } else {
                    this._dateSelectedCounter = 1;

                    if(!value[0]) {
                        this._dateSelectedCounter = -1;
                    } else if(getDeserializedDate(value[0]) > getDeserializedDate(value[1])) {
                        this.dateRangeBox.updateValue([value[0], null], event);
                        return;
                    }
                }
            }

            this.dateRangeBox.updateValue(value, event);
            this._dateSelectedCounter += 1;

            if(this.dateRangeBox.option('selectionBehavior') === 'normal') {
                // TODO update close condition for normal mode
                if(this._dateSelectedCounter === 2) {
                    this.getDateRangeBox().close();

                    return;
                }
            } else {
                if(this._dateSelectedCounter === 2) {
                    this.getDateRangeBox().close();

                    return;
                }
            }
        }

        if(!this._shouldPreventFocusChange) {
            if(this._widget.option('_currentSelection') === 'startDate') {
                this.getDateRangeBox().getEndDateBox().focus();
            } else {
                this.getDateRangeBox().getStartDateBox().focus();
            }
        }

        this._shouldPreventFocusChange = false;
    }

    getCurrentSelection() {
        return this.dateRangeBox.option('_currentSelection');
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
