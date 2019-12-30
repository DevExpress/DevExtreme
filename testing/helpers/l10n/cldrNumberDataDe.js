const Globalize = require('globalize');

Globalize.load({
    'main': {
        'de': {
            'identity': {
                'version': {
                    '_cldrVersion': '28',
                    '_number': '$Revision: 11972 $'
                },
                'language': 'de'
            },
            'numbers': {
                'defaultNumberingSystem': 'latn',
                'otherNumberingSystems': {
                    'native': 'latn'
                },
                'minimumGroupingDigits': '1',
                'symbols-numberSystem-latn': {
                    'decimal': ',',
                    'group': '.',
                    'list': ';',
                    'percentSign': '%',
                    'plusSign': '+',
                    'minusSign': '-',
                    'exponential': 'E',
                    'superscriptingExponent': '·',
                    'perMille': '‰',
                    'infinity': '∞',
                    'nan': 'NaN',
                    'timeSeparator': ':'
                },
                'decimalFormats-numberSystem-latn': {
                    'standard': '#,##0.###',
                    'long': {
                        'decimalFormat': {
                            '1000-count-one': '0 Tausend',
                            '1000-count-other': '0 Tausend',
                            '10000-count-one': '00 Tausend',
                            '10000-count-other': '00 Tausend',
                            '100000-count-one': '000 Tausend',
                            '100000-count-other': '000 Tausend',
                            '1000000-count-one': '0 Million',
                            '1000000-count-other': '0 Millionen',
                            '10000000-count-one': '00 Millionen',
                            '10000000-count-other': '00 Millionen',
                            '100000000-count-one': '000 Millionen',
                            '100000000-count-other': '000 Millionen',
                            '1000000000-count-one': '0 Milliarde',
                            '1000000000-count-other': '0 Milliarden',
                            '10000000000-count-one': '00 Milliarden',
                            '10000000000-count-other': '00 Milliarden',
                            '100000000000-count-one': '000 Milliarden',
                            '100000000000-count-other': '000 Milliarden',
                            '1000000000000-count-one': '0 Billion',
                            '1000000000000-count-other': '0 Billionen',
                            '10000000000000-count-one': '00 Billionen',
                            '10000000000000-count-other': '00 Billionen',
                            '100000000000000-count-one': '000 Billionen',
                            '100000000000000-count-other': '000 Billionen'
                        }
                    },
                    'short': {
                        'decimalFormat': {
                            '1000-count-one': '0 Tsd\'.\'',
                            '1000-count-other': '0 Tsd\'.\'',
                            '10000-count-one': '00 Tsd\'.\'',
                            '10000-count-other': '00 Tsd\'.\'',
                            '100000-count-one': '000 Tsd\'.\'',
                            '100000-count-other': '000 Tsd\'.\'',
                            '1000000-count-one': '0 Mio\'.\'',
                            '1000000-count-other': '0 Mio\'.\'',
                            '10000000-count-one': '00 Mio\'.\'',
                            '10000000-count-other': '00 Mio\'.\'',
                            '100000000-count-one': '000 Mio\'.\'',
                            '100000000-count-other': '000 Mio\'.\'',
                            '1000000000-count-one': '0 Mrd\'.\'',
                            '1000000000-count-other': '0 Mrd\'.\'',
                            '10000000000-count-one': '00 Mrd\'.\'',
                            '10000000000-count-other': '00 Mrd\'.\'',
                            '100000000000-count-one': '000 Mrd\'.\'',
                            '100000000000-count-other': '000 Mrd\'.\'',
                            '1000000000000-count-one': '0 Bio\'.\'',
                            '1000000000000-count-other': '0 Bio\'.\'',
                            '10000000000000-count-one': '00 Bio\'.\'',
                            '10000000000000-count-other': '00 Bio\'.\'',
                            '100000000000000-count-one': '000 Bio\'.\'',
                            '100000000000000-count-other': '000 Bio\'.\''
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
                            '1000-count-one': '0 Tsd\'.\' ¤',
                            '1000-count-other': '0 Tsd\'.\' ¤',
                            '10000-count-one': '00 Tsd\'.\' ¤',
                            '10000-count-other': '00 Tsd\'.\' ¤',
                            '100000-count-one': '000 Tsd\'.\' ¤',
                            '100000-count-other': '000 Tsd\'.\' ¤',
                            '1000000-count-one': '0 Mio\'.\' ¤',
                            '1000000-count-other': '0 Mio\'.\' ¤',
                            '10000000-count-one': '00 Mio\'.\' ¤',
                            '10000000-count-other': '00 Mio\'.\' ¤',
                            '100000000-count-one': '000 Mio\'.\' ¤',
                            '100000000-count-other': '000 Mio\'.\' ¤',
                            '1000000000-count-one': '0 Mrd\'.\' ¤',
                            '1000000000-count-other': '0 Mrd\'.\' ¤',
                            '10000000000-count-one': '00 Mrd\'.\' ¤',
                            '10000000000-count-other': '00 Mrd\'.\' ¤',
                            '100000000000-count-one': '000 Mrd\'.\' ¤',
                            '100000000000-count-other': '000 Mrd\'.\' ¤',
                            '1000000000000-count-one': '0 Bio\'.\' ¤',
                            '1000000000000-count-other': '0 Bio\'.\' ¤',
                            '10000000000000-count-one': '00 Bio\'.\' ¤',
                            '10000000000000-count-other': '00 Bio\'.\' ¤',
                            '100000000000000-count-one': '000 Bio\'.\' ¤',
                            '100000000000000-count-other': '000 Bio\'.\' ¤'
                        }
                    },
                    'unitPattern-count-one': '{0} {1}',
                    'unitPattern-count-other': '{0} {1}'
                },
                'miscPatterns-numberSystem-latn': {
                    'atLeast': '{0}+',
                    'range': '{0}–{1}'
                }
            }
        }
    }
});
