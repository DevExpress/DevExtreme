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

interface FixedColumnsCase {
  title: string;
  browserSize: [number, number];
  width: number;
  screenshots: [string, string];
  // Runs in the page: customizeColumns cannot pass through the "page.evaluate" arguments.
  createOptions: (options: MatrixOptions) => Properties;
}

const CASES: FixedColumnsCase[] = [{
  title: 'Sticky columns with left position',
  browserSize: [900, 800],
  width: 884,
  screenshots: ['left-position-1', 'left-position-2'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns[5].fixed = true;
      columns[5].fixedPosition = 'left';
      columns[6].fixed = true;
      columns[6].fixedPosition = 'left';
    },
  }),
}, {
  title: 'Sticky columns with right position',
  browserSize: [900, 800],
  width: 884,
  screenshots: ['right-position-1', 'right-position-2'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns[5].fixed = true;
      columns[5].fixedPosition = 'right';
      columns[6].fixed = true;
      columns[6].fixedPosition = 'right';
    },
  }),
}, {
  title: 'Sticky columns with left and right positions',
  browserSize: [900, 800],
  width: 884,
  screenshots: ['left-right-positions-1', 'left-right-positions-2'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns[5].fixed = true;
      columns[5].fixedPosition = 'left';
      columns[6].fixed = true;
      columns[6].fixedPosition = 'left';
      columns[7].fixed = true;
      columns[7].fixedPosition = 'right';
      columns[8].fixed = true;
      columns[8].fixedPosition = 'right';
    },
  }),
}, {
  title: 'Sticky columns with left, right and sticky positions',
  browserSize: [1000, 800],
  width: 984,
  screenshots: ['left-right-sticky-positions-1', 'left-right-sticky-positions-2'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns[2].fixed = true;
      columns[2].fixedPosition = 'left';
      columns[3].fixed = true;
      columns[3].fixedPosition = 'left';
      columns[7].fixed = true;
      columns[7].fixedPosition = 'sticky';
      columns[8].fixed = true;
      columns[8].fixedPosition = 'sticky';
      columns[9].fixed = true;
      columns[9].fixedPosition = 'sticky';
      columns[12].fixed = true;
      columns[12].fixedPosition = 'sticky';
      columns[15].fixed = true;
      columns[15].fixedPosition = 'right';
      columns[16].fixed = true;
      columns[16].fixedPosition = 'right';
    },
  }),
}, {
  title: 'Sticky columns with sticky position',
  browserSize: [1000, 800],
  width: 984,
  screenshots: ['sticky-position-1-(case-1)', 'sticky-position-2-(case-1)'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns[7].fixed = true;
      columns[7].fixedPosition = 'sticky';
      columns[8].fixed = true;
      columns[8].fixedPosition = 'sticky';
      columns[9].fixed = true;
      columns[9].fixedPosition = 'sticky';
      columns[12].fixed = true;
      columns[12].fixedPosition = 'sticky';
    },
  }),
}, {
  title: 'Sticky columns with sticky position when first and last cells are sticky',
  browserSize: [1000, 800],
  width: 984,
  screenshots: ['sticky-position-1-(case-2)', 'sticky-position-2-(case-2)'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns[0].fixed = true;
      columns[0].fixedPosition = 'sticky';
      columns[1].fixed = true;
      columns[1].fixedPosition = 'sticky';
      columns[7].fixed = true;
      columns[7].fixedPosition = 'sticky';
      columns[8].fixed = true;
      columns[8].fixedPosition = 'sticky';
      columns[9].fixed = true;
      columns[9].fixedPosition = 'sticky';
      columns[columns.length - 2].fixed = true;
      columns[columns.length - 2].fixedPosition = 'sticky';
      columns[columns.length - 1].fixed = true;
      columns[columns.length - 1].fixedPosition = 'sticky';
    },
  }),
}, {
  title: 'Sticky columns with sticky position when first and last cells are fixed on left and right respectively',
  browserSize: [1000, 800],
  width: 984,
  screenshots: ['sticky-position-1-(case-3)', 'sticky-position-2-(case-3)'],
  createOptions: (options) => ({
    ...options,
    customizeColumns: (columns) => {
      columns[0].fixed = true;
      columns[0].fixedPosition = 'left';
      columns[1].fixed = true;
      columns[1].fixedPosition = 'sticky';
      columns[7].fixed = true;
      columns[7].fixedPosition = 'sticky';
      columns[8].fixed = true;
      columns[8].fixedPosition = 'sticky';
      columns[9].fixed = true;
      columns[9].fixedPosition = 'sticky';
      columns[columns.length - 2].fixed = true;
      columns[columns.length - 2].fixedPosition = 'sticky';
      columns[columns.length - 1].fixed = true;
      columns[columns.length - 1].fixedPosition = 'right';
    },
  }),
}];

test.describe('FixedColumns', () => {
  borderConfigs.forEach(({ showColumnLines, showBorders }) => {
    [true, false].forEach((rtlEnabled) => {
      CASES.forEach(({
        title, browserSize, width, screenshots, createOptions,
      }) => {
        test.describe(() => {
          test.use({ browserSize });

          test(`${title} (showColumnLines = ${showColumnLines}, showBorders = ${showBorders}, rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
            const configName = `(cLines_=_${showColumnLines}_borders_=_${showBorders}_rtl_=_${rtlEnabled})`;

            await createWidget(page, 'dxDataGrid', createOptions, DEFAULT_SELECTOR, {
              arg: {
                dataSource: getData(5, 25),
                width,
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
});
