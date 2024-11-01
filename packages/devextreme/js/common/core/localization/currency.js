import { extend } from '../../../core/utils/extend';

export default {
    _formatNumberCore: function(value, format, formatConfig) {
        if(format === 'currency') {
            formatConfig.precision = formatConfig.precision || 0;

            let result = this.format(value, extend({}, formatConfig, { type: 'fixedpoint' }));
            const currencyPart = this.getCurrencySymbol().symbol.replace(/\$/g, '$$$$');

            result = result.replace(/^(\D*)(\d.*)/, '$1' + currencyPart + '$2');

            return result;
        }

        return this.callBase.apply(this, arguments);
    },
    getCurrencySymbol: function() {
        return { symbol: '$' };
    },
    getOpenXmlCurrencyFormat: function() {
        return '$#,##0{0}_);\\($#,##0{0}\\)';
    }
};
