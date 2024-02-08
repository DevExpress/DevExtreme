import createTestCafe from 'testcafe';
import fs from 'fs';

function reporter() {
  return {
    noColors: false,
    startTime: null,
    afterErrorList: false,
    testCount: 0,
    skipped: 0,

    reportTaskStart(startTime, userAgents, testCount) {
      this.startTime = startTime;
      this.testCount = testCount;

      this.setIndent(1)
        .useWordWrap(true)
        .write(this.chalk.bold('Running tests in:'))
        .newline();

      userAgents.forEach((ua) => {
        this
          .write(`- ${this.chalk.blue(ua)}`)
          .newline();
      });
    },

    reportFixtureStart(name) {
      this.setIndent(1)
        .useWordWrap(true);

      if (this.afterErrorList) this.afterErrorList = false;
      else this.newline();

      this.write(name)
        .newline();
    },

    renderErrors(errs) {
      const filteredErrors = errs.filter((x) => {
        // eslint-disable-next-line spellcheck/spell-checker
        if (x && x.errMsg && x.errMsg.indexOf('INVALID_SCREENSHOT') !== -1) return false;
        return true;
      });
      if (!filteredErrors.length) return;

      this.setIndent(3)
        .newline();

      filteredErrors.forEach((err, index) => {
        const prefix = this.chalk.red(`${index + 1}) `);

        this.newline()
          .write(this.formatError(err, prefix))
          .newline()
          .newline();
      });
    },
    dateTimeNow() {
      const toString = ((value, count) => `${value}`.padStart(count, '0'));
      const now = new Date();
      const result = `${toString(now.getHours(), 2)}:${toString(now.getMinutes(), 2)}:${toString(now.getSeconds(), 2)}.${toString(now.getMilliseconds(), 3)}`;
      return result;
    },

    reportTestStart(name) {
      this
        .setIndent(1)
        .write(`[${this.dateTimeNow()}] start   ${name}`)
        .newline();
    },

    reportTestDone(name, testRunInfo) {
      const hasErr = !!testRunInfo.errs.length;
      let symbol = null;
      let nameStyle = null;

      if (testRunInfo.skipped) {
        this.skipped += 1;

        symbol = this.chalk.cyan('-');
        nameStyle = this.chalk.cyan;
      } else if (hasErr) {
        symbol = this.chalk.red.bold(this.symbols.err);
        nameStyle = this.chalk.red.bold;
      } else {
        symbol = this.chalk.green(this.symbols.ok);
        // eslint-disable-next-line spellcheck/spell-checker
        nameStyle = this.chalk.grey;
      }

      let doneMessage = 'done';
      if (testRunInfo.skipped) doneMessage = 'skip';
      if (hasErr) doneMessage = 'fail';

      let title = `[${this.dateTimeNow()}]  ${doneMessage} ${symbol} ${nameStyle(name)} [${testRunInfo.durationMs} ms]`;

      this.setIndent(1)
        .useWordWrap(true);

      if (testRunInfo.unstable) title += this.chalk.yellow(' (unstable)');

      this.write(title);

      if (hasErr) this.renderErrors(testRunInfo.errs);

      this.afterErrorList = hasErr;

      this.newline();
    },

    renderWarnings(warnings) {
      const filteredWarnings = warnings.filter((x) => x.indexOf('It has just been rewritten with a recent screenshot.') === -1);
      this.newline()
        .setIndent(1)
        .write(this.chalk.bold.yellow(`Warnings (${filteredWarnings.length}):`))
        .newline();

      filteredWarnings.forEach((message) => {
        this.setIndent(1)
          .write(this.chalk.bold.yellow('--'))
          .newline()
          .setIndent(2)
          .write(message)
          .newline();
      });
    },

    reportTaskDone(endTime, passed, warnings, result) {
      const durationMs = endTime - this.startTime;
      const durationStr = this.moment.duration(durationMs).format('h[h] mm[m] ss[s]');
      let footer = passed === this.testCount
        ? this.chalk.bold.green(`${this.testCount} passed`)
        : this.chalk.bold.red(`${this.testCount - passed}/${this.testCount} failed`);

      // eslint-disable-next-line spellcheck/spell-checker
      footer += this.chalk.grey(` (${durationStr})`);

      if (!this.afterErrorList) this.newline();

      this.setIndent(1)
        .useWordWrap(true);

      this.newline()
        .write(footer)
        .newline();

      if (this.skipped > 0) {
        this.write(this.chalk.cyan(`${this.skipped} skipped`))
          .newline();
      }

      if (warnings.length) this.renderWarnings(warnings);
    },
  };
}

function accessibilityTestCafeReporter() {
  return {
    violationsCount: {
      minor: 0,
      moderate: 0,
      serious: 0,
      critical: 0,
    },

    appendAxeViolationsCount(reportData, browsers) {
      if (!reportData) { return; }

      if (!Object.values(reportData).some((data) => data.length)) { return; }

      browsers.forEach(({ testRunId }) => {
        const browserReportData = reportData[testRunId];

        if (!browserReportData) { return; }

        browserReportData.forEach((data) => {
          Object.keys(data).forEach((violation) => {
            this.violationsCount[violation] += data[violation];
          });
        });
      });
    },

    reportFixtureStart() {},

    reportTaskStart() {},

    reportTestStart() {},

    reportTestDone(name, testRunInfo) {
      this.appendAxeViolationsCount(testRunInfo.reportData, testRunInfo.browsers);
    },

    reportTaskDone() {
      const {
        minor, moderate, serious, critical,
      } = this.violationsCount;
      const total = minor + minor + serious + critical;

      fs.writeFileSync(process.env.ACCESSIBILITY_TESTCAFE_REPORT_PATH || 'accessibility_report.txt', `Axe report: ${total} accessibility issues found (${critical} critical, ${serious} serious, ${moderate} moderate, and ${minor} minor)`);
    },
  };
}

async function main() {
  const tester = await createTestCafe();
  const runner = tester.createRunner();
  const concurrency = (process.env.CONCURRENCY && (+process.env.CONCURRENCY)) || 1;

  const reporters = [reporter]

  if (process.env.STRATEGY === 'accessibility') {
    reporters.push(accessibilityTestCafeReporter);
  }

  const failedCount = await runner
    .reporter(reporters)
    .browsers(process.env.BROWSERS || 'chrome:headless --disable-partial-raster --disable-skia-runtime-opts --run-all-compositor-stages-before-draw --disable-new-content-rendering-timeout --disable-threaded-animation --disable-threaded-scrolling --disable-checker-imaging --disable-image-animation-resync --use-gl="swiftshader" --disable-features=PaintHolding --js-flags=--random-seed=2147483647 --font-render-hinting=none --disable-font-subpixel-positioning')
    .concurrency(concurrency || 1)
    .run({ quarantineMode: !!process.env.TCQUARANTINE ? { successThreshold: 1, attemptLimit: 5 } : false });

  await tester.close();
  process.exit(failedCount);
}

main();
