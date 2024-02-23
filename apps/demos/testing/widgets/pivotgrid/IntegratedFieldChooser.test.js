import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const PIVOTGRID_FIELD_CHOOSER_BUTTON = 'dx-pivotgrid-field-chooser-button';
const TREEVIEW_SEARCH_FIELD = 'dx-treeview-search';
const TEXTEDITOR_INPUT = 'dx-texteditor-input';
const FIELD_CHOOSER_CONTENT = 'dx-popup-normal';

fixture('PivotGrid.IntegratedFieldChooser')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 800);
  });

runManualTest('PivotGrid', 'IntegratedFieldChooser', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('IntegratedFieldChooser', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.wait(500);
    await t.click(Selector(`.${PIVOTGRID_FIELD_CHOOSER_BUTTON}`));

    await testScreenshot(t, takeScreenshot, 'Integrated field chooser.png', `.${FIELD_CHOOSER_CONTENT}`);

    const textEditorInput = Selector(`.${TREEVIEW_SEARCH_FIELD} .${TEXTEDITOR_INPUT}`);
    await t
      .typeText(textEditorInput, 'Product M');

    await testScreenshot(t, takeScreenshot, 'Integrated field chooser after search of hierarchy field.png', `.${FIELD_CHOOSER_CONTENT}`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
