const Globalize = require('globalize');

Globalize.load({
    'main': {
        'mr': {
            'identity': {
                'version': {
                    '_cldrVersion': '36'
                },
                'language': 'mr'
            },
            'numbers': {
                'defaultNumberingSystem': 'deva',
                'otherNumberingSystems': {
                    'native': 'deva'
                },
                'minimumGroupingDigits': '1',
                'symbols-numberSystem-deva': {
                    'decimal': '.',
                    'group': ',',
                    'list': ';',
                    'percentSign': '%',
                    'plusSign': '+',
                    'minusSign': '-',
                    'exponential': 'E',
                    'superscriptingExponent': '×',
                    'perMille': '‰',
                    'infinity': '∞',
                    'nan': 'NaN',
                    'timeSeparator': ':'
                },
                'symbols-numberSystem-latn': {
                    'decimal': '.',
                    'group': ',',
                    'list': ';',
                    'percentSign': '%',
                    'plusSign': '+',
                    'minusSign': '-',
                    'exponential': 'E',
                    'superscriptingExponent': '×',
                    'perMille': '‰',
                    'infinity': '∞',
                    'nan': 'NaN',
                    'timeSeparator': ':'
                },
                'decimalFormats-numberSystem-deva': {
                    'standard': '#,##,##0.###',
                    'long': {
                        'decimalFormat': {
                            '1000-count-one': '0 हजार',
                            '1000-count-other': '0 हजार',
                            '10000-count-one': '00 हजार',
                            '10000-count-other': '00 हजार',
                            '100000-count-one': '0 लाख',
                            '100000-count-other': '0 लाख',
                            '1000000-count-one': '00 लाख',
                            '1000000-count-other': '00 लाख',
                            '10000000-count-one': '0 कोटी',
                            '10000000-count-other': '0 कोटी',
                            '100000000-count-one': '00 कोटी',
                            '100000000-count-other': '00 कोटी',
                            '1000000000-count-one': '0 अब्ज',
                            '1000000000-count-other': '0 अब्ज',
                            '10000000000-count-one': '00 अब्ज',
                            '10000000000-count-other': '00 अब्ज',
                            '100000000000-count-one': '0 खर्व',
                            '100000000000-count-other': '0 खर्व',
                            '1000000000000-count-one': '00 खर्व',
                            '1000000000000-count-other': '00 खर्व',
                            '10000000000000-count-one': '0 पद्म',
                            '10000000000000-count-other': '0 पद्म',
                            '100000000000000-count-one': '00 पद्म',
                            '100000000000000-count-other': '00 पद्म'
                        }
                    },
                    'short': {
                        'decimalFormat': {
                            '1000-count-one': '0 ह',
                            '1000-count-other': '0 ह',
                            '10000-count-one': '00 ह',
                            '10000-count-other': '00 ह',
                            '100000-count-one': '0 लाख',
                            '100000-count-other': '0 लाख',
                            '1000000-count-one': '00 लाख',
                            '1000000-count-other': '00 लाख',
                            '10000000-count-one': '0 कोटी',
                            '10000000-count-other': '0 कोटी',
                            '100000000-count-one': '00 कोटी',
                            '100000000-count-other': '00 कोटी',
                            '1000000000-count-one': '0 अब्ज',
                            '1000000000-count-other': '0 अब्ज',
                            '10000000000-count-one': '00 अब्ज',
                            '10000000000-count-other': '00 अब्ज',
                            '100000000000-count-one': '0 खर्व',
                            '100000000000-count-other': '0 खर्व',
                            '1000000000000-count-one': '00 खर्व',
                            '1000000000000-count-other': '00 खर्व',
                            '10000000000000-count-one': '0 पद्म',
                            '10000000000000-count-other': '0 पद्म',
                            '100000000000000-count-one': '00 पद्म',
                            '100000000000000-count-other': '00 पद्म'
                        }
                    }
                },
                'decimalFormats-numberSystem-latn': {
                    'standard': '#,##,##0.###',
                    'long': {
                        'decimalFormat': {
                            '1000-count-one': '0 हजार',
                            '1000-count-other': '0 हजार',
                            '10000-count-one': '00 हजार',
                            '10000-count-other': '00 हजार',
                            '100000-count-one': '0 लाख',
                            '100000-count-other': '0 लाख',
                            '1000000-count-one': '00 लाख',
                            '1000000-count-other': '00 लाख',
                            '10000000-count-one': '0 कोटी',
                            '10000000-count-other': '0 कोटी',
                            '100000000-count-one': '00 कोटी',
                            '100000000-count-other': '00 कोटी',
                            '1000000000-count-one': '0 अब्ज',
                            '1000000000-count-other': '0 अब्ज',
                            '10000000000-count-one': '00 अब्ज',
                            '10000000000-count-other': '00 अब्ज',
                            '100000000000-count-one': '0 खर्व',
                            '100000000000-count-other': '0 खर्व',
                            '1000000000000-count-one': '00 खर्व',
                            '1000000000000-count-other': '00 खर्व',
                            '10000000000000-count-one': '0 पद्म',
                            '10000000000000-count-other': '0 पद्म',
                            '100000000000000-count-one': '00 पद्म',
                            '100000000000000-count-other': '00 पद्म'
                        }
                    },
                    'short': {
                        'decimalFormat': {
                            '1000-count-one': '0 ह',
                            '1000-count-other': '0 ह',
                            '10000-count-one': '00 ह',
                            '10000-count-other': '00 ह',
                            '100000-count-one': '0 लाख',
                            '100000-count-other': '0 लाख',
                            '1000000-count-one': '00 लाख',
                            '1000000-count-other': '00 लाख',
                            '10000000-count-one': '0 कोटी',
                            '10000000-count-other': '0 कोटी',
                            '100000000-count-one': '00 कोटी',
                            '100000000-count-other': '00 कोटी',
                            '1000000000-count-one': '0 अब्ज',
                            '1000000000-count-other': '0 अब्ज',
                            '10000000000-count-one': '00 अब्ज',
                            '10000000000-count-other': '00 अब्ज',
                            '100000000000-count-one': '0 खर्व',
                            '100000000000-count-other': '0 खर्व',
                            '1000000000000-count-one': '00 खर्व',
                            '1000000000000-count-other': '00 खर्व',
                            '10000000000000-count-one': '0 पद्म',
                            '10000000000000-count-other': '0 पद्म',
                            '100000000000000-count-one': '00 पद्म',
                            '100000000000000-count-other': '00 पद्म'
                        }
                    }
                },
                'scientificFormats-numberSystem-deva': {
                    'standard': '[#E0]'
                },
                'scientificFormats-numberSystem-latn': {
                    'standard': '[#E0]'
                },
                'percentFormats-numberSystem-deva': {
                    'standard': '#,##0%'
                },
                'percentFormats-numberSystem-latn': {
                    'standard': '#,##0%'
                },
                'currencyFormats-numberSystem-deva': {
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
                    'standard': '¤#,##0.00',
                    'accounting': '¤#,##0.00;(¤#,##0.00)',
                    'short': {
                        'standard': {
                            '1000-count-one': '¤0 ह',
                            '1000-count-other': '¤0 ह',
                            '10000-count-one': '¤00 ह',
                            '10000-count-other': '¤00 ह',
                            '100000-count-one': '¤0 लाख',
                            '100000-count-other': '¤0 लाख',
                            '1000000-count-one': '¤00 लाख',
                            '1000000-count-other': '¤00 लाख',
                            '10000000-count-one': '¤0 कोटी',
                            '10000000-count-other': '¤0 कोटी',
                            '100000000-count-one': '¤00 कोटी',
                            '100000000-count-other': '¤00 कोटी',
                            '1000000000-count-one': '¤0 अब्ज',
                            '1000000000-count-other': '¤0 अब्ज',
                            '10000000000-count-one': '¤00 अब्ज',
                            '10000000000-count-other': '¤00 अब्ज',
                            '100000000000-count-one': '¤0 खर्व',
                            '100000000000-count-other': '¤0 खर्व',
                            '1000000000000-count-one': '¤00 खर्व',
                            '1000000000000-count-other': '¤00 खर्व',
                            '10000000000000-count-one': '¤0 पद्म',
                            '10000000000000-count-other': '¤0 पद्म',
                            '100000000000000-count-one': '¤00 पद्म',
                            '100000000000000-count-other': '¤00 पद्म'
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
                    'standard': '¤#,##0.00',
                    'accounting': '¤#,##0.00;(¤#,##0.00)',
                    'short': {
                        'standard': {
                            '1000-count-one': '¤0 ह',
                            '1000-count-other': '¤0 ह',
                            '10000-count-one': '¤00 ह',
                            '10000-count-other': '¤00 ह',
                            '100000-count-one': '¤0 लाख',
                            '100000-count-other': '¤0 लाख',
                            '1000000-count-one': '¤00 लाख',
                            '1000000-count-other': '¤00 लाख',
                            '10000000-count-one': '¤0 कोटी',
                            '10000000-count-other': '¤0 कोटी',
                            '100000000-count-one': '¤00 कोटी',
                            '100000000-count-other': '¤00 कोटी',
                            '1000000000-count-one': '¤0 अब्ज',
                            '1000000000-count-other': '¤0 अब्ज',
                            '10000000000-count-one': '¤00 अब्ज',
                            '10000000000-count-other': '¤00 अब्ज',
                            '100000000000-count-one': '¤0 खर्व',
                            '100000000000-count-other': '¤0 खर्व',
                            '1000000000000-count-one': '¤00 खर्व',
                            '1000000000000-count-other': '¤00 खर्व',
                            '10000000000000-count-one': '¤0 पद्म',
                            '10000000000000-count-other': '¤0 पद्म',
                            '100000000000000-count-one': '¤00 पद्म',
                            '100000000000000-count-other': '¤00 पद्म'
                        }
                    },
                    'unitPattern-count-one': '{0} {1}',
                    'unitPattern-count-other': '{0} {1}'
                },
                'miscPatterns-numberSystem-deva': {
                    'approximately': '~{0}',
                    'atLeast': '{0}+',
                    'atMost': '≤{0}',
                    'range': '{0}–{1}'
                },
                'miscPatterns-numberSystem-latn': {
                    'approximately': '~{0}',
                    'atLeast': '{0}+',
                    'atMost': '≤{0}',
                    'range': '{0}–{1}'
                },
                'minimalPairs': {
                    'pluralMinimalPairs-count-one': '{0} घर',
                    'pluralMinimalPairs-count-other': '{0} घरे',
                    'few': '{0}थे उजवे वळण घ्या.',
                    'one': '{0}ले उजवे वळण घ्या.',
                    'other': '{0}वे उजवे वळण घ्या.',
                    'two': '{0}रे उजवे वळण घ्या.'
                }
            }
        }
    }
});
