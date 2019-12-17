var Globalize = require('globalize');

Globalize.load({
    'main': {
        'ru': {
            'identity': {
                'version': {
                    '_cldrVersion': '28',
                    '_number': '$Revision: 11974 $'
                },
                'language': 'ru'
            },
            'numbers': {
                'defaultNumberingSystem': 'latn',
                'otherNumberingSystems': {
                    'native': 'latn'
                },
                'minimumGroupingDigits': '1',
                'symbols-numberSystem-latn': {
                    'decimal': ',',
                    'group': ' ',
                    'list': ';',
                    'percentSign': '%',
                    'plusSign': '+',
                    'minusSign': '-',
                    'exponential': 'E',
                    'superscriptingExponent': '×',
                    'perMille': '‰',
                    'infinity': '∞',
                    'nan': 'не число',
                    'timeSeparator': ':'
                },
                'decimalFormats-numberSystem-latn': {
                    'standard': '#,##0.###',
                    'long': {
                        'decimalFormat': {
                            '1000-count-one': '0 тысяча',
                            '1000-count-few': '0 тысячи',
                            '1000-count-many': '0 тысяч',
                            '1000-count-other': '0 тысячи',
                            '10000-count-one': '00 тысяча',
                            '10000-count-few': '00 тысячи',
                            '10000-count-many': '00 тысяч',
                            '10000-count-other': '00 тысячи',
                            '100000-count-one': '000 тысяча',
                            '100000-count-few': '000 тысячи',
                            '100000-count-many': '000 тысяч',
                            '100000-count-other': '000 тысячи',
                            '1000000-count-one': '0 миллион',
                            '1000000-count-few': '0 миллиона',
                            '1000000-count-many': '0 миллионов',
                            '1000000-count-other': '0 миллиона',
                            '10000000-count-one': '00 миллион',
                            '10000000-count-few': '00 миллиона',
                            '10000000-count-many': '00 миллионов',
                            '10000000-count-other': '00 миллиона',
                            '100000000-count-one': '000 миллион',
                            '100000000-count-few': '000 миллиона',
                            '100000000-count-many': '000 миллионов',
                            '100000000-count-other': '000 миллиона',
                            '1000000000-count-one': '0 миллиард',
                            '1000000000-count-few': '0 миллиарда',
                            '1000000000-count-many': '0 миллиардов',
                            '1000000000-count-other': '0 миллиарда',
                            '10000000000-count-one': '00 миллиард',
                            '10000000000-count-few': '00 миллиарда',
                            '10000000000-count-many': '00 миллиардов',
                            '10000000000-count-other': '00 миллиарда',
                            '100000000000-count-one': '000 миллиард',
                            '100000000000-count-few': '000 миллиарда',
                            '100000000000-count-many': '000 миллиардов',
                            '100000000000-count-other': '000 миллиарда',
                            '1000000000000-count-one': '0 триллион',
                            '1000000000000-count-few': '0 триллиона',
                            '1000000000000-count-many': '0 триллионов',
                            '1000000000000-count-other': '0 триллиона',
                            '10000000000000-count-one': '00 триллион',
                            '10000000000000-count-few': '00 триллиона',
                            '10000000000000-count-many': '00 триллионов',
                            '10000000000000-count-other': '00 триллиона',
                            '100000000000000-count-one': '000 триллион',
                            '100000000000000-count-few': '000 триллиона',
                            '100000000000000-count-many': '000 триллионов',
                            '100000000000000-count-other': '000 триллиона'
                        }
                    },
                    'short': {
                        'decimalFormat': {
                            '1000-count-one': '0 тыс\'.\'',
                            '1000-count-few': '0 тыс\'.\'',
                            '1000-count-many': '0 тыс\'.\'',
                            '1000-count-other': '0 тыс\'.\'',
                            '10000-count-one': '00 тыс\'.\'',
                            '10000-count-few': '00 тыс\'.\'',
                            '10000-count-many': '00 тыс\'.\'',
                            '10000-count-other': '00 тыс\'.\'',
                            '100000-count-one': '000 тыс\'.\'',
                            '100000-count-few': '000 тыс\'.\'',
                            '100000-count-many': '000 тыс\'.\'',
                            '100000-count-other': '000 тыс\'.\'',
                            '1000000-count-one': '0 млн',
                            '1000000-count-few': '0 млн',
                            '1000000-count-many': '0 млн',
                            '1000000-count-other': '0 млн',
                            '10000000-count-one': '00 млн',
                            '10000000-count-few': '00 млн',
                            '10000000-count-many': '00 млн',
                            '10000000-count-other': '00 млн',
                            '100000000-count-one': '000 млн',
                            '100000000-count-few': '000 млн',
                            '100000000-count-many': '000 млн',
                            '100000000-count-other': '000 млн',
                            '1000000000-count-one': '0 млрд',
                            '1000000000-count-few': '0 млрд',
                            '1000000000-count-many': '0 млрд',
                            '1000000000-count-other': '0 млрд',
                            '10000000000-count-one': '00 млрд',
                            '10000000000-count-few': '00 млрд',
                            '10000000000-count-many': '00 млрд',
                            '10000000000-count-other': '00 млрд',
                            '100000000000-count-one': '000 млрд',
                            '100000000000-count-few': '000 млрд',
                            '100000000000-count-many': '000 млрд',
                            '100000000000-count-other': '000 млрд',
                            '1000000000000-count-one': '0 трлн',
                            '1000000000000-count-few': '0 трлн',
                            '1000000000000-count-many': '0 трлн',
                            '1000000000000-count-other': '0 трлн',
                            '10000000000000-count-one': '00 трлн',
                            '10000000000000-count-few': '00 трлн',
                            '10000000000000-count-many': '00 трлн',
                            '10000000000000-count-other': '00 трлн',
                            '100000000000000-count-one': '000 трлн',
                            '100000000000000-count-few': '000 трлн',
                            '100000000000000-count-many': '000 трлн',
                            '100000000000000-count-other': '000 трлн'
                        }
                    }
                },
                'scientificFormats-numberSystem-latn': {
                    'standard': '#E0'
                },
                'percentFormats-numberSystem-latn': {
                    'standard': '#,##0 %'
                },
                'currencyFormats-numberSystem-latn': {
                    'currencySpacing': {
                        'beforeCurrency': {
                            'currencyMatch': '[:^S:]',
                            'surroundingMatch': '[:digit:]',
                            'insertBetween': ' '
                        },
                        'afterCurrency': {
                            'currencyMatch': '[:^S:]',
                            'surroundingMatch': '[:digit:]',
                            'insertBetween': ' '
                        }
                    },
                    'standard': '#,##0.00 ¤',
                    'accounting': '#,##0.00 ¤',
                    'short': {
                        'standard': {
                            '1000-count-one': '0 тыс\'.\' ¤',
                            '1000-count-few': '0 тыс\'.\' ¤',
                            '1000-count-many': '0 тыс\'.\' ¤',
                            '1000-count-other': '0 тыс\'.\' ¤',
                            '10000-count-one': '00 тыс\'.\' ¤',
                            '10000-count-few': '00 тыс\'.\' ¤',
                            '10000-count-many': '00 тыс\'.\' ¤',
                            '10000-count-other': '00 тыс\'.\' ¤',
                            '100000-count-one': '000 тыс\'.\' ¤',
                            '100000-count-few': '000 тыс\'.\' ¤',
                            '100000-count-many': '000 тыс\'.\' ¤',
                            '100000-count-other': '000 тыс\'.\' ¤',
                            '1000000-count-one': '0 млн ¤',
                            '1000000-count-few': '0 млн ¤',
                            '1000000-count-many': '0 млн ¤',
                            '1000000-count-other': '0 млн ¤',
                            '10000000-count-one': '00 млн ¤',
                            '10000000-count-few': '00 млн ¤',
                            '10000000-count-many': '00 млн ¤',
                            '10000000-count-other': '00 млн ¤',
                            '100000000-count-one': '000 млн ¤',
                            '100000000-count-few': '000 млн ¤',
                            '100000000-count-many': '000 млн ¤',
                            '100000000-count-other': '000 млн ¤',
                            '1000000000-count-one': '0 млрд ¤',
                            '1000000000-count-few': '0 млрд ¤',
                            '1000000000-count-many': '0 млрд ¤',
                            '1000000000-count-other': '0 млрд ¤',
                            '10000000000-count-one': '00 млрд ¤',
                            '10000000000-count-few': '00 млрд ¤',
                            '10000000000-count-many': '00 млрд ¤',
                            '10000000000-count-other': '00 млрд ¤',
                            '100000000000-count-one': '000 млрд ¤',
                            '100000000000-count-few': '000 млрд ¤',
                            '100000000000-count-many': '000 млрд ¤',
                            '100000000000-count-other': '000 млрд ¤',
                            '1000000000000-count-one': '0 трлн ¤',
                            '1000000000000-count-few': '0 трлн ¤',
                            '1000000000000-count-many': '0 трлн ¤',
                            '1000000000000-count-other': '0 трлн ¤',
                            '10000000000000-count-one': '00 трлн ¤',
                            '10000000000000-count-few': '00 трлн ¤',
                            '10000000000000-count-many': '00 трлн ¤',
                            '10000000000000-count-other': '00 трлн ¤',
                            '100000000000000-count-one': '000 трлн ¤',
                            '100000000000000-count-few': '000 трлн ¤',
                            '100000000000000-count-many': '000 трлн ¤',
                            '100000000000000-count-other': '000 трлн ¤'
                        }
                    },
                    'unitPattern-count-one': '{0} {1}',
                    'unitPattern-count-few': '{0} {1}',
                    'unitPattern-count-many': '{0} {1}',
                    'unitPattern-count-other': '{0} {1}'
                },
                'miscPatterns-numberSystem-latn': {
                    'atLeast': '{0}+',
                    'range': '{0}-{1}'
                }
            }
        }
    }
});
