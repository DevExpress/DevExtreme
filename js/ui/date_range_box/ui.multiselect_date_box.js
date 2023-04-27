import DateBox from '../date_box/ui.date_box.mask';
import RangeCalendarStrategy from './strategy/rangeCalendar';

class MultiselectDateBox extends DateBox {
    _initStrategy() {
        this._strategy = new RangeCalendarStrategy(this);
    }
}

export default MultiselectDateBox;
