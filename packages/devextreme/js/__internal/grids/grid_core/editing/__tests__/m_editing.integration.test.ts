import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import DataGrid from '@js/ui/data_grid';
import { DataGridModel } from '@ts/grids/data_grid/__tests__/__mock__/model/data_grid';

const GRID_CONTAINER_ID = 'gridContainer';

const SELECTORS = {
  gridContainer: `#${GRID_CONTAINER_ID}`,
};

const dataSource = [{
  ID: 1,
  FirstName: 'John',
  LastName: 'Heart',
  Prefix: 'Mr.',
  Position: 'CEO',
  BirthDate: '1964/03/16',
  HireDate: '1995/01/15',
  Notes: 'John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.',
  Address: '351 S Hill St.',
}, {
  ID: 2,
  FirstName: 'Olivia',
  LastName: 'Peyton',
  Prefix: 'Mrs.',
  Position: 'Sales Assistant',
  BirthDate: '1981/06/03',
  HireDate: '2012/05/14',
  Notes: 'Olivia loves to sell. She has been selling DevAV products since 2012. \r\n\r\nOlivia was homecoming queen in high school. She is expecting her first child in 6 months. Good Luck Olivia.',
  Address: '807 W Paseo Del Mar',
}, {
  ID: 3,
  FirstName: 'Robert',
  LastName: 'Reagan',
  Prefix: 'Mr.',
  Position: 'CMO',
  BirthDate: '1974/09/07',
  HireDate: '2002/11/08',
  Notes: 'Robert was recently voted the CMO of the year by CMO Magazine. He is a proud member of the DevAV Management Team.\r\n\r\nRobert is a championship BBQ chef, so when you get the chance ask him for his secret recipe.',
  Address: '4 Westmoreland Pl.',
}];

const flushAsync = async (): Promise<void> => {
  jest.runOnlyPendingTimers();
  await Promise.resolve();
};

const createDataGrid = async (
  options: DataGridProperties = {},
): Promise<{
  $container: dxElementWrapper;
  component: DataGridModel;
  instance: DataGrid;
}> => new Promise((resolve) => {
  const $container = $('<div>')
    .attr('id', GRID_CONTAINER_ID)
    .appendTo(document.body);

  const instance = new DataGrid($container.get(0) as HTMLDivElement, options);
  const component = new DataGridModel($container.get(0) as HTMLElement);

  jest.runAllTimers();
  resolve({
    $container,
    component,
    instance,
  });
});

const beforeTest = (): void => {
  jest.useFakeTimers();
};

const afterTest = (): void => {
  const $container = $(SELECTORS.gridContainer);
  const dataGrid = (
    $container as dxElementWrapper & { dxDataGrid: (command: string) => DataGrid }
  ).dxDataGrid('instance');

  dataGrid.dispose();
  $container.remove();
  jest.clearAllMocks();
  jest.useRealTimers();
};

describe('DataGrid editing', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  // T1293181
  describe('Recovered (undeleted) row', () => {
    it('should have correct data when placed before inserted row in batch editing', async () => {
      const recoveringRowIndex = dataSource.length - 1;
      const { component, instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        columns: [
          {
            dataField: 'Prefix',
            caption: 'Title',
            width: 70,
          },
          'FirstName',
          'LastName', {
            dataField: 'Position',
            width: 170,
          }, {
            dataField: 'BirthDate',
            dataType: 'date' as const,
          },
        ],
        editing: {
          mode: 'batch',
          allowDeleting: true,
          allowAdding: true,
          newRowPosition: 'pageBottom',
          texts: {
            deleteRow: 'Delete',
            undeleteRow: 'Undelete',
          },
        },
      });

      await flushAsync();

      await instance.addRow();
      await flushAsync();

      const rowDeleteButton = component.getDataRow(recoveringRowIndex).getDeleteButton();
      rowDeleteButton.click();
      await flushAsync();

      const rowRecoverButton = component.getDataRow(recoveringRowIndex).getRecoverButton();
      rowRecoverButton.click();
      await flushAsync();

      const rows = instance.getVisibleRows();
      expect(rows).toHaveLength(dataSource.length + 1);
      expect(rows[recoveringRowIndex].data).toEqual(dataSource[recoveringRowIndex]);
    });
  });
});
