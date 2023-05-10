import DateBox from '../date_box/ui.date_box.mask';
import RangeCalendarStrategy from './strategy/rangeCalendar';

class MultiselectDateBox extends DateBox {
    _initStrategy() {
        this._strategy = new RangeCalendarStrategy(this);
    }

    _applyButtonHandler(e) {
        const value = this._strategy.getValue();

        this._strategy.dateRangeBox.updateValue(value);

        this.close();
        this.option('focusStateEnabled') && this.focus();
    }

    _popupShownHandler() {
        super._popupShownHandler(arguments);

        this._strategy.dateRangeBox._validationMessage?.option('positionSide', this._getValidationMessagePositionSide());
    }

    _popupHiddenHandler() {
        super._popupHiddenHandler(arguments);

        this._strategy.dateRangeBox._validationMessage?.option('positionSide', this._getValidationMessagePositionSide());
    }
}

export default MultiselectDateBox;
