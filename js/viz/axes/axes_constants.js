import { map as _map } from '../core/utils';

module.exports = {
    logarithmic: 'logarithmic',
    discrete: 'discrete',
    numeric: 'numeric',

    left: 'left',
    right: 'right',
    top: 'top',
    bottom: 'bottom',
    center: 'center',

    horizontal: 'horizontal',
    vertical: 'vertical',

    convertTicksToValues: function(ticks) {
        return _map(ticks || [], function(item) {
            return item.value;
        });
    },

    validateOverlappingMode: function(mode) {
        return mode === 'ignore' || mode === 'none' ? mode : 'hide';
    },

    getTicksCountInRange: function(ticks, valueKey, range) {
        let i = 1;

        if(ticks.length > 1) {
            for(; i < ticks.length; i++) {
                if(Math.abs(ticks[i].coords[valueKey] - ticks[0].coords[valueKey]) >= range) {
                    break;
                }
            }
        }
        return i;
    },

    areLabelsOverlap: function(bBox1, bBox2, spacing, alignment) {
        const horizontalInverted = bBox1.x > bBox2.x;
        const verticalInverted = bBox1.y > bBox2.y;
        let x1 = bBox1.x;
        let x2 = bBox2.x;
        const width1 = bBox1.width;
        const width2 = bBox2.width;

        if(alignment === 'left') {
            x1 += width1 / 2;
            x2 += width2 / 2;
        } else if(alignment === 'right') {
            x1 -= width1 / 2;
            x2 -= width2 / 2;
        }

        const hasHorizontalOverlapping = horizontalInverted ? (x2 + width2 + spacing) > x1 : (x1 + width1 + spacing) > x2;
        const hasVerticalOverlapping = verticalInverted ? (bBox2.y + bBox2.height) > bBox1.y : (bBox1.y + bBox1.height) > bBox2.y;

        return hasHorizontalOverlapping && hasVerticalOverlapping;
    }
};
