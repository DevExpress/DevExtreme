import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import CustomStore from '@ts/data/m_custom_store';

import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '../../__tests__/__mock__/helpers/utils';

describe('DataGrid editing', () => {
  let dataSource: Record<string, string | number>[] = [];

  beforeEach(() => {
    beforeTest();
    dataSource = [{
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
  });
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

  describe('Internal state cleanup after save', () => {
    it('should clear internal state after updating and saving row', async () => {
      const { instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
      });

      // Edit row using cellValue
      instance.cellValue(0, 'FirstName', 'Updated');
      const editingController = instance.getController('editing');

      // Verify internal state has entries before save
      expect(editingController.getInternalStateSize()).toBe(1);

      // Save changes
      instance.saveEditData();
      await flushAsync();

      // Check internal state is cleared after save
      expect(editingController.getInternalStateSize()).toBe(0);
    });

    it('should clear internal state after adding and saving row', async () => {
      const { instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        editing: {
          mode: 'batch',
          allowAdding: true,
        },
      });

      // Add new row
      instance.addRow();
      await flushAsync();

      const editingController = instance.getController('editing');
      expect(editingController.getInternalStateSize()).toBe(1);

      // Save changes
      instance.saveEditData();
      await flushAsync();

      // Check internal state is cleared
      expect(editingController.getInternalStateSize()).toBe(0);
    });

    it('should clear internal state after deleting and saving row', async () => {
      const { instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        editing: {
          mode: 'batch',
          allowDeleting: true,
        },
      });

      // Delete row
      instance.deleteRow(1);

      const editingController = instance.getController('editing');
      expect(editingController.getInternalStateSize()).toBe(1);

      // Save changes
      instance.saveEditData();
      await flushAsync();

      // Check internal state is cleared
      expect(editingController.getInternalStateSize()).toBe(0);
    });

    it('should clear internal state for multiple operations after save', async () => {
      const { instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        editing: {
          mode: 'batch',
          allowUpdating: true,
          allowAdding: true,
          allowDeleting: true,
        },
      });

      // Multiple operations
      instance.cellValue(0, 'FirstName', 'Updated');
      instance.deleteRow(1);
      instance.addRow();
      await flushAsync();

      const editingController = instance.getController('editing');
      expect(editingController.getInternalStateSize()).toBe(3);

      // Save all changes
      instance.saveEditData();
      await flushAsync();

      // Check internal state is completely cleared
      expect(editingController.getInternalStateSize()).toBe(0);
    });

    it('should clear internal state when canceling changes', async () => {
      const { instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        editing: {
          mode: 'batch',
          allowUpdating: true,
          allowAdding: true,
        },
      });

      // Make some changes
      instance.cellValue(0, 'FirstName', 'Updated');
      instance.addRow();
      await flushAsync();

      const editingController = instance.getController('editing');
      const stateBeforeCancel = editingController.getInternalStateSize();
      expect(stateBeforeCancel).toBe(2);

      // Cancel changes
      instance.cancelEditData();

      // Check internal state is cleared
      expect(editingController.getInternalStateSize()).toBe(0);
    });

    it('should preserve internal state when save fails', async () => {
      const failingDataSource = new CustomStore({
        key: 'ID',
        load: () => Promise.resolve([...dataSource]),
        update: () => Promise.reject(new Error('Save failed')),
      });

      const { instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource: failingDataSource,
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
      });

      instance.cellValue(0, 'FirstName', 'Updated');

      const editingController = instance.getController('editing');

      expect(editingController.getInternalStateSize()).toBe(1);

      instance.saveEditData();
      await flushAsync();

      expect(editingController.getInternalStateSize()).toBe(1);
    });
  });
});
