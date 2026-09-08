import fs from 'node:fs';
import path from 'node:path';
import yargs from 'yargs';

import { renderMarkdown } from './markdown';
import { CollectOptions, buildFailedReport, collect } from './report';
import { FlakyTestsReport } from './types';

export interface CliArgs {
  repo: string;
  workflow: string;
  artifact: string;
  branch: string;
  windowHours: number;
  outJson: string;
  outMarkdown: string;
}

export function parseArgs(argv: string[]): CliArgs {
  // `pnpm run <script> -- --flag` forwards the separator itself, and yargs would then read
  // every option as a positional. Drop it so the tool parses the same however it is invoked.
  const args = argv[0] === '--' ? argv.slice(1) : argv;

  return (
    yargs(args)
      .strict()
      .version(false)
      .help(false)
      // Throw instead of calling process.exit, so a bad invocation is reported through the
      // single error path at the bottom of this file. The fail handler also stops yargs
      // dumping its usage to stderr, which that error path would then repeat.
      .exitProcess(false)
      .fail((message, error) => {
        throw error ?? new Error(message);
      })
      .option('repo', { type: 'string', demandOption: true, nargs: 1 })
      .option('workflow', { type: 'string', demandOption: true, nargs: 1 })
      .option('artifact', { type: 'string', demandOption: true, nargs: 1 })
      .option('branch', { type: 'string', demandOption: true, nargs: 1 })
      .option('window-hours', { type: 'number', demandOption: true, nargs: 1 })
      .option('out-json', { type: 'string', demandOption: true, nargs: 1 })
      .option('out-markdown', { type: 'string', demandOption: true, nargs: 1 })
      .parseSync()
  );
}

function write(outPath: string, contents: string, label: string): void {
  const resolved = path.resolve(outPath);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(resolved, contents);
  console.log(`${label} written to: ${resolved}`);
}

export async function runCli(argv: string[] = process.argv.slice(2)): Promise<FlakyTestsReport> {
  const args = parseArgs(argv);
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error('GITHUB_TOKEN is not set');
  }
  if (!Number.isFinite(args.windowHours) || args.windowHours <= 0) {
    throw new Error(`--window-hours must be a positive number, got: ${args.windowHours}`);
  }

  const options: CollectOptions = {
    repo: args.repo,
    workflow: args.workflow,
    artifact: args.artifact,
    branch: args.branch,
    windowHours: args.windowHours,
    token,
  };

  // Never fail for data reasons: a broken sweep still writes a report saying so, so the
  // repository check it feeds keeps running.
  let report: FlakyTestsReport;
  try {
    report = await collect(options);
  } catch (error) {
    console.error(`Collection failed: ${error instanceof Error ? error.message : String(error)}`);
    report = buildFailedReport(options, error);
  }

  write(args.outJson, `${JSON.stringify(report, null, 2)}\n`, 'Report');
  write(args.outMarkdown, `${renderMarkdown(report)}\n`, 'Markdown');
  console.log(
    `Found ${report.tests.length} flaky test(s) in ${report.runsWithCandidates} of ${report.runsScanned} scanned run(s)`
      + ` (${report.totalCandidates} occurrence(s)`
      + (report.runsUnreadable > 0 ? `, ${report.runsUnreadable} run(s) unreadable` : '')
      + (report.truncated ? ', list truncated' : '')
      + ')',
  );

  return report;
}

if (require.main === module) {
  runCli().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
