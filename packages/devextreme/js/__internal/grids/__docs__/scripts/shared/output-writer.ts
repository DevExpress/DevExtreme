import * as fs from 'fs';
import * as path from 'path';

import { parseArgs } from './cli';

/**
 * Writes architecture output files (JSON and/or HTML) to `outputDir`.
 *
 * Respects CLI flags `--json` (JSON only) and `--html` (HTML only).
 * When neither flag is set, both files are written.
 */
export function writeOutputFiles<T extends object>(
  outputDir: string,
  baseName: string,
  data: T,
  generateHtml: (d: T) => string,
): void {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const args = parseArgs();

  if (!args.htmlOnly) {
    const jsonPath = path.join(outputDir, `${baseName}.generated.json`);
    fs.writeFileSync(jsonPath, `${JSON.stringify(data, null, 2)}\n`);
    // eslint-disable-next-line no-console
    console.log(`✓ JSON written to: ${jsonPath}`);
  }

  if (!args.jsonOnly) {
    const htmlPath = path.join(outputDir, `${baseName}.generated.html`);
    fs.writeFileSync(htmlPath, generateHtml(data));
    // eslint-disable-next-line no-console
    console.log(`✓ HTML written to: ${htmlPath}`);
  }
}
