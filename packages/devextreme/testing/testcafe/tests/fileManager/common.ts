import { Selector } from 'testcafe';
import { isFluent, isMaterial } from '../../helpers/themeUtils';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';

fixture`FileManager`
  .page(url(__dirname, '../container.html'));

test('Custom DropDown width for Material and Fluent themes', async (t) => {
  const viewModeButton = Selector('.dx-filemanager-toolbar-viewmode-item');

  await t
    .click(viewModeButton);

  const popupContainer = Selector('.dx-filemanager-view-switcher-popup .dx-overlay-content');
  let expectedWidth;

  if (isFluent()) {
    expectedWidth = 40;
  } else if (isMaterial()) {
    expectedWidth = 36;
  } else {
    expectedWidth = 34;
  }

  await t
    .expect(popupContainer.clientWidth)
    .eql(expectedWidth);
}).before(async () => createWidget('dxFileManager', {
  name: 'fileManager',
  fileSystemProvider: [],
  height: 450,
}));
