import DateBoxCalendarStrategy from '../../date_box/ui.date_box.strategy.calendar';
import { extend } from '../../../core/utils/extend';

class DateRangeBoxCalendarStrategy extends DateBoxCalendarStrategy {
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

    _getWidgetOptions() {
        return extend(super._getWidgetOptions(), {
            values: this.dateRangeBox.option('value'),
            selectionMode: 'range',
            viewsCount: 2,
            width: 260
        });
    }
}

export default DateRangeBoxCalendarStrategy;
