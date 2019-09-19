import sharedTests from "./sharedParts/localization.shared.js";

import localization from "localization";
import { logger } from "core/utils/console";

QUnit.module("base localization", {}, () => {
    sharedTests();

    QUnit.test("'no parser' errors", function(assert) {
        const warningIdPrefixLength = 8;
        const dateWarning = "Date parsing is invoked while the parser is not defined";
        const originalLoggerWarn = logger.warn;
        const warnLog = [];

        logger.warn = (text) => {
            warnLog.push(text);
        };

        try {
            localization.parseDate("01", { day: 'numeric' });

            assert.equal(warnLog.length, 1);
            assert.equal(warnLog[0].substr(warningIdPrefixLength, dateWarning.length), dateWarning);
        } finally {
            logger.warn = originalLoggerWarn;
        }
    });
});
