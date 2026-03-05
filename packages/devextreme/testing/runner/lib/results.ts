/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  RunnerLogColor,
  TestCaseResult,
  TestResultItem,
  TestResultsPayload,
  TestSuiteResult,
} from './types';

interface ResultsReporterDeps {
  escapeXmlAttr: (value: unknown) => string;
  escapeXmlText: (value: unknown) => string;
  normalizeNumber: (value: unknown) => number;
}

export interface ResultsReporter {
  printTextReport: (
    results: TestResultsPayload,
    writeLine: (message?: string, color?: RunnerLogColor) => void,
  ) => void;
  testResultsToXml: (results: TestResultsPayload) => string;
  validateResultsJson: (json: string) => void;
}

export function createResultsReporter({
  escapeXmlAttr,
  escapeXmlText,
  normalizeNumber,
}: ResultsReporterDeps): ResultsReporter {
  function validateResultsJson(json: string): void {
    const badToken = '\\u0000';
    const badIndex = json.indexOf(badToken);

    if (badIndex > -1) {
      const from = Math.max(0, badIndex - 200);
      const to = Math.min(json.length, badIndex + 200);
      throw new Error(`Result JSON has bad content: ${json.slice(from, to)}`);
    }
  }

  function printTextReport(
    results: TestResultsPayload,
    writeLine: (message?: string, color?: RunnerLogColor) => void,
  ): void {
    const maxWrittenFailures = 50;
    const notRunCases: TestCaseResult[] = [];
    const failedCases: TestCaseResult[] = [];

    (results.suites || []).forEach((suite) => {
      enumerateAllCases(suite, (testCase) => {
        if (testCase.reason) {
          notRunCases.push(testCase);
        }
        if (testCase.failure) {
          failedCases.push(testCase);
        }
      });
    });

    const total = Number(results.total) || 0;
    const failures = Number(results.failures) || 0;
    const notRunCount = notRunCases.length;
    let color: RunnerLogColor = 'green';
    if (failures > 0) {
      color = 'red';
    } else if (notRunCount > 0) {
      color = 'yellow';
    }

    writeLine(`Tests run: ${total}, Failures: ${failures}, Not run: ${notRunCount}`, color);

    if (notRunCount > 0 && failures === 0) {
      notRunCases.forEach((testCase) => {
        writeLine('-'.repeat(80));
        writeLine(`Skipped: ${testCase.name || ''}`);
        writeLine(`Reason: ${testCase.reason?.message || ''}`);
      });
    }

    if (failures > 0) {
      let writtenFailures = 0;

      failedCases.forEach((testCase) => {
        if (writtenFailures >= maxWrittenFailures) {
          return;
        }

        writeLine('-'.repeat(80));
        writeLine(testCase.name || '', 'white');
        writeLine();
        writeLine(testCase.failure?.message || '');

        writtenFailures += 1;
      });

      if (writtenFailures >= maxWrittenFailures) {
        writeLine(`WARNING: only first ${maxWrittenFailures} failures are shown.`);
      }
    }
  }

  function testResultsToXml(results: TestResultsPayload): string {
    const lines: string[] = [];

    lines.push(`<test-results name="${escapeXmlAttr(results.name || '')}" total="${Number(results.total) || 0}" failures="${Number(results.failures) || 0}">`);

    (results.suites || []).forEach((suite) => {
      lines.push(renderSuiteXml(suite, '  '));
    });

    lines.push('</test-results>');

    return `${lines.join('\n')}\n`;
  }

  function renderSuiteXml(suite: TestSuiteResult, indent: string): string {
    const lines: string[] = [];

    lines.push(`${indent}<test-suite name="${escapeXmlAttr(suite.name || '')}" time="${normalizeNumber(suite.time)}" pure-time="${normalizeNumber(suite.pureTime)}">`);
    lines.push(`${indent}  <results>`);

    (suite.results || []).forEach((item) => {
      if (isSuiteResultItem(item)) {
        lines.push(renderSuiteXml(item, `${indent}    `));
      } else {
        lines.push(renderCaseXml(item || {}, `${indent}    `));
      }
    });

    lines.push(`${indent}  </results>`);
    lines.push(`${indent}</test-suite>`);

    return lines.join('\n');
  }

  function renderCaseXml(testCase: TestCaseResult, indent: string): string {
    const attributes = [
      `name="${escapeXmlAttr(testCase.name || '')}"`,
      `url="${escapeXmlAttr(testCase.url || '')}"`,
      `time="${escapeXmlAttr(testCase.time || '')}"`,
    ];

    if (testCase.executed === false) {
      attributes.push('executed="false"');
    }

    const hasFailure = typeof testCase.failure?.message === 'string';
    const hasReason = typeof testCase.reason?.message === 'string';

    if (!hasFailure && !hasReason) {
      return `${indent}<test-case ${attributes.join(' ')} />`;
    }

    const lines = [`${indent}<test-case ${attributes.join(' ')}>`];

    if (hasFailure) {
      lines.push(`${indent}  <failure>`);
      lines.push(`${indent}    <message>${escapeXmlText(testCase.failure?.message || '')}</message>`);
      lines.push(`${indent}  </failure>`);
    }

    if (hasReason) {
      lines.push(`${indent}  <reason>`);
      lines.push(`${indent}    <message>${escapeXmlText(testCase.reason?.message || '')}</message>`);
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

function enumerateAllCases(
  suite: TestSuiteResult,
  callback: (testCase: TestCaseResult) => void,
): void {
  (suite.results || []).forEach((item) => {
    if (isSuiteResultItem(item)) {
      enumerateAllCases(item, callback);
      return;
    }

    callback(item || {});
  });
}

function isSuiteResultItem(item: TestResultItem): item is TestSuiteResult {
  return Array.isArray((item as TestSuiteResult).results);
}
