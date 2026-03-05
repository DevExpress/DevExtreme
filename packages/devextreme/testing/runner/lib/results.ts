/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  RunnerLogColor,
  TestCaseIssue,
  TestCaseResult,
  TestResultItem,
  TestResultsPayload,
  TestSuiteResult,
} from './types';

interface ResultsReporterDeps {
  escapeXmlAttr: (value: string | number | boolean | null) => string;
  escapeXmlText: (value: string | number | boolean | null) => string;
  normalizeNumber: (value: unknown) => number;
}

export interface ResultsReporter {
  parseResultsJson: (json: string) => TestResultsPayload;
  printTextReport: (
    results: TestResultsPayload,
    writeLine: (message?: string, color?: RunnerLogColor) => void,
  ) => void;
  testResultsToXml: (results: TestResultsPayload) => string;
  validateResultsJson: (json: string) => void;
}

interface UnknownRecord {
  [key: string]: unknown;
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toStringValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return '';
}

function isSuiteResultItem(item: TestResultItem): item is TestSuiteResult {
  return 'results' in item;
}

function enumerateAllCases(
  suite: TestSuiteResult,
  callback: (testCase: TestCaseResult) => void,
): void {
  suite.results.forEach((item) => {
    if (isSuiteResultItem(item)) {
      enumerateAllCases(item, callback);
      return;
    }

    callback(item);
  });
}

function normalizeIssue(value: unknown): TestCaseIssue | null {
  if (!isRecord(value)) {
    return null;
  }

  if (typeof value.message !== 'string') {
    return null;
  }

  return {
    message: value.message,
  };
}

function normalizeCase(
  value: unknown,
  normalizeNumber: (value: unknown) => number,
): TestCaseResult {
  const record = isRecord(value) ? value : {};

  return {
    name: toStringValue(record.name),
    url: toStringValue(record.url),
    time: normalizeNumber(record.time),
    executed: record.executed !== false,
    failure: normalizeIssue(record.failure),
    reason: normalizeIssue(record.reason),
  };
}

function normalizeResultItem(
  value: unknown,
  normalizeNumber: (value: unknown) => number,
): TestResultItem {
  if (isRecord(value) && Array.isArray(value.results)) {
    return normalizeSuite(value, normalizeNumber);
  }

  return normalizeCase(value, normalizeNumber);
}

function normalizeSuite(
  value: unknown,
  normalizeNumber: (value: unknown) => number,
): TestSuiteResult {
  const record = isRecord(value) ? value : {};
  const rawResults = Array.isArray(record.results) ? record.results : [];

  return {
    name: toStringValue(record.name),
    time: normalizeNumber(record.time),
    pureTime: normalizeNumber(record.pureTime),
    results: rawResults.map((item) => normalizeResultItem(item, normalizeNumber)),
  };
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

  function parseResultsJson(json: string): TestResultsPayload {
    const parsed = JSON.parse(json) as unknown;

    if (!isRecord(parsed)) {
      throw new Error('Invalid results payload: expected JSON object.');
    }

    const rawSuites = Array.isArray(parsed.suites) ? parsed.suites : [];

    return {
      name: toStringValue(parsed.name),
      total: normalizeNumber(parsed.total),
      failures: normalizeNumber(parsed.failures),
      suites: rawSuites.map((item) => normalizeSuite(item, normalizeNumber)),
    };
  }

  function printTextReport(
    results: TestResultsPayload,
    writeLine: (message?: string, color?: RunnerLogColor) => void,
  ): void {
    const maxWrittenFailures = 50;
    const notRunCases: TestCaseResult[] = [];
    const failedCases: TestCaseResult[] = [];

    results.suites.forEach((suite) => {
      enumerateAllCases(suite, (testCase) => {
        if (testCase.reason !== null) {
          notRunCases.push(testCase);
        }
        if (testCase.failure !== null) {
          failedCases.push(testCase);
        }
      });
    });

    const { total, failures } = results;
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
        writeLine(`Skipped: ${testCase.name}`);
        writeLine(`Reason: ${testCase.reason?.message ?? ''}`);
      });
    }

    if (failures > 0) {
      let writtenFailures = 0;

      failedCases.forEach((testCase) => {
        if (writtenFailures >= maxWrittenFailures) {
          return;
        }

        writeLine('-'.repeat(80));
        writeLine(testCase.name, 'white');
        writeLine();
        writeLine(testCase.failure?.message ?? '');

        writtenFailures += 1;
      });

      if (writtenFailures >= maxWrittenFailures) {
        writeLine(`WARNING: only first ${maxWrittenFailures} failures are shown.`);
      }
    }
  }

  function renderCaseXml(testCase: TestCaseResult, indent: string): string {
    const timeValue = testCase.time === 0 ? '' : testCase.time;
    const attributes = [
      `name="${escapeXmlAttr(testCase.name)}"`,
      `url="${escapeXmlAttr(testCase.url)}"`,
      `time="${escapeXmlAttr(timeValue)}"`,
    ];

    if (!testCase.executed) {
      attributes.push('executed="false"');
    }

    const hasFailure = testCase.failure !== null;
    const hasReason = testCase.reason !== null;

    if (!hasFailure && !hasReason) {
      return `${indent}<test-case ${attributes.join(' ')} />`;
    }

    const lines = [`${indent}<test-case ${attributes.join(' ')}>`];

    if (hasFailure) {
      lines.push(`${indent}  <failure>`);
      lines.push(
        `${indent}    <message>${escapeXmlText(testCase.failure?.message ?? '')}</message>`,
      );
      lines.push(`${indent}  </failure>`);
    }

    if (hasReason) {
      lines.push(`${indent}  <reason>`);
      lines.push(
        `${indent}    <message>${escapeXmlText(testCase.reason?.message ?? '')}</message>`,
      );
      lines.push(`${indent}  </reason>`);
    }

    lines.push(`${indent}</test-case>`);

    return lines.join('\n');
  }

  function renderSuiteXml(suite: TestSuiteResult, indent: string): string {
    const lines: string[] = [];

    lines.push(
      `${indent}<test-suite name="${escapeXmlAttr(suite.name)}" time="${normalizeNumber(suite.time)}" pure-time="${normalizeNumber(suite.pureTime)}">`,
    );
    lines.push(`${indent}  <results>`);

    suite.results.forEach((item) => {
      if (isSuiteResultItem(item)) {
        lines.push(renderSuiteXml(item, `${indent}    `));
      } else {
        lines.push(renderCaseXml(item, `${indent}    `));
      }
    });

    lines.push(`${indent}  </results>`);
    lines.push(`${indent}</test-suite>`);

    return lines.join('\n');
  }

  function testResultsToXml(results: TestResultsPayload): string {
    const lines: string[] = [];

    lines.push(
      `<test-results name="${escapeXmlAttr(results.name)}" total="${results.total}" failures="${results.failures}">`,
    );

    results.suites.forEach((suite) => {
      lines.push(renderSuiteXml(suite, '  '));
    });

    lines.push('</test-results>');

    return `${lines.join('\n')}\n`;
  }

  return {
    parseResultsJson,
    printTextReport,
    testResultsToXml,
    validateResultsJson,
  };
}
