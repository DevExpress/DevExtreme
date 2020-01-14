import sharedTests from './sharedParts/localization.shared.js';

import localization from 'localization';
import { logger } from 'core/utils/console';

QUnit.module('Base localization', function() {

    sharedTests();

    QUnit.test('\'no parser\' errors', function(assert) {
        const numberFormatter = function(value) {
            return '1';
        };
        const dateFormatter = function(value) {
            return new Date(0, 0, 1);
        };
        const warningIdPrefixLength = 8;
        const numberWarning = 'Number parsing is invoked while the parser is not defined';
        const dateWarning = 'Date parsing is invoked while the parser is not defined';
        const originalLoggerWarn = logger.warn;
        const warnLog = [];

        logger.warn = function(text) {
            warnLog.push(text);
        };

        try {
            localization.parseNumber('01', numberFormatter);
            localization.parseNumber('01', { formatter: numberFormatter });
            localization.parseDate('01', dateFormatter);
            localization.parseDate('01', { formatter: dateFormatter });
            localization.parseDate('01', { day: 'numeric' });
            localization.parseNumber('01');
            localization.parseDate('01');

            assert.equal(warnLog.length, 5);

            assert.equal(warnLog[0].substr(warningIdPrefixLength, numberWarning.length), numberWarning);
            assert.equal(warnLog[1].substr(warningIdPrefixLength, numberWarning.length), numberWarning);
            assert.equal(warnLog[2].substr(warningIdPrefixLength, dateWarning.length), dateWarning);
            assert.equal(warnLog[3].substr(warningIdPrefixLength, dateWarning.length), dateWarning);
            assert.equal(warnLog[4].substr(warningIdPrefixLength, dateWarning.length), dateWarning);
        } finally {
            logger.warn = originalLoggerWarn;
        }
    });
});
