import { AggregatedTest, FlakyTestsReport } from './types';

/**
 * A candidate that passed its quarantine rerun is genuinely flaky. One that failed every
 * attempt is far more likely a real regression, so the two are never summed into one number.
 */
function countConfirmed(report: FlakyTestsReport): number {
  return report.tests.filter((test) => test.flakyConfirmed > 0).length;
}

function buildStatus(report: FlakyTestsReport): string {
  if (!report.succeeded) {
    return `⚠️ collection failed: ${report.error ?? 'unknown error'}`;
  }
  if (report.tests.length === 0) {
    return `✅ no flaky candidates in ${report.windowHours}h`;
  }
  const confirmed = countConfirmed(report);
  const regressions = report.tests.length - confirmed;
  // Saying "0 flaky" while candidates failed every attempt reads like a clean window, when
  // in fact those are the likely regressions.
  const parts = [`${confirmed} flaky`];
  if (regressions > 0) {
    parts.push(`${regressions} failed every attempt`);
  }

  return `⚠️ ${parts.join(', ')} in ${report.windowHours}h (${report.totalCandidates} occurrence(s))`;
}

function formatList(values: string[]): string {
  return values.length > 0 ? values.join(', ') : '—';
}

const DETAILS_SUMMARY = '\u2022\u2022\u2022';

/** Run pages are addressed by id, which is the last segment of the run URL. */
function runLink(url: string): string {
  const id = url.split('/').pop() ?? url;
  return `[#${id}](${url})`;
}

function renderTest(test: AggregatedTest): string[] {
  return [
    ``,
    `#### \`${test.test}\``,
    ``,
    // Collapsed so a long candidate list stays scannable - the headings alone are the summary.
    `<details>`,
    `<summary>${DETAILS_SUMMARY}</summary>`,
    ``,
    `| Occurrences | Flaky | Failed all attempts | Distinct commits |`,
    `|---|---|---|---|`,
    `| ${test.occurrences} | ${test.flakyConfirmed} | ${test.failedAllAttempts} | ${test.distinctShas} |`,
    ``,
    `**First seen:** ${test.firstSeen} · **Last seen:** ${test.lastSeen}`,
    `**Jobs:** ${formatList(test.jobs)}`,
    `**Themes:** ${formatList(test.themes)}`,
    `**Platforms:** ${formatList(test.platforms)}`,
    // One link per run, not per occurrence: a single run can flag the same test in
    // several matrix jobs, so occurrences >= runs.
    `**Runs:**`,
    ``,
    ...test.runUrls.map((url) => `- ${runLink(url)}`),
    ``,
    `</details>`,
  ];
}

export function renderMarkdown(report: FlakyTestsReport): string {
  const parts = [
    `## Flaky Test Candidates`,
    ``,
    `**Status:** ${buildStatus(report)}`,
    `**Window:** ${report.windowHours}h (${report.from} → ${report.to})`,
    `**Runs Scanned:** ${report.runsScanned} (${report.runsWithCandidates} with candidates)`,
  ];

  if (report.runsUnreadable > 0) {
    parts.push(`**Runs Unreadable:** ${report.runsUnreadable}`);
  }
  if (report.truncated) {
    parts.push(`**Note:** the test list was capped — more tests flaked than listed.`);
  }

  if (report.tests.length > 0) {
    const confirmed = report.tests.filter((test) => test.flakyConfirmed > 0);
    if (confirmed.length > 0) {
      // The report exists to feed this file, so hand over something ready to paste. The shape
      // is the one `readQuarantinedTests` in e2e/testcafe-devextreme/runner.ts parses; `file`
      // is omitted so the entry matches the test in any fixture.
      const quarantine = JSON.stringify(
        { tests: confirmed.map((test) => ({ test: test.test })) },
        null,
        2,
      );

      parts.push(
        ``,
        `<details>`,
        `<summary>Suggested \`quarantine.json\` (${confirmed.length})</summary>`,
        ``,
        '```json',
        quarantine,
        '```',
        ``,
        `</details>`,
      );
    }

    parts.push(...report.tests.flatMap(renderTest));
  }

  return parts.join('\n');
}
