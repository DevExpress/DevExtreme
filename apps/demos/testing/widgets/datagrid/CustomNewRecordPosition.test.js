import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DataGrid.CustomNewRecordPosition')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

const newRowPositionOptions = ['first', 'last', 'pageTop', 'pageBottom', 'viewportTop', 'viewportBottom'];

const setNewRowPosition = async (t, newRowPosition) => {
  const index = newRowPositionOptions.indexOf(newRowPosition);
  await t.click('#newRowPositionSelectBox');
  await t.click(Selector('.dx-dropdownlist-popup-wrapper .dx-list-item').nth(index));
};

const clickAddButton = async (t) => {
  await t.click('.dx-datagrid-addrow-button');
};

const clickCancelButton = async (t) => {
  await t.click('.dx-command-edit .dx-link-cancel');
};

const selectPage = async (t, number) => {
  await t.click(Selector('.dx-page').withText(`${number}`));
};

const newRowPositionTestTemplate = ({ newRowPosition, pageNumber }) => async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await selectPage(t, pageNumber);
  await setNewRowPosition(t, newRowPosition);
  await clickAddButton(t);

  await testScreenshot(t, takeScreenshot, `datagrid_CustomNewRecordPosition_${newRowPosition}_added.png`);

  await clickCancelButton(t);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
};

runManualTest('DataGrid', 'CustomNewRecordPosition', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  newRowPositionOptions.forEach((newRowPosition) => {
    test(`newRowPosition - ${newRowPosition}`, newRowPositionTestTemplate({
      newRowPosition,
      pageNumber: 1,
    }));
  });

  ['first', 'last'].forEach((newRowPosition) => {
    test(`newRowPosition - ${newRowPosition} - last page`, newRowPositionTestTemplate({
      newRowPosition,
      pageNumber: 42,
    }));
  });

  test('insertAfterKey', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await selectPage(t, 1);

    await t
      .click('.dx-command-edit .dx-link.dx-icon-add');

    await testScreenshot(t, takeScreenshot, 'datagrid_CustomNewRecordPosition_insertAfterKey_clicked.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
