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
}

export default MultiselectDateBox;
