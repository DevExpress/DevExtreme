import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import DataGrid from '@js/ui/data_grid';
import eventsEngine from '@ts/events/core/events_engine';

import type { DataGridInstance } from '../../__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '../../__tests__/__mock__/helpers/utils';
import type { CellBasedEditingController } from '../types';

const getEditingController = (
  instance: DataGridInstance,
): CellBasedEditingController => instance
  .getController('editing') as CellBasedEditingController;

describe('DataGrid cell-based editing', () => {
  const dataSource = [
    { ID: 1, FirstName: 'John', LastName: 'Heart' },
    { ID: 2, FirstName: 'Olivia', LastName: 'Peyton' },
  ];

  const clickElement = (element: Element | null): void => {
    eventsEngine.trigger(element, 'dxpointerdown');
    eventsEngine.trigger(element, 'dxpointerup');
    eventsEngine.trigger(element, 'dxclick');
  };

  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('Document handlers after dispose', () => {
    it('should not handle a document click', async () => {
      const { $container, instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
      });
      const editingController = getEditingController(instance);

      instance.dispose();
      $container.remove();

      const getEditMode = jest.spyOn(editingController, 'getEditMode');
      eventsEngine.trigger(document, 'dxpointerdown');
      eventsEngine.trigger(document, 'dxclick');

      expect(getEditMode).not.toHaveBeenCalled();
    });
  });

  describe('Document click while a cell is edited', () => {
    const appendedElements: HTMLElement[] = [];
    const otherGrids: DataGrid[] = [];

    const cellEditingOptions = {
      mode: 'cell' as const,
      allowUpdating: true,
    };

    const createCellEditingGrid = (): ReturnType<typeof createDataGrid> => createDataGrid({
      keyExpr: 'ID',
      dataSource,
      columns: ['FirstName', 'LastName'],
      editing: cellEditingOptions,
    });

    const editFirstCell = async (): ReturnType<typeof createDataGrid> => {
      const grid = await createCellEditingGrid();

      grid.instance.editCell(0, 'FirstName');
      await flushAsync();

      return grid;
    };

    const appendToBody = (
      className: string,
      parent: HTMLElement = document.body,
      tagName = 'div',
    ): HTMLElement => {
      const element = document.createElement(tagName);
      element.className = className;
      parent.appendChild(element);
      appendedElements.push(element);

      return element;
    };

    const createOtherGrid = (container: HTMLElement): DataGrid => {
      const grid = new DataGrid(container, {
        keyExpr: 'ID',
        dataSource: [{ ID: 1, Name: 'Other' }],
        editing: cellEditingOptions,
      });
      otherGrids.push(grid);
      jest.runAllTimers();

      return grid;
    };

    const clickCellOfOtherGrid = (container: HTMLElement): void => {
      createOtherGrid(container);
      clickElement(container.querySelector('.dx-data-row > td'));
    };

    afterEach(() => {
      otherGrids.splice(0).forEach((grid) => { grid.dispose(); });
      appendedElements.splice(0).forEach((element) => { element.remove(); });
    });

    it('should close the cell on a click outside the grid', async () => {
      const { instance } = await editFirstCell();

      eventsEngine.trigger(document.body, 'dxclick');
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBeUndefined();
    });

    it('should keep the cell open after a pointer down in its editor and a click elsewhere (T727856)', async () => {
      const { $container, instance } = await editFirstCell();

      eventsEngine.trigger($container.find('.dx-editor-cell input').get(0), 'dxpointerdown');
      eventsEngine.trigger(document.body, 'dxclick');
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBe('FirstName');
    });

    it('should close the cell on a pointer down and a click on the same input outside the grid', async () => {
      const { instance } = await editFirstCell();

      clickElement(appendToBody('', document.body, 'input'));
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBeUndefined();
    });

    it('should keep the cell open on a click inside a drop-down editor overlay', async () => {
      const { instance } = await editFirstCell();

      eventsEngine.trigger(appendToBody('dx-dropdowneditor-overlay'), 'dxclick');
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBe('FirstName');
    });

    it('should close the cell on a click elsewhere in a drop-down editor overlay that contains the grid', async () => {
      const overlay = appendToBody('dx-dropdowneditor-overlay');
      const gridInOverlay = createOtherGrid(appendToBody('', overlay));
      gridInOverlay.editCell(0, 'Name');
      await flushAsync();

      eventsEngine.trigger(appendToBody('', overlay), 'dxclick');
      await flushAsync();

      expect(gridInOverlay.option('editing.editColumnName')).toBeUndefined();
    });

    it('should keep the cell open on a click on the focus overlay', async () => {
      const { instance } = await editFirstCell();

      eventsEngine.trigger(appendToBody('dx-datagrid-focus-overlay'), 'dxclick');
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBe('FirstName');
    });

    it('should keep the cell open on a click on the add row button', async () => {
      const { instance } = await editFirstCell();

      eventsEngine.trigger(appendToBody('dx-datagrid-addrow-button'), 'dxclick');
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBe('FirstName');
    });

    it('should close the cell on a click on the add row button in batch mode', async () => {
      const { instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        columns: ['FirstName', 'LastName'],
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
      });
      instance.editCell(0, 'FirstName');
      await flushAsync();

      eventsEngine.trigger(appendToBody('dx-datagrid-addrow-button'), 'dxclick');
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBeUndefined();
    });

    it('should keep the cell open on a click that ends a column resize', async () => {
      const { instance } = await editFirstCell();
      jest.spyOn(instance.getController('columnsResizer'), 'isResizing').mockReturnValue(true);

      eventsEngine.trigger(document.body, 'dxpointerup');
      eventsEngine.trigger(document.body, 'dxclick');
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBe('FirstName');
    });

    it('should keep the cell open on a click while its editor is being opened', async () => {
      const { instance } = await createCellEditingGrid();

      instance.editCell(0, 'FirstName');
      eventsEngine.trigger(document.body, 'dxclick');
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBe('FirstName');
    });

    it('should not close the edit cell on a click outside the grid in row mode', async () => {
      const { instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        columns: ['FirstName', 'LastName'],
        editing: {
          mode: 'row',
          allowUpdating: true,
        },
      });
      instance.editRow(0);
      await flushAsync();
      const closeEditCell = jest.spyOn(getEditingController(instance), 'closeEditCell');

      eventsEngine.trigger(document.body, 'dxclick');
      await flushAsync();

      expect(closeEditCell).not.toHaveBeenCalled();
    });

    it('should close the cell on a click inside another grid (T759458)', async () => {
      const { instance } = await editFirstCell();

      clickCellOfOtherGrid(appendToBody(''));
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBeUndefined();
    });

    it('should move editing to another cell of the same grid on a click on that cell', async () => {
      const { $container, instance } = await editFirstCell();

      clickElement($container.find('.dx-data-row > td').get(1));
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBe('LastName');
    });

    it('should keep the cell open on a click inside another grid that is disposed by this click (T896030)', async () => {
      const { instance } = await editFirstCell();
      const container = appendToBody('');
      const otherGrid = createOtherGrid(container);
      otherGrids.splice(otherGrids.indexOf(otherGrid), 1);
      eventsEngine.on(container, 'dxclick', () => { otherGrid.dispose(); });

      clickElement(container.querySelector('.dx-data-row > td'));
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBe('FirstName');
    });

    it('should keep the cell open on a click inside another grid in a drop-down editor overlay (T869676)', async () => {
      const { instance } = await editFirstCell();
      const overlay = appendToBody('dx-dropdowneditor-overlay');

      clickCellOfOtherGrid(appendToBody('', overlay));
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBe('FirstName');
    });
  });

  describe('editing.editColumnName option change', () => {
    it('should move the editor to the cell of the new column', async () => {
      const { $container, instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        columns: ['FirstName', 'LastName'],
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
      });
      instance.editCell(0, 'FirstName');
      await flushAsync();

      instance.option('editing.editColumnName', 'LastName');
      await flushAsync();

      const $cells = $container.find('.dx-data-row').eq(0).find('td');
      expect($cells.eq(0).hasClass('dx-editor-cell')).toBe(false);
      expect($cells.eq(1).hasClass('dx-editor-cell')).toBe(true);
    });

    it('should not repaint the edit row in row mode', async () => {
      const { $container, instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        columns: ['FirstName', 'LastName'],
        editing: {
          mode: 'row',
          allowUpdating: true,
        },
      });
      instance.editRow(0);
      await flushAsync();
      const editRow = $container.find('.dx-edit-row').get(0);

      instance.option('editing.editColumnName', 'LastName');
      await flushAsync();

      expect(editRow?.isConnected).toBe(true);
    });
  });

  describe('Click inside the grid while a cell is edited', () => {
    const createGridWithReadOnlyColumn = (
      allowUpdating: boolean | ((options: { row?: { rowIndex: number } }) => boolean) = true,
    ): ReturnType<typeof createDataGrid> => createDataGrid({
      keyExpr: 'ID',
      dataSource,
      columns: ['FirstName', { dataField: 'LastName', allowEditing: false }],
      editing: {
        mode: 'cell',
        allowUpdating,
      },
    });

    it('should close the cell on a click on a read-only cell', async () => {
      const { $container, instance } = await createGridWithReadOnlyColumn();
      instance.editCell(0, 'FirstName');
      await flushAsync();

      clickElement($container.find('.dx-data-row').eq(1).find('td').get(1));
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBeUndefined();
    });

    it('should close the cell on a click on a data row outside its cells', async () => {
      const { $container, instance } = await createGridWithReadOnlyColumn();
      instance.editCell(0, 'FirstName');
      await flushAsync();

      clickElement($container.find('.dx-data-row').get(1));
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBeUndefined();
    });

    it('should close the cell on a click on a group row', async () => {
      const { $container, instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        columns: ['FirstName', { dataField: 'LastName', groupIndex: 0 }],
        grouping: { allowCollapsing: false },
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
      });
      instance.editCell(1, 'FirstName');
      await flushAsync();

      clickElement($container.find('.dx-group-row').eq(0).find('td').get(1));
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBeUndefined();
    });

    it('should keep the cell open on a click on an editable cell of a row that cannot be updated', async () => {
      const { $container, instance } = await createGridWithReadOnlyColumn(
        ({ row }) => row?.rowIndex !== 1,
      );
      instance.editCell(0, 'FirstName');
      await flushAsync();

      clickElement($container.find('.dx-data-row').eq(1).find('td').get(0));
      await flushAsync();

      expect(instance.option('editing.editRowKey')).toBe(1);
      expect(instance.option('editing.editColumnName')).toBe('FirstName');
    });

    it('should keep a cell opened by editCell() in a read-only column open on a click on it', async () => {
      const { $container, instance } = await createGridWithReadOnlyColumn();
      instance.editCell(0, 'LastName');
      await flushAsync();

      clickElement($container.find('.dx-data-row').eq(0).find('td').get(1));
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBe('LastName');
    });

    it('should not close a cell on a click outside the grid when no cell is edited', async () => {
      const { instance } = await createGridWithReadOnlyColumn();
      const closeEditCell = jest.spyOn(getEditingController(instance), 'closeEditCell');

      clickElement(document.body);
      await flushAsync();

      expect(closeEditCell).not.toHaveBeenCalled();
    });
  });

  describe('Row click when editing starts on click', () => {
    it('should fire onRowClick on a click on a group row', async () => {
      const onRowClick = jest.fn();
      const { $container } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        columns: ['FirstName', { dataField: 'LastName', groupIndex: 0 }],
        grouping: { allowCollapsing: false },
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
        onRowClick,
      });

      clickElement($container.find('.dx-group-row').eq(0).find('td').get(1));
      await flushAsync();

      expect(onRowClick).toHaveBeenCalledTimes(1);
    });

    it('should not fire onRowClick on a click on a cell while a cell value is being set', async () => {
      const onRowClick = jest.fn();
      const { $container, instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        columns: [{
          dataField: 'FirstName',
          setCellValue: (): Promise<void> => new Promise(() => {}),
        }, 'LastName'],
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
        onRowClick,
      });
      instance.editCell(0, 'FirstName');
      await flushAsync();
      instance.cellValue(0, 'FirstName', 'Jack');

      clickElement($container.find('.dx-data-row').eq(1).find('td').get(1));
      await flushAsync();

      expect(onRowClick).toHaveBeenCalledTimes(0);
    });

    it('should edit the clicked cell when a command column comes first', async () => {
      const { $container, instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        columns: ['FirstName', 'LastName'],
        selection: {
          mode: 'multiple',
          showCheckBoxesMode: 'always',
        },
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
      });

      clickElement($container.find('.dx-data-row').eq(0).find('td').get(1));
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBe('FirstName');
    });
  });

  describe('Moving the edit cell with editCell()', () => {
    it('should remove the editor from the previous row', async () => {
      const { $container, instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        columns: ['FirstName', 'LastName'],
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
      });
      instance.editCell(0, 'FirstName');
      await flushAsync();

      instance.editCell(1, 'FirstName');
      await flushAsync();

      const $rows = $container.find('.dx-data-row');
      expect($rows.eq(0).find('td').eq(0).hasClass('dx-editor-cell')).toBe(false);
      expect($rows.eq(1).find('td').eq(0).hasClass('dx-editor-cell')).toBe(true);
    });

    it('should remove the editor from the previous cell when the new column always shows editors', async () => {
      const { $container, instance } = await createDataGrid({
        keyExpr: 'ID',
        dataSource,
        columns: ['FirstName', { dataField: 'LastName', showEditorAlways: true }],
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
      });
      instance.editCell(0, 'FirstName');
      await flushAsync();

      instance.editCell(0, 'LastName');
      await flushAsync();

      const $cells = $container.find('.dx-data-row').eq(0).find('td');
      expect($cells.eq(0).hasClass('dx-editor-cell')).toBe(false);
      expect(instance.option('editing.editColumnName')).toBe('LastName');
    });
  });
});
