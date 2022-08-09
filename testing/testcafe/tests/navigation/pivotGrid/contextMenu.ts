import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';

fixture`PivotGrid_contextMenu`
  .page(url(__dirname, '../../container.html'));

['generic.light', 'material.blue.light'].forEach((theme) => {
  test(`ContextMenu width should be adjusted to the width of the item text, theme=${theme} (T1106236)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.rightClick(Selector('.dx-area-fields').nth(1));

    await t.hover(Selector('.dx-context-menu'));

    await t
      .expect(await takeScreenshot(`PivotGrid_contextmenu_width,theme=${theme.replace(/\./g, '-')}.png`))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxPivotGrid', {
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
        if (e.field && e.field.dataField === 'amount') {
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
          id: 10888,
          region: 'South America',
          country: 'Argentina',
          city: 'Buenos Aires',
          amount: 780,
          date: '2015-05-07',
        }],
      },
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });
});
