import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';

const setRtl = ClientFunction(() => (window as any).setRtlMode());

fixture`Drop Down Button (material)`
  .page(url(__dirname, './pages/dropDownButtonMaterial.html'));

['ltr', 'rtl'].forEach((mode) => {
  test(`DropDownButton renders correctly in Material theme (${mode})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    if (mode === 'rtl') {
      await setRtl();
    }

    for (let i = 1; i <= 4; i += 1) {
      await t.hover(`#drop-down-button${i} .dx-button:first-child`);

      await t
        .expect(await takeScreenshot(`dropdownbutton-material-${mode}-${i}.png`, '#screen'))
        .ok();
    }

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
