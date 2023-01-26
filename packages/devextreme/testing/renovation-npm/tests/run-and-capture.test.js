import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';

fixture`Run and Capture`
    .page('http://localhost:3000');

test('Sample app renders correctly', async(t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.resizeWindow(1000, 800);
    await takeScreenshot(`shot-${process.env.framework}.png`);

    await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
});
