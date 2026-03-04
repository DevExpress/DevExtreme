function createResultsReporter({
    escapeXmlAttr,
    escapeXmlText,
    normalizeNumber,
}) {
    function validateResultsJson(json) {
        const badToken = '\\u0000';
        const badIndex = json.indexOf(badToken);

        if(badIndex > -1) {
            const from = Math.max(0, badIndex - 200);
            const to = Math.min(json.length, badIndex + 200);
            throw new Error(`Result JSON has bad content: ${json.slice(from, to)}`);
        }
    }

    function printTextReport(results, writeLine) {
        const maxWrittenFailures = 50;
        const notRunCases = [];
        const failedCases = [];

        (results.suites || []).forEach((suite) => {
            enumerateAllCases(suite, (testCase) => {
                if(testCase && testCase.reason) {
                    notRunCases.push(testCase);
                }
                if(testCase && testCase.failure) {
                    failedCases.push(testCase);
                }
            });
        });

        const total = Number(results.total) || 0;
        const failures = Number(results.failures) || 0;
        const notRunCount = notRunCases.length;
        const color = failures > 0 ? 'red' : (notRunCount > 0 ? 'yellow' : 'green');

        writeLine(`Tests run: ${total}, Failures: ${failures}, Not run: ${notRunCount}`, color);

        if(notRunCount > 0 && failures === 0) {
            notRunCases.forEach((testCase) => {
                writeLine('-'.repeat(80));
                writeLine(`Skipped: ${testCase.name || ''}`);
                writeLine(`Reason: ${testCase.reason && testCase.reason.message ? testCase.reason.message : ''}`);
            });
        }

        if(failures > 0) {
            let writtenFailures = 0;

            failedCases.forEach((testCase) => {
                if(writtenFailures >= maxWrittenFailures) {
                    return;
                }

                writeLine('-'.repeat(80));
                writeLine(testCase.name || '', 'white');
                writeLine();
                writeLine(testCase.failure && testCase.failure.message ? testCase.failure.message : '');

                writtenFailures += 1;
            });

            if(writtenFailures >= maxWrittenFailures) {
                writeLine(`WARNING: only first ${maxWrittenFailures} failures are shown.`);
            }
        }
    }

    function testResultsToXml(results) {
        const lines = [];

        lines.push(`<test-results name="${escapeXmlAttr(results.name || '')}" total="${Number(results.total) || 0}" failures="${Number(results.failures) || 0}">`);

        (results.suites || []).forEach((suite) => {
            lines.push(renderSuiteXml(suite, '  '));
        });

        lines.push('</test-results>');

        return `${lines.join('\n')}\n`;
    }

    function renderSuiteXml(suite, indent) {
        const lines = [];

        lines.push(`${indent}<test-suite name="${escapeXmlAttr(suite.name || '')}" time="${normalizeNumber(suite.time)}" pure-time="${normalizeNumber(suite.pureTime)}">`);
        lines.push(`${indent}  <results>`);

        (suite.results || []).forEach((item) => {
            if(item && Array.isArray(item.results)) {
                lines.push(renderSuiteXml(item, `${indent}    `));
            } else {
                lines.push(renderCaseXml(item || {}, `${indent}    `));
            }
        });

        lines.push(`${indent}  </results>`);
        lines.push(`${indent}</test-suite>`);

        return lines.join('\n');
    }

    function renderCaseXml(testCase, indent) {
        const attributes = [
            `name="${escapeXmlAttr(testCase.name || '')}"`,
            `url="${escapeXmlAttr(testCase.url || '')}"`,
            `time="${escapeXmlAttr(testCase.time || '')}"`,
        ];

        if(testCase.executed === false) {
            attributes.push('executed="false"');
        }

        const hasFailure = Boolean(testCase.failure && typeof testCase.failure.message === 'string');
        const hasReason = Boolean(testCase.reason && typeof testCase.reason.message === 'string');

        if(!hasFailure && !hasReason) {
            return `${indent}<test-case ${attributes.join(' ')} />`;
        }

        const lines = [`${indent}<test-case ${attributes.join(' ')}>`];

        if(hasFailure) {
            lines.push(`${indent}  <failure>`);
            lines.push(`${indent}    <message>${escapeXmlText(testCase.failure.message)}</message>`);
            lines.push(`${indent}  </failure>`);
        }

        if(hasReason) {
            lines.push(`${indent}  <reason>`);
            lines.push(`${indent}    <message>${escapeXmlText(testCase.reason.message)}</message>`);
            lines.push(`${indent}  </reason>`);
        }

        lines.push(`${indent}</test-case>`);

        return lines.join('\n');
    }

    return {
        printTextReport,
        testResultsToXml,
        validateResultsJson,
    };
}

function enumerateAllCases(suite, callback) {
    (suite.results || []).forEach((item) => {
        if(item && Array.isArray(item.results)) {
            enumerateAllCases(item, callback);
            return;
        }

        callback(item);
    });
}

module.exports = {
    createResultsReporter,
};
