import $ from '../../core/renderer';
import DateBox from '../date_box/ui.date_box.mask';
import RangeCalendarStrategy from './strategy/rangeCalendar';

class MultiselectDateBox extends DateBox {
    _initStrategy() {
        this._strategy = new RangeCalendarStrategy(this);
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

    _popupShownHandler() {
        super._popupShownHandler();

        this._strategy.dateRangeBox._validationMessage?.option('positionSide', this._getValidationMessagePositionSide());
    }

    _popupHiddenHandler() {
        super._popupHiddenHandler();

        this._strategy.dateRangeBox._validationMessage?.option('positionSide', this._getValidationMessagePositionSide());
    }

    _closeOutsideDropDownHandler(e) {
        const { target } = e;
        const [startDateInput, endDateInput] = this._strategy.dateRangeBox.field();

        return super._closeOutsideDropDownHandler(e) && !($(target).is(startDateInput) || $(target).is(endDateInput));
    }

    _focusInHandler(e) {
        super._focusInHandler(e);

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
            this._strategy._widget._setViewsMaxOption(value[1]);
        }
        if($(target).is(endDateInput)) {
            this._strategy.dateRangeBox.getStartDateBox()._strategy.setActiveEndDateBox();
            this._strategy.dateRangeBox.getStartDateBox()._strategy._widget.option('_currentSelection', 'endDate');
            this._strategy.dateRangeBox.getStartDateBox()._strategy._widget._setViewsMinOption(value[0]);
        }
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
}

export default MultiselectDateBox;
