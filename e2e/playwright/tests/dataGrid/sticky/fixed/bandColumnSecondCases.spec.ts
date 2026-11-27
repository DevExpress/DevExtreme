/* eslint-disable no-param-reassign -- customizeColumns changes the columns it gets */
import type { Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { getData } from '../../helpers/generateDataSourceData';
import { borderConfigs } from '../helpers/testMatrixConfig';

interface MatrixOptions {
  dataSource: Record<string, string>[];
  width: number;
  showColumnLines: boolean;
  showBorders: boolean;
  rtlEnabled: boolean;
  columnAutoWidth: boolean;
}

interface BandColumnsCase {
  title: string;
  screenshots: [string, string];
  // Runs in the page: customizeColumns cannot pass through the "page.evaluate" arguments.
  createOptions: (options: MatrixOptions) => Properties;
}

const CASES: BandColumnsCase[] = [{
  title: 'Sticky column + Band sticky column + Sticky column: sticky positions',
  screenshots: ['band-columns-1-(case-8)', 'band-columns-2-(case-8)'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns[1].fixed = true;
      columns[1].fixedPosition = 'sticky';

      columns.splice(2, 0, {
        caption: 'Band column 1',
        fixed: true,
        fixedPosition: 'sticky',
        columns: [{
          caption: 'Nested band column 1',
          columns: [
            { dataField: 'field_11', name: 'child_1' },
            { dataField: 'field_12', name: 'child_2' },
          ],
        }, { dataField: 'field_13', name: 'child_3' }, {
          caption: 'Nested band column 2',
          columns: [
            { dataField: 'field_14', name: 'child_4' },
            { dataField: 'field_15', name: 'child_5' },
          ],
        }],
      });

      columns[3].fixed = true;
      columns[3].fixedPosition = 'sticky';
    },
  }),
}, {
  title: 'Sticky column + Band sticky column + Sticky column: left positions',
  screenshots: ['band-columns-1-(case-9)', 'band-columns-2-(case-9)'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns[1].fixed = true;
      columns[1].fixedPosition = 'left';

      columns.splice(2, 0, {
        caption: 'Band column 1',
        fixed: true,
        fixedPosition: 'left',
        columns: [{
          caption: 'Nested band column 1',
          columns: [
            { dataField: 'field_11', name: 'child_1' },
            { dataField: 'field_12', name: 'child_2' },
          ],
        }, { dataField: 'field_13', name: 'child_3' }, {
          caption: 'Nested band column 2',
          columns: [
            { dataField: 'field_14', name: 'child_4' },
            { dataField: 'field_15', name: 'child_5' },
          ],
        }],
      });

      columns[3].fixed = true;
      columns[3].fixedPosition = 'left';
    },
  }),
}, {
  title: 'Sticky column + Band sticky column + Sticky column: right positions',
  screenshots: ['band-columns-1-(case-10)', 'band-columns-2-(case-10)'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns[1].fixed = true;
      columns[1].fixedPosition = 'right';

      columns.splice(2, 0, {
        caption: 'Band column 1',
        fixed: true,
        fixedPosition: 'right',
        columns: [{
          caption: 'Nested band column 1',
          columns: [
            { dataField: 'field_11', name: 'child_1' },
            { dataField: 'field_12', name: 'child_2' },
          ],
        }, { dataField: 'field_13', name: 'child_3' }, {
          caption: 'Nested band column 2',
          columns: [
            { dataField: 'field_14', name: 'child_4' },
            { dataField: 'field_15', name: 'child_5' },
          ],
        }],
      });

      columns[3].fixed = true;
      columns[3].fixedPosition = 'right';
    },
  }),
}, {
  title: 'Band sticky column with left position + Sticky column with sticky position',
  screenshots: ['band-columns-1-(case-11)', 'band-columns-2-(case-11)'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns.splice(1, 0, {
        caption: 'Band column 1',
        fixed: true,
        fixedPosition: 'left',
        columns: [{
          caption: 'Nested band column 1',
          columns: [
            { dataField: 'field_11', name: 'child_1' },
            { dataField: 'field_12', name: 'child_2' },
          ],
        }, { dataField: 'field_13', name: 'child_3' }, {
          caption: 'Nested band column 2',
          columns: [
            { dataField: 'field_14', name: 'child_4' },
            { dataField: 'field_15', name: 'child_5' },
          ],
        }],
      });

      columns[0].fixed = true;
      columns[0].fixedPosition = 'sticky';
    },
  }),
}, {
  title: 'Sticky column with sticky position + Band sticky column with right position',
  screenshots: ['band-columns-1-(case-12)', 'band-columns-2-(case-12)'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns.splice(columns.length - 1, 0, {
        caption: 'Band column 1',
        fixed: true,
        fixedPosition: 'right',
        columns: [{
          caption: 'Nested band column 1',
          columns: [
            { dataField: 'field_11', name: 'child_1' },
            { dataField: 'field_12', name: 'child_2' },
          ],
        }, { dataField: 'field_13', name: 'child_3' }, {
          caption: 'Nested band column 2',
          columns: [
            { dataField: 'field_14', name: 'child_4' },
            { dataField: 'field_15', name: 'child_5' },
          ],
        }],
      });

      columns[columns.length - 1].fixed = true;
      columns[columns.length - 1].fixedPosition = 'sticky';
    },
  }),
}, {
  title: 'Sticky column with left position + Band sticky column with sticky position',
  screenshots: ['band-columns-1-(case-13)', 'band-columns-2-(case-13)'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns[0].fixed = true;
      columns[0].fixedPosition = 'left';

      columns.splice(1, 0, {
        caption: 'Band column 1',
        fixed: true,
        fixedPosition: 'sticky',
        columns: [{
          caption: 'Nested band column 1',
          columns: [
            { dataField: 'field_11', name: 'child_1' },
            { dataField: 'field_12', name: 'child_2' },
          ],
        }, { dataField: 'field_13', name: 'child_3' }, {
          caption: 'Nested band column 2',
          columns: [
            { dataField: 'field_14', name: 'child_4' },
            { dataField: 'field_15', name: 'child_5' },
          ],
        }],
      });
    },
  }),
}, {
  title: 'Band sticky column with sticky position + Sticky column with right position',
  screenshots: ['band-columns-1-(case-14)', 'band-columns-2-(case-14)'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns.splice(columns.length - 1, 0, {
        caption: 'Band column 1',
        fixed: true,
        fixedPosition: 'sticky',
        columns: [{
          caption: 'Nested band column 1',
          columns: [
            { dataField: 'field_11', name: 'child_1' },
            { dataField: 'field_12', name: 'child_2' },
          ],
        }, { dataField: 'field_13', name: 'child_3' }, {
          caption: 'Nested band column 2',
          columns: [
            { dataField: 'field_14', name: 'child_4' },
            { dataField: 'field_15', name: 'child_5' },
          ],
        }],
      });

      columns[columns.length - 1].fixed = true;
      columns[columns.length - 1].fixedPosition = 'right';
    },
  }),
}];

test.describe('FixedColumns', () => {
  test.use({ browserSize: [1000, 800] });

  borderConfigs.forEach(({ showColumnLines, showBorders }) => {
    [true, false].forEach((rtlEnabled) => {
      CASES.forEach(({ title, screenshots, createOptions }) => {
        test(`${title} (showColumnLines = ${showColumnLines}, showBorders = ${showBorders}, rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
          const configName = `(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled})`;

          await createWidget(page, 'dxDataGrid', createOptions, DEFAULT_SELECTOR, {
            arg: {
              dataSource: getData(5, 25),
              width: 984,
              showColumnLines,
              showBorders,
              rtlEnabled,
              columnAutoWidth: true,
            },
          });

          const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

          await expect.poll(() => dataGrid.isReady()).toBe(true);

          await testScreenshot(page, `${screenshots[0]}${configName}.png`, { element: dataGrid.element });

          await dataGrid.scrollTo({ left: rtlEnabled ? 0 : 10000 });

          await testScreenshot(page, `${screenshots[1]}${configName}.png`, { element: dataGrid.element });
        });
      });
    });
  });
});
