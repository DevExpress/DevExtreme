import CalendarStrategy from '../../date_box/ui.date_box.strategy.calendar';
import eventsEngine from '../../../events/core/events_engine';
import { extend } from '../../../core/utils/extend';
import { isSameDateArrays, getDeserializedDate, isSameDates } from '../ui.date_range.utils';
import { isFunction } from '../../../core/utils/type';

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

    supportedKeys() {
        return {
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
            },
            enter: (e) => {
                if(this.dateRangeBox.option('opened')) {
                    const dateBoxValue = this.dateBox.dateOption('value');
                    this.dateBox._valueChangeEventHandler(e);
                    const newDateBoxValue = this.dateBox.dateOption('value');
                    const dateBoxValueChanged = !isSameDates(dateBoxValue, newDateBoxValue);

                    if(dateBoxValueChanged) {
                        this.dateRangeBox.getStartDateBox()._strategy._widget.option('value', this.dateRangeBox.option('value'));
                    } else {
                        this.dateRangeBox.getStartDateBox()._strategy._widget._enterKeyHandler(e);
                    }

                    return false;
                }
            },
            tab: (e) => {
                if(!this.getDateRangeBox().option('opened')) {
                    return;
                }

                if(!this._getPopup().getFocusableElements().length) {
                    if((!e.shiftKey && this.getDateRangeBox()._isEndDateActiveElement())
                        || (e.shiftKey && this.getDateRangeBox()._isStartDateActiveElement())) {
                        this.dateRangeBox.close();
                    }
                    return;
                }

                if(((!e.shiftKey && this.getDateRangeBox()._isStartDateActiveElement())
                    || (e.shiftKey && this.getDateRangeBox()._isEndDateActiveElement()))) {
                    return;
                }

                const $focusableElement = e.shiftKey
                    ? this.getDateRangeBox().getStartDateBox()._getLastPopupElement()
                    : this.getDateRangeBox().getStartDateBox()._getFirstPopupElement();

                if($focusableElement) {
                    eventsEngine.trigger($focusableElement, 'focus');
                    $focusableElement.select();
                }

                e.preventDefault();
            }
        };
    }

    _getWidgetOptions() {
        const { disabledDates: disabledDatesValue, value, multiView } = this.dateRangeBox.option();

        const disabledDates = isFunction(disabledDatesValue)
            ? this._injectComponent(disabledDatesValue)
            : (disabledDatesValue ?? undefined);

        return extend(super._getWidgetOptions(), {
            disabledDates,
            value,
            selectionMode: 'range',
            viewsCount: multiView ? 2 : 1,
            _allowChangeSelectionOrder: true,
            _currentSelection: this.getCurrentSelection(),
        });
    }

    _refreshActiveDescendant(e) {
        this.dateRangeBox.setAria('activedescendant', e.actionValue);
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
        return this._widget.option('value');
    }

    _updateValue() {
        const { value } = this.dateRangeBox.option();

        if(!this._widget) {
            return;
        }

        this._shouldPreventFocusChange = true;
        this._widget.option('value', value);
    }

    _isInstantlyMode() {
        return this.dateRangeBox.option('applyValueMode') === 'instantly';
    }

    _valueChangedHandler({ value, previousValue, event }) {
        if(isSameDateArrays(value, previousValue) && !this._widget._valueSelected) {
            this._shouldPreventFocusChange = false;
            return;
        }

        this._widget._valueSelected = false;

        if(this._isInstantlyMode()) {
            if(!this.dateRangeBox.option('disableOutOfRangeSelection')) {
                if(this._getCalendarCurrentSelection() === 'startDate') {
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

            if(this._dateSelectedCounter === 2) {
                this.getDateRangeBox().close();

                return;
            }
        } else {
            if(this._getCalendarCurrentSelection() === 'endDate') {
                if(value[0] && getDeserializedDate(value[0]) > getDeserializedDate(value[1])) {
                    return;
                }
            }
        }

        if(!this._shouldPreventFocusChange) {
            this._moveFocusToNextInput();
        }

        this._shouldPreventFocusChange = false;
    }

    _moveFocusToNextInput() {
        const targetDateBox = this._getCalendarCurrentSelection() === 'startDate'
            ? this.getDateRangeBox().getEndDateBox()
            : this.getDateRangeBox().getStartDateBox();

        targetDateBox.focus();
        eventsEngine.trigger(targetDateBox.field(), 'dxclick');
    }

    getCurrentSelection() {
        return this.dateRangeBox.option('_currentSelection');
    }

    _getCalendarCurrentSelection() {
        return this._widget.option('_currentSelection');
    }

    _closeDropDownByEnter() {
        if(this._getCalendarCurrentSelection() === 'startDate') {
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
}

export default RangeCalendarStrategy;
