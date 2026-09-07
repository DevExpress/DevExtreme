import url from '../../helpers/getPageUrl';

// TEMPORARY - verifies the flaky-candidate reporting pipeline end to end. Delete once verified.
//
// Regular matrix job: always fails. It is the only failing test in its shard, so the runner
// treats it as flaky, writes the flaky report, and the job still exits green.
// Quarantine job: always passes, so the rerun records `verdict: "passed"` in
// flaky-candidates.json - the artifact the collector aggregates.
fixture`Simulated flake`
  .page(url(__dirname, '../container.html'));

test('simulated flake for CI verification', async () => {
  if (process.env.GITHUB_JOB !== 'testcafe-quarantine') {
    throw new Error('Simulated flake: failing outside the quarantine job on purpose.');
  }
});
