import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import CustomStore from '@js/data/custom_store';
import { Deferred } from '@ts/core/utils/deferred';

import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
  GRID_CONTAINER_ID,
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

  describe('Disabled command button', () => {
    it('should expose the disabled state on the command link', async () => {
      await createDataGrid({
        dataSource,
        keyExpr: 'ID',
        columns: ['FirstName', {
          type: 'buttons',
          buttons: [
            { text: 'Enabled', disabled: false },
            { text: 'Disabled', disabled: true },
          ],
        }],
      });
      await flushAsync();

      const links = document.querySelectorAll(`#${GRID_CONTAINER_ID} .dx-command-edit .dx-link`);

      expect(links.length).toBe(dataSource.length * 2);
      expect(links[0].getAttribute('aria-disabled')).toBe(null);
      expect(links[1].getAttribute('aria-disabled')).toBe('true');
      expect(links[1].classList.contains('dx-state-disabled')).toBe(true);
    });
  });

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

  describe('allowUpdating for a new row (T1332312)', () => {
    it('should allow updating a new row regardless of the allowUpdating option', async () => {
      const { instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        editing: {
          mode: 'batch',
          allowUpdating: false,
          allowAdding: true,
        },
      });

      await instance.addRow();
      await flushAsync();

      const editingController = instance.getController('editing');
      const dataController = instance.getController('data');
      const newRow = dataController.items().find((row) => row.isNewRow);
      const existingRow = dataController.items().find((row) => !row.isNewRow);

      expect(editingController.allowUpdating({ row: newRow })).toBe(true);
      expect(editingController.allowUpdating({ row: existingRow })).toBe(false);
    });

    it('should respect the allowUpdating option for a new row when allowEditingForNewRows is false', async () => {
      const { instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        editing: {
          mode: 'batch',
          allowUpdating: false,
          allowAdding: true,
        },
      });

      await instance.addRow();
      await flushAsync();

      const editingController = instance.getController('editing');
      const dataController = instance.getController('data');
      const newRow = dataController.items().find((row) => row.isNewRow);

      expect(editingController.allowUpdating({ row: newRow }, 'click', false)).toBe(false);
    });
  });

  describe('Nested arrays in row data (T1334039)', () => {
    const createDataSourceWithTasks = (): Record<string, unknown>[] => [
      { ID: 1, FirstName: 'John', Tasks: [{ ID: 11, Subject: 'Task 1' }] },
      { ID: 2, FirstName: 'Olivia', Tasks: [{ ID: 21, Subject: 'Task 2' }] },
    ];

    it.each([
      { refreshMode: 'reshape' as const },
      { refreshMode: 'repaint' as const },
      { refreshMode: 'full' as const },
    ])('should keep the nested array reference after saving a cell when refreshMode is "$refreshMode"', async ({ refreshMode }) => {
      const dataSourceWithTasks = createDataSourceWithTasks();
      const tasks = dataSourceWithTasks[0].Tasks;

      const { component } = await createDataGrid({
        keyExpr: 'ID',
        dataSource: dataSourceWithTasks,
        columns: ['FirstName'],
        editing: {
          mode: 'cell',
          refreshMode,
          allowUpdating: true,
        },
      });

      component.apiCellValue(0, 'FirstName', 'Updated');
      const saving = component.apiSaveEditData();
      await flushAsync();
      await saving;

      expect(component.getDataCell(0, 0).getText()).toBe('Updated');
      expect(component.apiGetVisibleRows()[0].data.Tasks).toBe(tasks);
      expect(dataSourceWithTasks[0].Tasks).toBe(tasks);
    });
  });

  describe('Changes option set to undefined', () => {
    const createBatchGrid = (): ReturnType<typeof createDataGrid> => createDataGrid({
      keyExpr: 'ID',
      dataSource,
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
    });

    it('should drop the pending changes', async () => {
      const { instance } = await createBatchGrid();
      instance.cellValue(0, 'FirstName', 'Updated');

      instance.option('editing.changes', undefined);
      await flushAsync();

      expect(instance.hasEditData()).toBe(false);
      expect(instance.cellValue(0, 'FirstName')).toBe('John');
    });

    it('should keep the grid without changes', async () => {
      const { instance } = await createBatchGrid();

      instance.option('editing.changes', undefined);
      await flushAsync();

      expect(instance.hasEditData()).toBe(false);
    });
  });

  describe('Edit column visibility with an allowDeleting callback', () => {
    it('should be a boolean', async () => {
      const { instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        editing: {
          mode: 'row',
          allowDeleting: (): boolean => true,
        },
      });

      expect(instance.columnOption('command:edit', 'visible')).toBe(true);
    });
  });

  describe('Edit form in form mode', () => {
    it('should render the form in the edited row', async () => {
      const { $container, instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        columns: ['FirstName', 'LastName'],
        editing: {
          mode: 'form',
          allowUpdating: true,
        },
      });

      instance.editRow(0);
      await flushAsync();

      expect($container.find('.dx-datagrid-edit-form .dx-form')).toHaveLength(1);
    });
  });

  describe('Data source replaced while there are changes', () => {
    it('should drop the changes of removed rows and keep the others', async () => {
      const { instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        editing: {
          mode: 'batch',
          allowUpdating: true,
          allowAdding: true,
        },
      });

      instance.cellValue(0, 'FirstName', 'Updated 1');
      instance.cellValue(1, 'FirstName', 'Updated 2');
      await instance.addRow();
      await flushAsync();

      instance.option('dataSource', dataSource.slice(1));
      await flushAsync();

      const changes = instance.option('editing.changes');
      expect(changes).toHaveLength(2);
      expect(changes).toEqual(expect.arrayContaining([
        expect.objectContaining({ type: 'update', key: 2 }),
        expect.objectContaining({ type: 'insert' }),
      ]));
    });
  });

  describe('Event handlers after the editing controller re-inits', () => {
    it('should call each handler once', async () => {
      const onEditCanceled = jest.fn();
      const onInitNewRow = jest.fn();
      const { instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        editing: {
          mode: 'row',
          allowUpdating: true,
          allowAdding: true,
        },
        onEditCanceled,
        onInitNewRow,
      });

      instance.editRow(0);
      instance.cancelEditData();
      await instance.addRow();
      await flushAsync();

      expect(onEditCanceled).toHaveBeenCalledTimes(1);
      expect(onInitNewRow).toHaveBeenCalledTimes(1);
    });
  });

  describe('Deleting a row with an index out of range', () => {
    it('should do nothing while a row is being edited', async () => {
      const { instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        editing: {
          mode: 'row',
          allowUpdating: true,
          allowDeleting: true,
        },
      });
      instance.editRow(0);
      await flushAsync();

      expect(() => { instance.deleteRow(dataSource.length); }).not.toThrow();
      expect(instance.option('editing.changes')).toEqual([]);
      expect(instance.option('editing.editRowKey')).toBe(1);
    });
  });

  describe('Pending operations when the editing controller re-inits', () => {
    it('should reject each pending operation with "cancel"', async () => {
      const { instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
      });
      const editingController = instance.getController('editing');
      const operations = [Deferred<unknown>(), Deferred<unknown>(), Deferred<unknown>()];
      const onFail = jest.fn();
      operations.forEach((operation) => {
        editingController.addDeferred(operation);
        operation.fail(onFail);
      });

      instance.cancelEditData();

      expect(operations.map((operation) => operation.state())).toEqual(['rejected', 'rejected', 'rejected']);
      expect(onFail.mock.calls).toEqual([['cancel'], ['cancel'], ['cancel']]);
    });

    it('should not apply an async cell value that resolves after cancelEditData', async () => {
      const setCellValueResults = [Deferred<undefined>(), Deferred<undefined>()];
      let setCellValueCallCount = 0;
      const { instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        columns: [{
          dataField: 'FirstName',
          setCellValue(newData, value): PromiseLike<void> {
            newData.FirstName = value;
            const result = setCellValueResults[setCellValueCallCount];
            setCellValueCallCount += 1;
            return result.promise();
          },
        }],
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
      });

      instance.cellValue(0, 'FirstName', 'Updated 1');
      instance.cellValue(1, 'FirstName', 'Updated 2');
      instance.cancelEditData();
      setCellValueResults.forEach((result) => { result.resolve(); });
      await flushAsync();

      expect(instance.option('editing.changes')).toEqual([]);
    });
  });
});
