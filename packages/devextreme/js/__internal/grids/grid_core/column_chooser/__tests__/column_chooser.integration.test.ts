import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import errors from '@js/ui/widget/ui.errors';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

describe('Bugs', () => {
  beforeEach(() => {
    beforeTest();
    jest.spyOn(errors, 'log').mockImplementation(jest.fn());
    jest.spyOn(errors, 'Error').mockImplementation(() => ({}));
  });
  afterEach(afterTest);

  describe('T1311329 - DataGrid - Column chooser hides a banded column on using search and recursive selection', () => {
    it('should not hide banded column when using search (two levels)', async () => {
      const { instance, component } = await createDataGrid({
        dataSource: [
          {
            id: 1,
            name: 'Name 1',
            value: 10,
            phone: 'Banded 1',
            email: 'Banded 2',
            skype: 'Banded 3',
          },
        ],
        columnChooser: {
          enabled: true,
          search: {
            enabled: true,
          },
          mode: 'select',
          selection: {
            recursive: true,
            selectByClick: true,
            allowSelectAll: true,
          },
        },
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            caption: 'Contacts',
            columns: [
              {
                dataField: 'phone',
                visible: false,
              },
              {
                dataField: 'email',
              },
              {
                dataField: 'skype',
              },
            ],
          },
        ],
      });

      let visibleColumnsLevel0 = instance.getVisibleColumns(0);
      let visibleColumnsLevel1 = instance.getVisibleColumns(1);

      expect(visibleColumnsLevel0.find((col) => col.caption === 'Contacts')).toBeDefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'phone')).toBeUndefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'email')).toBeDefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'skype')).toBeDefined();
      expect(visibleColumnsLevel0.find((col) => col.dataField === 'name')).toBeDefined();

      instance.showColumnChooser();
      jest.runAllTimers();

      const columnChooser = component.getColumnChooser();
      expect(columnChooser.isVisible()).toBe(true);

      columnChooser.searchColumn('n');
      jest.runAllTimers();

      columnChooser.toggleColumn('Name');
      jest.runAllTimers();

      visibleColumnsLevel0 = instance.getVisibleColumns(0);
      visibleColumnsLevel1 = instance.getVisibleColumns(1);

      expect(visibleColumnsLevel0.find((col) => col.caption === 'Contacts')).toBeDefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'phone')).toBeUndefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'email')).toBeDefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'skype')).toBeDefined();
      expect(visibleColumnsLevel0.find((col) => col.dataField === 'name')).toBeUndefined();
    });

    it('should not hide banded column when using search (three levels)', async () => {
      const { instance, component } = await createDataGrid({
        dataSource: [],
        columnChooser: {
          enabled: true,
          search: {
            enabled: true,
          },
          mode: 'select',
          selection: {
            recursive: true,
            selectByClick: true,
            allowSelectAll: true,
          },
        },
        columns: [
          {
            caption: 'band_level1',
            columns: [
              {
                caption: 'band_level2',
                columns: [
                  {
                    dataField: 'data1_level3',
                    visible: false,
                  },
                  {
                    dataField: 'data2_level3',
                  },
                ],
              },
              {
                dataField: 'data1_level2',
              },
              {
                dataField: 'data2_level2',
              },
            ],
          },
          {
            dataField: 'data1_level1',
          },
        ],
      });

      let visibleColumnsLevel0 = instance.getVisibleColumns(0);
      let visibleColumnsLevel1 = instance.getVisibleColumns(1);
      let visibleColumnsLevel2 = instance.getVisibleColumns(2);

      expect(visibleColumnsLevel0.find((col) => col.caption === 'band_level1')).toBeDefined();
      expect(visibleColumnsLevel0.find((col) => col.dataField === 'data1_level1')).toBeDefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'data1_level2')).toBeDefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'data2_level2')).toBeDefined();
      expect(visibleColumnsLevel1.find((col) => col.caption === 'band_level2')).toBeDefined();
      expect(visibleColumnsLevel2.find((col) => col.dataField === 'data1_level3')).toBeUndefined();
      expect(visibleColumnsLevel2.find((col) => col.dataField === 'data2_level3')).toBeDefined();

      instance.showColumnChooser();
      jest.runAllTimers();

      const columnChooser = component.getColumnChooser();
      expect(columnChooser.isVisible()).toBe(true);

      columnChooser.searchColumn('1');
      jest.runAllTimers();

      columnChooser.toggleColumn('Data 1 level 1');
      jest.runAllTimers();

      visibleColumnsLevel0 = instance.getVisibleColumns(0);
      visibleColumnsLevel1 = instance.getVisibleColumns(1);
      visibleColumnsLevel2 = instance.getVisibleColumns(2);

      expect(visibleColumnsLevel0.find((col) => col.caption === 'band_level1')).toBeDefined();
      expect(visibleColumnsLevel0.find((col) => col.dataField === 'data1_level1')).toBeUndefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'data1_level2')).toBeDefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'data2_level2')).toBeDefined();
      expect(visibleColumnsLevel1.find((col) => col.caption === 'band_level2')).toBeDefined();
      expect(visibleColumnsLevel2.find((col) => col.dataField === 'data1_level3')).toBeUndefined();
      expect(visibleColumnsLevel2.find((col) => col.dataField === 'data2_level3')).toBeDefined();
    });

    it('should hide banded column by click', async () => {
      const { instance, component } = await createDataGrid({
        dataSource: [
          {
            id: 1,
            name: 'Name 1',
            value: 10,
            phone: 'Banded 1',
            email: 'Banded 2',
            skype: 'Banded 3',
          },
        ],
        columnChooser: {
          enabled: true,
          search: {
            enabled: true,
          },
          mode: 'select',
          selection: {
            recursive: true,
            selectByClick: true,
            allowSelectAll: true,
          },
        },
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            caption: 'Contacts',
            columns: [
              {
                dataField: 'phone',
                visible: false,
              },
              {
                dataField: 'email',
              },
              {
                dataField: 'skype',
              },
            ],
          },
        ],
      });
      let visibleColumnsLevel0 = instance.getVisibleColumns(0);
      let visibleColumnsLevel1 = instance.getVisibleColumns(1);

      expect(visibleColumnsLevel0.find((col) => col.caption === 'Contacts')).toBeDefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'phone')).toBeUndefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'email')).toBeDefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'skype')).toBeDefined();

      instance.showColumnChooser();
      jest.runAllTimers();

      const columnChooser = component.getColumnChooser();
      expect(columnChooser.isVisible()).toBe(true);

      columnChooser.toggleColumn('Contacts');
      jest.runAllTimers();

      visibleColumnsLevel0 = instance.getVisibleColumns(0);
      visibleColumnsLevel1 = instance.getVisibleColumns(1);

      expect(visibleColumnsLevel0.find((col) => col.caption === 'Contacts')).toBeDefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'phone')).toBeDefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'email')).toBeDefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'skype')).toBeDefined();

      columnChooser.toggleColumn('Contacts');
      jest.runAllTimers();

      visibleColumnsLevel0 = instance.getVisibleColumns(0);
      visibleColumnsLevel1 = instance.getVisibleColumns(1);

      expect(visibleColumnsLevel0.find((col) => col.caption === 'Contacts')).toBeUndefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'phone')).toBeUndefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'email')).toBeUndefined();
      expect(visibleColumnsLevel1.find((col) => col.dataField === 'skype')).toBeUndefined();
    });
  });
});
