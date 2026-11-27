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
  title: 'Band sticky columns: left and right positions',
  screenshots: ['band-columns-1-(case-1)', 'band-columns-2-(case-1)'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns.push({
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
      }, {
        caption: 'Band column 2',
        fixed: true,
        fixedPosition: 'right',
        columns: [
          { dataField: 'field_16', name: 'child_6' },
          {
            caption: 'Nested band column 3',
            columns: [
              { dataField: 'field_17', name: 'child_7' },
              { dataField: 'field_18', name: 'child_8' },
            ],
          },
          { dataField: 'field_19', name: 'child_9' },
        ],
      });
    },
  }),
}, {
  title: 'Band sticky columns: left positions',
  screenshots: ['band-columns-1-(case-2)', 'band-columns-2-(case-2)'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns.push({
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
      }, {
        caption: 'Band column 2',
        fixed: true,
        fixedPosition: 'left',
        columns: [
          { dataField: 'field_16', name: 'child_6' },
          {
            caption: 'Nested band column 3',
            columns: [
              { dataField: 'field_17', name: 'child_7' },
              { dataField: 'field_18', name: 'child_8' },
            ],
          },
          { dataField: 'field_19', name: 'child_9' },
        ],
      });
    },
  }),
}, {
  title: 'Band sticky columns: right positions',
  screenshots: ['band-columns-1-(case-3)', 'band-columns-2-(case-3)'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns.push({
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
      }, {
        caption: 'Band column 2',
        fixed: true,
        fixedPosition: 'right',
        columns: [
          { dataField: 'field_16', name: 'child_6' },
          {
            caption: 'Nested band column 3',
            columns: [
              { dataField: 'field_17', name: 'child_7' },
              { dataField: 'field_18', name: 'child_8' },
            ],
          },
          { dataField: 'field_19', name: 'child_9' },
        ],
      });
    },
  }),
}, {
  title: 'Band sticky column with left position and unfixed band column',
  screenshots: ['band-columns-1-(case-4)', 'band-columns-2-(case-4)'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns.push({
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
      }, {
        caption: 'Band column 2',
        columns: [
          { dataField: 'field_16', name: 'child_6' },
          {
            caption: 'Nested band column 3',
            columns: [
              { dataField: 'field_17', name: 'child_7' },
              { dataField: 'field_18', name: 'child_8' },
            ],
          },
          { dataField: 'field_19', name: 'child_9' },
        ],
      });
    },
  }),
}, {
  title: 'Band sticky column with right position and unfixed band column',
  screenshots: ['band-columns-1-(case-5)', 'band-columns-2-(case-5)'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns.push({
        caption: 'Band column 1',
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
      }, {
        caption: 'Band column 2',
        fixed: true,
        fixedPosition: 'right',
        columns: [
          { dataField: 'field_16', name: 'child_6' },
          {
            caption: 'Nested band column 3',
            columns: [
              { dataField: 'field_17', name: 'child_7' },
              { dataField: 'field_18', name: 'child_8' },
            ],
          },
          { dataField: 'field_19', name: 'child_9' },
        ],
      });
    },
  }),
}, {
  title: 'Adjacent band sticky columns: sticky positions',
  screenshots: ['band-columns-1-(case-6)', 'band-columns-2-(case-6)'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
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
      columns.splice(3, 0, {
        caption: 'Band column 2',
        fixed: true,
        fixedPosition: 'sticky',
        columns: [
          { dataField: 'field_16', name: 'child_6' },
          {
            caption: 'Nested band column 3',
            columns: [
              { dataField: 'field_17', name: 'child_7' },
              { dataField: 'field_18', name: 'child_8' },
            ],
          },
          { dataField: 'field_19', name: 'child_9' },
        ],
      });
    },
  }),
}, {
  title: 'First and last band sticky columns: sticky positions',
  screenshots: ['band-columns-1-(case-7)', 'band-columns-2-(case-7)'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns.unshift({
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
      columns.push({
        caption: 'Band column 2',
        fixed: true,
        fixedPosition: 'sticky',
        columns: [
          { dataField: 'field_16', name: 'child_6' },
          {
            caption: 'Nested band column 3',
            columns: [
              { dataField: 'field_17', name: 'child_7' },
              { dataField: 'field_18', name: 'child_8' },
            ],
          },
          { dataField: 'field_19', name: 'child_9' },
        ],
      });
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
