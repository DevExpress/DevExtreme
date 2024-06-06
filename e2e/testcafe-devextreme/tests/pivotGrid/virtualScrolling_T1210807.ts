import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import PivotGrid from 'devextreme-testcafe-models/pivotGrid';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture.disablePageReloads`PivotGrid_scrolling`
  .page(url(__dirname, '../container.html'));

const MS_IN_DAY = 24 * 60 * 60 * 1000;

function getDate(startYear, i): Date {
  const start = new Date(startYear, 0, 1);
  return new Date(start.getTime() + i * MS_IN_DAY);
}

function createPivotGridData(numItems, entriesPerItem): object[] {
  const brands = ['BrandA', 'BrandB', 'BrandC', 'BrandD', 'BrandE'];
  const subBrands = ['SubBrand1', 'SubBrand2', 'SubBrand3', 'SubBrand4', 'SubBrand5'];
  const packContainers = ['Container1', 'Container2', 'Container3', 'Container4', 'Container5'];
  const flavors = ['Flavor1', 'Flavor2', 'Flavor3', 'Flavor4', 'Flavor5'];
  const countries = ['Country1', 'Country2', 'Country3', 'Country4', 'Country5'];
  const locations = ['Location1', 'Location2', 'Location3', 'Location4', 'Location5'];
  const customerDCs = ['DC1', 'DC2', 'DC3', 'DC4', 'DC5'];
  const channels = ['Channel1', 'Channel2', 'Channel3', 'Channel4', 'Channel5'];
  const customers = ['Customer1', 'Customer2', 'Customer3', 'Customer4', 'Customer5'];

  const data = [];
  for (let i = 0; i < numItems; i += 1) {
    for (let j = 0; j < entriesPerItem; j += 1) {
      const entry = {
        item: `Item${i + 1}`,
        brand: brands[i % brands.length],
        subBrand: subBrands[i % subBrands.length],
        packContainer: packContainers[i % packContainers.length],
        flavor: flavors[i % flavors.length],
        country: countries[i % countries.length],
        location: locations[i % locations.length],
        customerDC: customerDCs[i % customerDCs.length],
        channel: channels[i % channels.length],
        customer: customers[i % customers.length],
        date: getDate(2020, i).toISOString().split('T')[0],
        totalSales: i * 10000,
        quantitySold: i,
        productsReturned: i,
      };
      data.push(entry);
    }
  }
  return data;
}

test('Row fields overlap data fields if dataFieldArea is set to "row" and virtual scrolling is enabled (T1210807)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const pivotGrid = new PivotGrid('#container');
  const firstHeaderRow = pivotGrid.getRowsArea(2).getCell(0);
  await t
    .click(firstHeaderRow);
  await pivotGrid.scrollBy({ top: 300000 });
  await pivotGrid.scrollBy({ top: 300000 });

  await takeScreenshot('rows_do_not_overlap_data_fields_if_virtual_scrolling_enabled_T1210807.png', pivotGrid.element);
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxPivotGrid', {
  allowExpandAll: true,
  showBorders: true,
  height: 560,
  rowHeaderLayout: 'tree',
  dataFieldArea: 'row',
  scrolling: {
    mode: 'virtual',
  },
  dataSource: {
    fields: [
      {
        caption: 'Item',
        dataField: 'item',
        area: 'row',
        width: 120,
      },
      {
        caption: 'Brand',
        dataField: 'brand',
        area: 'row',
        expanded: true,
        width: 120,
      },
      {
        caption: 'Sub Brand',
        dataField: 'subBrand',
        expanded: true,
        area: 'row',
        width: 120,
      },
      {
        caption: 'Pack Container',
        dataField: 'packContainer',
        area: 'row',
        expanded: true,
        width: 120,
      },
      {
        caption: 'Flavor',
        dataField: 'flavor',
        area: 'row',
        expanded: true,
        width: 120,
      },
      {
        caption: 'Country',
        dataField: 'country',
        area: 'row',
        expanded: true,
        width: 120,
      },
      {
        caption: 'Location',
        dataField: 'location',
        area: 'row',
        expanded: true,
        width: 120,
      },
      {
        caption: 'Customer DC',
        dataField: 'customerDC',
        area: 'row',
        expanded: true,
        width: 120,
      },
      {
        caption: 'Channel',
        dataField: 'channel',
        area: 'row',
        width: 120,
      },
      {
        caption: 'Customer',
        dataField: 'customer',
        area: 'row',
        width: 120,
      },
      {
        dataField: 'date',
        dataType: 'date',
        area: 'column',
        groupInterval: 'year',
      },
      {
        dataField: 'date',
        dataType: 'date',
        area: 'column',
        groupInterval: 'month',
      },
      {
        dataField: 'date',
        dataType: 'date',
        area: 'column',
        groupInterval: 'day',
      },
      {
        caption: 'Total Sales',
        dataField: 'totalSales',
        dataType: 'number',
        summaryType: 'sum',
        format: 'currency',
        area: 'data',
      },
      {
        caption: 'Quantity Sold',
        dataField: 'quantitySold',
        dataType: 'number',
        summaryType: 'sum',
        area: 'data',
      },
      {
        caption: 'Products Returned',
        dataField: 'productsReturned',
        dataType: 'number',
        summaryType: 'sum',
        area: 'data',
      },
    ],
    store: createPivotGridData(30, 20),
  },
}));
