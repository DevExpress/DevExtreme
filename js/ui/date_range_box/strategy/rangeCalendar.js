import CalendarStrategy from '../../date_box/ui.date_box.strategy.calendar';
import eventsEngine from '../../../events/core/events_engine';
import { extend } from '../../../core/utils/extend';
import { isSameDateArrays, getDeserializedDate, isSameDates } from '../ui.date_range.utils';
import { isFunction } from '../../../core/utils/type';

const APPLY_BUTTON_SELECTOR = '.dx-popup-done.dx-button';
const CANCEL_BUTTON_SELECTOR = '.dx-popup-cancel.dx-button';
const TODAY_BUTTON_CLASS = 'dx-button-today';

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

    getFirstPopupElement() {
        const $popupWrapper = this._getPopup().$wrapper();

        const $todayButton = $popupWrapper.find(`.${TODAY_BUTTON_CLASS}`);

        if($todayButton.length) {
            return $todayButton;
        }

        return $popupWrapper.find(APPLY_BUTTON_SELECTOR);
    }

    getLastPopupElement() {
        return this._getPopup().$wrapper().find(CANCEL_BUTTON_SELECTOR);
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
                        this.dateRangeBox.getStartDateBox()._strategy._widget.option('values', this.dateRangeBox.option('value'));
                    } else {
                        this.dateRangeBox.getStartDateBox()._strategy._widget._enterKeyHandler(e);
                    }

                    return false;
                }
            },
            tab: (e) => {
                if(!this.dateRangeBox.option('opened')) {
                    return;
                }

                if(this._isInstantlyMode()) {
                    if(e.shiftKey) {
                        if(this.getDateRangeBox()._isStartDateActiveElement()) {
                            this.dateRangeBox.close();
                        }
                    } else {
                        if(this.getDateRangeBox()._isEndDateActiveElement()) {
                            this.dateRangeBox.close();
                        }
                    }
                    return;
                }

                e.preventDefault();

                if(e.shiftKey) {
                    if(this.getDateRangeBox()._isEndDateActiveElement()) {

                        this.getDateRangeBox().focus();
                        return;
                    }
                } else {
                    if(this.getDateRangeBox()._isStartDateActiveElement()) {
                        this.getDateRangeBox().getEndDateBox().focus();

                        return;
                    }
                }

                const $focusableElement = e.shiftKey
                    ? this.getLastPopupElement()
                    : this.getFirstPopupElement();

                if($focusableElement) {
                    eventsEngine.trigger($focusableElement, 'focus');
                    $focusableElement.select();
                }
            }
        };
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

            if(this._dateSelectedCounter === 2) {
                this.getDateRangeBox().close();

                return;
            }
        }

        if(!this._shouldPreventFocusChange) {
            const targetDateBox = this._widget.option('_currentSelection') === 'startDate'
                ? this.getDateRangeBox().getEndDateBox()
                : this.getDateRangeBox().getStartDateBox();

            targetDateBox.focus();
            eventsEngine.trigger(targetDateBox.field(), 'dxclick');
        }

        this._shouldPreventFocusChange = false;
    }

    getCurrentSelection() {
        return this.dateRangeBox.option('_currentSelection');
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
}

export default RangeCalendarStrategy;
