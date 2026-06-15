import { appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { Page } from '@playwright/test';

import { DEMOS_ROOT } from './common-screenshots-utils';

const cspReportDir = join(DEMOS_ROOT, 'csp-reports');
const cspReportFile = join(cspReportDir, 'csp-violations.jsonl');

interface CspViolation {
  blockedURI: string;
  violatedDirective: string;
  effectiveDirective: string;
  originalPolicy: string;
  sourceFile: string;
  lineNumber: number;
  columnNumber: number;
  documentURI: string;
  disposition: string;
  timestamp: string;
}

export function collectCspViolations(page: Page): Promise<CspViolation[]> {
  return page.evaluate(
    () => ((window as typeof window & { __cspViolations?: CspViolation[] }).__cspViolations || []),
  );
}

export function writeCspReport(testName: string, framework: string, violations: CspViolation[]): void {
  if (!violations.length) {
    return;
  }

  if (!existsSync(cspReportDir)) {
    mkdirSync(cspReportDir, { recursive: true });
  }

  for (const v of violations) {
    const entry = { test: testName, framework, ...v };
    appendFileSync(cspReportFile, `${JSON.stringify(entry)}\n`);
  }
}
