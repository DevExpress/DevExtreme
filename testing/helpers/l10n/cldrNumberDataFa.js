const Globalize = require('globalize');

Globalize.load({
    'main': {
        'fa': {
            'identity': {
                'version': {
                    '_cldrVersion': '36'
                },
                'language': 'fa'
            },
            'numbers': {
                'defaultNumberingSystem': 'arabext',
                'otherNumberingSystems': {
                    'native': 'arabext'
                },
                'minimumGroupingDigits': '1',
                'symbols-numberSystem-arabext': {
                    'decimal': '٫',
                    'group': '٬',
                    'list': '؛',
                    'percentSign': '٪',
                    'plusSign': '‎+',
                    'minusSign': '‎−',
                    'exponential': '×۱۰^',
                    'superscriptingExponent': '×',
                    'perMille': '؉',
                    'infinity': '∞',
                    'nan': 'ناعدد',
                    'timeSeparator': ':'
                },
                'symbols-numberSystem-latn': {
                    'decimal': '.',
                    'group': ',',
                    'list': ';',
                    'percentSign': '%',
                    'plusSign': '‎+',
                    'minusSign': '‎−',
                    'exponential': 'E',
                    'superscriptingExponent': '×',
                    'perMille': '‰',
                    'infinity': '∞',
                    'nan': 'ناعدد',
                    'timeSeparator': ':'
                },
                'decimalFormats-numberSystem-arabext': {
                    'standard': '#,##0.###',
                    'long': {
                        'decimalFormat': {
                            '1000-count-one': '0 هزار',
                            '1000-count-other': '0 هزار',
                            '10000-count-one': '00 هزار',
                            '10000-count-other': '00 هزار',
                            '100000-count-one': '000 هزار',
                            '100000-count-other': '000 هزار',
                            '1000000-count-one': '0 میلیون',
                            '1000000-count-other': '0 میلیون',
                            '10000000-count-one': '00 میلیون',
                            '10000000-count-other': '00 میلیون',
                            '100000000-count-one': '000 میلیون',
                            '100000000-count-other': '000 میلیون',
                            '1000000000-count-one': '0 میلیارد',
                            '1000000000-count-other': '0 میلیارد',
                            '10000000000-count-one': '00 میلیارد',
                            '10000000000-count-other': '00 میلیارد',
                            '100000000000-count-one': '000 میلیارد',
                            '100000000000-count-other': '000 میلیارد',
                            '1000000000000-count-one': '0 هزارمیلیارد',
                            '1000000000000-count-other': '0 هزارمیلیارد',
                            '10000000000000-count-one': '00 هزارمیلیارد',
                            '10000000000000-count-other': '00 هزارمیلیارد',
                            '100000000000000-count-one': '000 هزارمیلیارد',
                            '100000000000000-count-other': '000 هزارمیلیارد'
                        }
                    },
                    'short': {
                        'decimalFormat': {
                            '1000-count-one': '0 هزار',
                            '1000-count-other': '0 هزار',
                            '10000-count-one': '00 هزار',
                            '10000-count-other': '00 هزار',
                            '100000-count-one': '000 هزار',
                            '100000-count-other': '000 هزار',
                            '1000000-count-one': '0 میلیون',
                            '1000000-count-other': '0 میلیون',
                            '10000000-count-one': '00 میلیون',
                            '10000000-count-other': '00 میلیون',
                            '100000000-count-one': '000 م',
                            '100000000-count-other': '000 م',
                            '1000000000-count-one': '0 م',
                            '1000000000-count-other': '0 م',
                            '10000000000-count-one': '00 م',
                            '10000000000-count-other': '00 م',
                            '100000000000-count-one': '000 ب',
                            '100000000000-count-other': '000 میلیارد',
                            '1000000000000-count-one': '0 ت',
                            '1000000000000-count-other': '0 تریلیون',
                            '10000000000000-count-one': '00 ت',
                            '10000000000000-count-other': '00 ت',
                            '100000000000000-count-one': '000 ت',
                            '100000000000000-count-other': '000 ت'
                        }
                    }
                },
                'decimalFormats-numberSystem-latn': {
                    'standard': '#,##0.###',
                    'long': {
                        'decimalFormat': {
                            '1000-count-one': '0 هزار',
                            '1000-count-other': '0 هزار',
                            '10000-count-one': '00 هزار',
                            '10000-count-other': '00 هزار',
                            '100000-count-one': '000 هزار',
                            '100000-count-other': '000 هزار',
                            '1000000-count-one': '0 میلیون',
                            '1000000-count-other': '0 میلیون',
                            '10000000-count-one': '00 میلیون',
                            '10000000-count-other': '00 میلیون',
                            '100000000-count-one': '000 میلیون',
                            '100000000-count-other': '000 میلیون',
                            '1000000000-count-one': '0 میلیارد',
                            '1000000000-count-other': '0 میلیارد',
                            '10000000000-count-one': '00 میلیارد',
                            '10000000000-count-other': '00 میلیارد',
                            '100000000000-count-one': '000 میلیارد',
                            '100000000000-count-other': '000 میلیارد',
                            '1000000000000-count-one': '0 هزارمیلیارد',
                            '1000000000000-count-other': '0 هزارمیلیارد',
                            '10000000000000-count-one': '00 هزارمیلیارد',
                            '10000000000000-count-other': '00 هزارمیلیارد',
                            '100000000000000-count-one': '000 هزارمیلیارد',
                            '100000000000000-count-other': '000 هزارمیلیارد'
                        }
                    },
                    'short': {
                        'decimalFormat': {
                            '1000-count-one': '0 هزار',
                            '1000-count-other': '0 هزار',
                            '10000-count-one': '00 هزار',
                            '10000-count-other': '00 هزار',
                            '100000-count-one': '000 هزار',
                            '100000-count-other': '000 هزار',
                            '1000000-count-one': '0 میلیون',
                            '1000000-count-other': '0 میلیون',
                            '10000000-count-one': '00 میلیون',
                            '10000000-count-other': '00 میلیون',
                            '100000000-count-one': '000 م',
                            '100000000-count-other': '000 م',
                            '1000000000-count-one': '0 م',
                            '1000000000-count-other': '0 م',
                            '10000000000-count-one': '00 م',
                            '10000000000-count-other': '00 م',
                            '100000000000-count-one': '000 ب',
                            '100000000000-count-other': '000 میلیارد',
                            '1000000000000-count-one': '0 ت',
                            '1000000000000-count-other': '0 تریلیون',
                            '10000000000000-count-one': '00 ت',
                            '10000000000000-count-other': '00 ت',
                            '100000000000000-count-one': '000 ت',
                            '100000000000000-count-other': '000 ت'
                        }
                    }
                },
                'scientificFormats-numberSystem-arabext': {
                    'standard': '#E0'
                },
                'scientificFormats-numberSystem-latn': {
                    'standard': '#E0'
                },
                'percentFormats-numberSystem-arabext': {
                    'standard': '#,##0%'
                },
                'percentFormats-numberSystem-latn': {
                    'standard': '#,##0%'
                },
                'currencyFormats-numberSystem-arabext': {
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
                    'standard': '‎¤#,##0.00',
                    'accounting': '‎¤ #,##0.00;‎(¤ #,##0.00)',
                    'short': {
                        'standard': {
                            '1000-count-one': '0 هزار ¤',
                            '1000-count-other': '0 هزار ¤',
                            '10000-count-one': '00 هزار ¤',
                            '10000-count-other': '00 هزار ¤',
                            '100000-count-one': '000 هزار ¤',
                            '100000-count-other': '000 هزار ¤',
                            '1000000-count-one': '0 میلیون ¤',
                            '1000000-count-other': '0 میلیون ¤',
                            '10000000-count-one': '00 میلیون ¤',
                            '10000000-count-other': '00 میلیون ¤',
                            '100000000-count-one': '000 میلیون ¤',
                            '100000000-count-other': '000 میلیون ¤',
                            '1000000000-count-one': '0 میلیارد ¤',
                            '1000000000-count-other': '0 میلیارد ¤',
                            '10000000000-count-one': '00 میلیارد ¤',
                            '10000000000-count-other': '00 میلیارد ¤',
                            '100000000000-count-one': '000 میلیارد ¤',
                            '100000000000-count-other': '000 میلیارد ¤',
                            '1000000000000-count-one': '0 هزارمیلیارد ¤',
                            '1000000000000-count-other': '0 هزارمیلیارد ¤',
                            '10000000000000-count-one': '00 هزارمیلیارد ¤',
                            '10000000000000-count-other': '00 هزارمیلیارد ¤',
                            '100000000000000-count-one': '000 هزارمیلیارد ¤',
                            '100000000000000-count-other': '000 هزارمیلیارد ¤'
                        }
                    },
                    'unitPattern-count-one': '{0} {1}',
                    'unitPattern-count-other': '{0} {1}'
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
                    'standard': '‎¤ #,##0.00',
                    'accounting': '‎¤ #,##0.00;‎(¤ #,##0.00)',
                    'short': {
                        'standard': {
                            '1000-count-one': '0 هزار ¤',
                            '1000-count-other': '0 هزار ¤',
                            '10000-count-one': '00 هزار ¤',
                            '10000-count-other': '00 هزار ¤',
                            '100000-count-one': '000 هزار ¤',
                            '100000-count-other': '000 هزار ¤',
                            '1000000-count-one': '0 میلیون ¤',
                            '1000000-count-other': '0 میلیون ¤',
                            '10000000-count-one': '00 میلیون ¤',
                            '10000000-count-other': '00 میلیون ¤',
                            '100000000-count-one': '000 میلیون ¤',
                            '100000000-count-other': '000 میلیون ¤',
                            '1000000000-count-one': '0 میلیارد ¤',
                            '1000000000-count-other': '0 میلیارد ¤',
                            '10000000000-count-one': '00 میلیارد ¤',
                            '10000000000-count-other': '00 میلیارد ¤',
                            '100000000000-count-one': '000 میلیارد ¤',
                            '100000000000-count-other': '000 میلیارد ¤',
                            '1000000000000-count-one': '0 هزارمیلیارد ¤',
                            '1000000000000-count-other': '0 هزارمیلیارد ¤',
                            '10000000000000-count-one': '00 هزارمیلیارد ¤',
                            '10000000000000-count-other': '00 هزارمیلیارد ¤',
                            '100000000000000-count-one': '000 هزارمیلیارد ¤',
                            '100000000000000-count-other': '000 هزارمیلیارد ¤'
                        }
                    },
                    'unitPattern-count-one': '{0} {1}',
                    'unitPattern-count-other': '{0} {1}'
                },
                'miscPatterns-numberSystem-arabext': {
                    'approximately': '~{0}',
                    'atLeast': '‎{0}+‎',
                    'atMost': '≤{0}',
                    'range': '{0}–{1}'
                },
                'miscPatterns-numberSystem-latn': {
                    'approximately': '~{0}',
                    'atLeast': '‎{0}+‎',
                    'atMost': '≤{0}',
                    'range': '{0}–{1}'
                },
                'minimalPairs': {
                    'pluralMinimalPairs-count-one': '{0} نفر در بازی شرکت کرد.',
                    'pluralMinimalPairs-count-other': '{0} نفر در بازی شرکت کردند.',
                    'other': 'در پیچ {0}ام سمت راست بپیچید.'
                }
            }
        }
    }
});
