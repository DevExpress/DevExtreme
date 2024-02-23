import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import asyncForEach from '../../../utils/visual-tests/helpers/async-for-each';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('Common.EditorAppearanceVariants')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t.resizeWindow(900, 800);
  });

runManualTest('Common', 'EditorAppearanceVariants', ['React', 'Vue', 'Angular', 'jQuery'], (test) => {
  test('EditorAppearanceVariants', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const SELECTBOX_CLASS = 'dx-selectbox';
    const stylingModes = ['outlined', 'filled', 'underlined'];
    const labelModes = ['static', 'floating', 'hidden', 'outside'];

    const clickSaveButton = async () => {
      await t.click($('#validate'));
    };

    const changeLabelMode = async (labelMode) => {
      await t.click($(`.${SELECTBOX_CLASS}`).nth(1));
      await t.click($('.dx-item').withText(labelMode));
    };

    const changeStylingMode = async (stylingMode) => {
      await t.click($(`.${SELECTBOX_CLASS}`).nth(0));
      await t.click($('.dx-item').withText(stylingMode)).wait(500);
    };

    await asyncForEach(stylingModes, async (stylingMode) => {
      await asyncForEach(labelModes, async (labelMode) => {
        await changeStylingMode(stylingMode);
        await changeLabelMode(labelMode);
        await clickSaveButton();
        await testScreenshot(t, takeScreenshot, `common_editor_appearance_variants_${stylingMode}_${labelMode}_desktop.png`);
      });
    });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
