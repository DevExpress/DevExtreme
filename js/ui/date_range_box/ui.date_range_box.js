import registerComponent from '../../core/component_registrator';
import { extend } from '../../core/utils/extend';
import DateBox from '../date_box';

// STYLE dateBox

class DateRangeBox extends DateBox {
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            /**
            * @name dxDateRangeBoxOptions.adaptivityEnabled
            * @hidden
            */

            /**
            * @name dxDateRangeBoxOptions.interval
            * @hidden
            */

            /**
             * @name dxDateRangeBoxOptions.showAnalogClock
             * @hidden
            */

            /**
            * @name dxDateRangeBoxOptions.type
            * @hidden
            */
        });
    }
}

registerComponent('dxDateRangeBox', DateRangeBox);

export default DateRangeBox;
