import mustache from 'mustache';
import path from 'path';
import {
  writeFileSync,
  readFileSync,
  mkdirSync,
  existsSync,
} from 'fs';

const reportDir = './testing/artifacts/axe-reports';
const template = readFileSync(path.join(__dirname, 'template.md'), { encoding: 'utf8' });

function replaceBase64(html) {
  return html.replace(/data:image\/png;base64.+"/, '..."');
}

function simplifyResults(r) {
  return r.violations.map(({
    id, impact, tags, description, helpUrl, nodes,
  }) => ({
    id,
    impact,
    tags,
    description,
    helpUrl,
    nodes: nodes.map(({ html, target, failureSummary }) => ({
      html: replaceBase64(html),
      target,
      failureSummary,
    })),
  }));
}

export function createMdReport({ testName, results }) {
  // eslint-disable-next-line max-len
  const mdString = mustache.render(template, { testName, results: simplifyResults(results) });

  if (!existsSync(reportDir)) {
    mkdirSync(reportDir, { recursive: true });
  }

  writeFileSync(path.join(reportDir, `${testName}.md`), mdString);
}

export function createTestCafeReport(violations) {
  return violations.reduce((acc, violation) => {
    acc[violation.impact] += 1;
    return acc;
  }, {
    minor: 0,
    moderate: 0,
    serious: 0,
    critical: 0,
  });
}
