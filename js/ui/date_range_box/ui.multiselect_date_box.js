import DateBox from '../date_box/ui.date_box.mask';
import CalendarStrategy from './strategy/rangeCalendar';

class MultiselectDateBox extends DateBox {
    _initStrategy() {
        this._strategy = new CalendarStrategy(this);
    }
}

export default MultiselectDateBox;
