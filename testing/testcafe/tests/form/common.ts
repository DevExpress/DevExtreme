import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot, isMaterial } from '../../helpers/themeUtils';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import { appendElementTo, insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../helpers/domUtils';

fixture.disablePageReloads`Form`
  .page(url(__dirname, '../containerQuill.html'));

test('Color of the mark (T882067)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const screenshotName = 'Form color of the mark.png';

  await testScreenshot(t, takeScreenshot, screenshotName, { element: '#container' });

  if (!isMaterial()) {
    await testScreenshot(t, takeScreenshot, screenshotName, { element: '#container', theme: 'generic.dark' });
    await testScreenshot(t, takeScreenshot, screenshotName, { element: '#container', theme: 'generic.contrast' });
  }

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxForm', {
  height: 400,
  width: 1000,
  formData: {
    firstName: 'John',
    lastName: 'Heart',
    position: 'CEO',
  },
  items: [
    { dataField: 'firstName', isRequired: true },
    { dataField: 'lastName', isOptional: true },
    'position',
  ],
  requiredMark: '!',
  optionalMark: 'opt',
  showOptionalMark: true,
}));

test('Form labels should have correct width after render in invisible container', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Form labels width after render in invisible container.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'form');
  await insertStylesheetRulesToPage('#container { display: none; }');

  await createWidget('dxForm', {
    width: 1000,
    labelLocation: 'left',
    formData: {
      ID: 1,
      FirstName: 'John',
      LastName: 'Heart',
      Position: 'CEO',
      OfficeNo: '901',
      BirthDate: new Date(1964, 2, 16),
      HireDate: new Date(1995, 0, 15),
      Address: '351 S Hill St.',
      City: 'Los Angeles',
      State: 'CA',
      ZipCode: '90013',
      Phone: '+1(213) 555-9392',
      Email: 'jheart@dx-email.com',
      Skype: 'jheart_DX_skype',
    },
    colCount: 2,
    items: [{
      itemType: 'group',
      caption: 'System Information',
      items: ['ID', 'FirstName', 'LastName', 'HireDate', 'Position', 'OfficeNo'],
    }, {
      itemType: 'group',
      caption: 'Personal Data',
      items: ['BirthDate', {
        itemType: 'group',
        caption: 'Home Address',
        items: ['Address', 'City', 'State', 'ZipCode'],
      }],
    }, {
      itemType: 'group',
      caption: 'Contact Information',
      items: [{
        itemType: 'tabbed',
        tabPanelOptions: {
          deferRendering: true,
        },
        tabs: [{
          title: 'Phone',
          items: ['Phone'],
        }, {
          title: 'Skype',
          items: ['Skype'],
        }, {
          title: 'Email',
          items: ['Email'],
        }],
      }],
    }],
  }, '#form');

  await removeStylesheetRulesFromPage();
});
