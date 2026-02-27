/* eslint-disable no-console */
const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

const reportFile = join(__dirname, '..', '..', 'csp-reports', 'csp-violations.jsonl');

if (!existsSync(reportFile)) {
  console.log('No CSP violations report found.');
  console.log(`Expected at: ${reportFile}`);
  console.log('Run tests with CSP_REPORT=true to generate a report.');
  process.exit(0);
}

const lines = readFileSync(reportFile, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

if (lines.length === 0) {
  console.log('✅ No CSP violations detected!');
  process.exit(0);
}

console.log(`\n⚠️  CSP Violations Report: ${lines.length} violation(s) found\n`);
console.log('='.repeat(80));

const byDirective = {};
for (const v of lines) {
  const key = v.violatedDirective || v.effectiveDirective || 'unknown';
  if (!byDirective[key]) {
    byDirective[key] = [];
  }
  byDirective[key].push(v);
}

for (const [directive, violations] of Object.entries(byDirective)) {
  console.log(`\n📋 ${directive} (${violations.length} violation(s)):`);
  console.log('-'.repeat(60));

  const uniqueViolations = new Map();
  for (const v of violations) {
    const key = `${v.blockedURI}|${v.sourceFile}|${v.lineNumber}`;
    if (!uniqueViolations.has(key)) {
      uniqueViolations.set(key, { ...v, count: 1, tests: [v.test] });
    } else {
      const existing = uniqueViolations.get(key);
      existing.count += 1;
      if (!existing.tests.includes(v.test)) {
        existing.tests.push(v.test);
      }
    }
  }

  for (const [, v] of uniqueViolations) {
    console.log(`  blocked: ${v.blockedURI || 'N/A'}`);
    console.log(`  source:  ${v.sourceFile || 'N/A'}:${v.lineNumber || '?'}`);
    console.log(`  count:   ${v.count} occurrence(s) in ${v.tests.length} test(s)`);
    if (v.tests.length <= 5) {
      console.log(`  tests:   ${v.tests.join(', ')}`);
    } else {
      console.log(`  tests:   ${v.tests.slice(0, 5).join(', ')} ... and ${v.tests.length - 5} more`);
    }
    console.log();
  }
}

const byFramework = {};
for (const v of lines) {
  const fw = v.framework || 'unknown';
  byFramework[fw] = (byFramework[fw] || 0) + 1;
}

console.log('='.repeat(80));
console.log('\n📊 Summary by framework:');
for (const [fw, count] of Object.entries(byFramework)) {
  console.log(`  ${fw}: ${count} violation(s)`);
}
console.log(`\n  Total: ${lines.length} violation(s)\n`);
