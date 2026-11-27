import createTestCafe from 'testcafe';

const LAUNCH_RETRY_ATTEMPTS = 3;
const LAUNCH_RETRY_TIMEOUT = 10000;

const wait = async (
  timeout: number,
): Promise<void> => new Promise((resolve) => setTimeout(resolve, timeout));

const retry = async <T>(action: () => Promise<T>, attempt: number): Promise<T> => {
  try {
    return await action();
  } catch (error) {
    if (attempt <= 1) {
      throw error;
    }

    console.log('\n > error occurred during testcafe launch!\n');
    console.error(error);
    console.info(`\n > waiting ${LAUNCH_RETRY_TIMEOUT / 1000} seconds...\n`);
    await wait(LAUNCH_RETRY_TIMEOUT);
    console.info('\n > retry launching testcafe\n');

    return retry(action, attempt - 1);
  }
};

async function main() {
  const tester = await createTestCafe({});
  const runner = tester.createRunner();
  const concurrency = (process.env.CONCURRENCY && (+process.env.CONCURRENCY)) || 1;

  const failedCount = await retry(() => runner
    .reporter(['spec-time'])
    .browsers(process.env.BROWSERS || 'chrome --no-sandbox --disable-dev-shm-usage --disable-partial-raster --disable-skia-runtime-opts --run-all-compositor-stages-before-draw --disable-new-content-rendering-timeout --disable-threaded-animation --disable-threaded-scrolling --disable-checker-imaging --disable-image-animation-resync --use-gl=swiftshader --disable-features=PaintHolding --js-flags=--random-seed=2147483647 --font-render-hinting=none --disable-font-subpixel-positioning')
    .concurrency(concurrency || 1)
    .run({
      quarantineMode: { successThreshold: 1, attemptLimit: 3 },
    }), LAUNCH_RETRY_ATTEMPTS);

  await tester.close();
  process.exit(failedCount);
}

main();
