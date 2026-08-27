import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';

const CONTEXT_MENU_CLASS = 'dx-context-menu';
const FIELD_CHOOSER_AREA_FIELDS_CLASS = 'dx-area-fields';

test('ContextMenu width should be adjusted to the width of the item text (T1106236)', {
  tag: ['@generic.light'],
}, async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
    width: 1000,
    allowSortingBySummary: true,
    allowSorting: true,
    allowExpandAll: true,
    showBorders: true,
    fieldChooser: {
      enabled: false,
    },
    fieldPanel: {
      showFilterFields: false,
      allowFieldDragging: false,
      visible: true,
    },
    onContextMenuPreparing(e) {
      if (e.field?.dataField === 'amount') {
        const menuItems = [] as any;

        e.items.push({ text: 'Summary Type', items: menuItems });
        ['Sum', 'Avg', 'Min', 'Max'].forEach((summaryType) => {
          const summaryTypeValue = summaryType.toLowerCase();
          const text = summaryType === 'Min'
            ? 'Min - The box is too narrow, the item text does not fit inside.'
            : summaryType;
          menuItems.push({
            text,
            value: summaryType.toLowerCase(),
            selected: e.field.summaryType === summaryTypeValue,
          });
        });
      }
    },
    dataSource: {
      fields: [{
        caption: 'Region',
        width: 120,
        dataField: 'region',
        area: 'row',
      }, {
        caption: 'City',
        dataField: 'city',
        width: 150,
        area: 'row',
      }, {
        dataField: 'date',
        dataType: 'date',
        area: 'column',
      }, {
        groupName: 'date',
        groupInterval: 'year',
        expanded: true,
      }, {
        caption: 'Relative Sales',
        dataField: 'amount',
        dataType: 'number',
        summaryType: 'sum',
        area: 'data',
        summaryDisplayMode: 'percentOfColumnGrandTotal',
      }],
      store: [{
        id: 10887,
        region: 'Africa',
        country: 'Egypt',
        city: 'Cairo',
        amount: 500,
        date: new Date('2015-05-26'),
      }, {
        id: 10888,
        region: 'South America',
        country: 'Argentina',
        city: 'Buenos Aires',
        amount: 780,
        date: '2015-05-07',
      }],
    },
  });

  await page.locator(`.${FIELD_CHOOSER_AREA_FIELDS_CLASS}`).nth(1).click({ button: 'right' });

  await page.locator(`.${CONTEXT_MENU_CLASS}`).first().hover();

  await testScreenshot(page, 'PivotGrid contextmenu width.png');
});
