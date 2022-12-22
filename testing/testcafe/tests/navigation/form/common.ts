import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { appendElementTo, insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../helpers/domUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';
import { getThemePostfix } from '../../../helpers/getPostfix';

fixture`Form`
  .page(url(__dirname, '../../container.html'));

['generic.light', 'generic.dark', 'generic.contrast'].forEach((theme) => {
  // T882067
  test(`Color of the mark,theme=${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`Form color of the mark${getThemePostfix(theme)}.png`, '#container'))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxForm', {
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
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });
});

test('Form labels should have correct width after render in invisible container', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('Form labels width after render in invisible container.png', '#container'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'form');
  await insertStylesheetRulesToPage('#container { display: none; }');

  await createWidget('dxForm', {
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
  }, true, '#form');

  await removeStylesheetRulesFromPage();
});
