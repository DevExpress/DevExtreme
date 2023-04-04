import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import DateBox from './date_box';

const DateRangeBox = DateBox.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
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
    },
});

registerComponent('dxDateRangeBox', DateRangeBox);

export default DateRangeBox;
