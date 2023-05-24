import $ from '../../core/renderer';
import DateBox from '../date_box/ui.date_box.mask';
import RangeCalendarStrategy from './strategy/rangeCalendar';
import { addNamespace } from '../../events/utils';
import eventsEngine from '../../events/core/events_engine';

const START_DATEBOX_CLASS = 'dx-start-datebox';
class MultiselectDateBox extends DateBox {
    _initStrategy() {
        this._strategy = new RangeCalendarStrategy(this);
    }

    _initMarkup() {
        super._initMarkup();

        this._renderInputClickEvent();
    }

    _renderInputClickEvent() {
        const clickEventName = addNamespace('dxclick', this.NAME);
        eventsEngine.off(this._input(), clickEventName);
        eventsEngine.on(this._input(), clickEventName, (e) => {
            this._inputClickHandler(e);
        });
    }

    _applyButtonHandler({ event }) {
        const value = this._strategy.getValue();

        this._strategy.dateRangeBox.updateValue(value, event);

        this.close();
        this.option('focusStateEnabled') && this.focus();
    }

    _openHandler(e) {
        if(this._strategy.dateRangeBox.option('opened')) {
            return;
        }

        super._openHandler(e);
    }

    _renderOpenedState() {
        this._strategy.dateRangeBox.option('opened', this.option('opened'));

        if(this._isStartDateBox()) {
            super._renderOpenedState();
        }
    }

    _isStartDateBox() {
        return this.$element().hasClass(START_DATEBOX_CLASS);
    }

    _renderPopup() {
        super._renderPopup();

        if(this._isStartDateBox()) {
            const dateRangeBox = this._strategy.dateRangeBox;
            dateRangeBox._bindInnerWidgetOptions(this._popup, 'dropDownOptions');
        }
    }

    _popupShownHandler() {
        super._popupShownHandler();

        this._strategy.dateRangeBox._validationMessage?.option('positionSide', this._getValidationMessagePositionSide());
    }

    _popupHiddenHandler() {
        super._popupHiddenHandler();

        this._strategy.dateRangeBox._validationMessage?.option('positionSide', this._getValidationMessagePositionSide());
    }

    _inputClickHandler(e) {
        const { target } = e;
        const [startDateInput, endDateInput] = this._strategy.dateRangeBox.field();

        if($(target).is(startDateInput)) {
            this._strategy.dateRangeBox.option('_currentSelection', 'startDate');
        }
        if($(target).is(endDateInput)) {
            this._strategy.dateRangeBox.option('_currentSelection', 'endDate');
        }

        if(!this._strategy.dateRangeBox.getStartDateBox()._strategy._widget) {
            return;
        }

        const value = this._strategy.dateRangeBox.getStartDateBox()._strategy._widget.option('values');

        if($(target).is(startDateInput)) {
            this._strategy.setActiveStartDateBox();
            this._strategy._widget.option('_currentSelection', 'startDate');

            if(this._strategy.dateRangeBox.option('selectionBehavior') === 'withDisable') {
                this._strategy._widget._setViewsMaxOption(value[1]);
            }
        }
        if($(target).is(endDateInput)) {
            this._strategy.dateRangeBox.getStartDateBox()._strategy.setActiveEndDateBox();
            this._strategy.dateRangeBox.getStartDateBox()._strategy._widget.option('_currentSelection', 'endDate');

            if(this._strategy.dateRangeBox.option('selectionBehavior') === 'withDisable') {
                this._strategy.dateRangeBox.getStartDateBox()._strategy._widget._setViewsMinOption(value[0]);
            }
        }
    }

    _invalidate() {
        super._invalidate();
        this._refreshStrategy();
    }

    _updateInternalValidationState(isValid, validationMessage) {
        this.option({
            isValid,
            validationError: isValid ? null : {
                message: validationMessage
            }
        });
    }

    _recallInternalValidation(value) {
        this._applyInternalValidation(value);
    }

    _isTargetOutOfComponent(target) {
        const $dateRangeBox = this._strategy.dateRangeBox.$element();
        const isTargetOutOfDateRangeBox = $(target).closest($dateRangeBox).length === 0;

        return super._isTargetOutOfComponent(target) && isTargetOutOfDateRangeBox;
    }

    _optionChanged(args) {
        switch(args.name) {
            case 'isValid': {
                const isValid = this._strategy.dateRangeBox.option('isValid');

                if(this._skipIsValidOptionChange || isValid === args.value) {
                    super._optionChanged(args);
                    return;
                }

                this._skipIsValidOptionChange = true;
                this.option({ isValid });
                this._skipIsValidOptionChange = false;
                break;
            }
            default:
                super._optionChanged(args);
                break;
        }
    }

    close() {
        this._strategy.getDateRangeBox().getStartDateBox().option('opened', false);
    }
}

export default MultiselectDateBox;
