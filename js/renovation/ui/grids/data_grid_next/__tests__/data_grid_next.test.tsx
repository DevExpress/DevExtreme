import React from 'react';
import { mount } from 'enzyme';
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GetterExtender } from '../../../../utils/plugin/getter_extender';
import { Plugins } from '../../../../utils/plugin/context';
import { ValueSetter } from '../../../../utils/plugin/value_setter';
import {
  DataGridNext, viewFunction as DataGridView, DataGridNextProps,
  LocalData, Columns, KeyExprPlugin, VisibleColumns,
  LocalVisibleItems, VisibleRows, VisibleDataRows, TotalCount, DataStateValue, RemoteOperations,
  LocalDataState,
  LoadOptionsValue,
} from '../data_grid_next';
import { Widget } from '../../../common/widget';
import CustomStore from '../../../../../data/custom_store';
import { generateData, generateRows } from './test_data';

describe('DataGridNext', () => {
  describe('View', () => {
    it('default render', () => {
      const props = new DataGridNextProps();
      const viewModel = {
        props,
        aria: { role: 'presentation' },
        classes: '',
        restAttributes: { 'rest-attributes': 'true' },
        columns: [{ dataField: 'id' }],
        keyExpr: 'id',
        localData: [],
        dataState: { data: [], totalCount: 0 },
        setDataState: () => {},
      } as Partial<DataGridNext>;
      const tree = mount(<DataGridView {...viewModel as any} /> as any);

      expect(tree.find(Widget).first().props()).toMatchObject({
        aria: { role: 'presentation' },
        classes: '',
        'rest-attributes': 'true',
      });

      expect(tree.find(ValueSetter).at(0).props()).toMatchObject({
        type: LocalData, value: viewModel.localData,
      });
      expect(tree.find(ValueSetter).at(1).props()).toMatchObject({
        type: Columns, value: viewModel.columns,
      });
      expect(tree.find(ValueSetter).at(2).props()).toMatchObject({
        type: KeyExprPlugin, value: viewModel.keyExpr,
      });
      expect(tree.find(ValueSetter).at(3).props()).toMatchObject({
        type: RemoteOperations, value: props.remoteOperations,
      });
      expect(tree.find(ValueSetter).at(4).props()).toMatchObject({
        type: DataStateValue, value: viewModel.dataState,
      });

      expect(tree.find(GetterExtender).at(0).props()).toMatchObject({
        type: VisibleColumns, order: -1, value: Columns,
      });
      expect(tree.find(GetterExtender).at(1).props()).toMatchObject({
        type: LocalVisibleItems, order: -1, value: LocalData,
      });
      expect(tree.find(GetterExtender).at(2).props()).toMatchObject({
        type: VisibleRows, order: -1, value: VisibleDataRows,
      });
    });

    it('render with dataSource and 1 column', () => {
      const props = new DataGridNextProps();
      props.dataSource = [{ id: 1 }, { id: 2 }];
      const viewProps = {
        props,
        visibleRows: [{ data: { id: 1 }, rowType: 'data' }, { data: { id: 2 }, rowType: 'data' }],
        visibleColumns: [{ caption: 'id', calculateCellValue: (data) => data.id }],
      } as Partial<DataGridNext>;
      const tree = mount(<DataGridView {...viewProps as any} /> as any);

      expect(tree.find('tr')).toHaveLength(3);
      expect(tree.find('td')).toHaveLength(3);
      expect(tree.find('td').at(0).children().text()).toEqual('id');
      expect(tree.find('td').at(1).text()).toEqual('1');
      expect(tree.find('td').at(2).text()).toEqual('2');
    });

    it('render with dataSource and 2 columns', () => {
      const props = new DataGridNextProps();
      props.dataSource = [{ id: 1, name: 'name 1' }];
      const viewProps = {
        props,
        visibleRows: [{ data: { id: 1, name: 'name 1' }, rowType: 'data' }],
        visibleColumns: [
          { caption: 'id', calculateCellValue: (data) => data.id },
          { caption: 'name', calculateCellValue: (data) => data.name },
        ],
      } as Partial<DataGridNext>;
      const tree = mount(<DataGridView {...viewProps as any} /> as any);

      expect(tree.find('tr')).toHaveLength(2);
      expect(tree.find('td')).toHaveLength(4);
      expect(tree.find('td').at(0).children().text()).toEqual('id');
      expect(tree.find('td').at(1).children().text()).toEqual('name');
      expect(tree.find('td').at(2).text()).toEqual('1');
      expect(tree.find('td').at(3).text()).toEqual('name 1');
    });
  });

  describe('Getters', () => {
    describe('aria', () => {
      it('should have role "presentation"', () => {
        expect(new DataGridNext({}).aria).toEqual({ role: 'presentation' });
      });
    });

    describe('containerClasses', () => {
      it('classes by default if showBorders is true"', () => {
        expect(new DataGridNext({
          showBorders: true,
        }).containerClasses).toEqual('dx-datagrid dx-gridbase-container dx-datagrid-borders');
      });

      it('classes if showBorders is false"', () => {
        expect(new DataGridNext({
          showBorders: false,
        }).containerClasses).toEqual('dx-datagrid dx-gridbase-container');
      });
    });

    describe('columns', () => {
      it('should handle user input', () => {
        const grid = new DataGridNext({
          columns: ['id', 'name'],
        });

        expect(grid.columns).toMatchObject([
          {
            dataField: 'id',
            caption: 'Id',
            alignment: undefined,
            format: undefined,
            calculateCellValue: expect.any(Function),
          },
          {
            dataField: 'name',
            caption: 'Name',
            alignment: undefined,
            format: undefined,
            calculateCellValue: expect.any(Function),
          },
        ]);
      });

      it('should process dataType', () => {
        const grid = new DataGridNext({
          columns: [{
            dataField: 'id',
            dataType: 'number',
          }, {
            dataField: 'birthDate',
            dataType: 'date',
          }],
        });

        expect(grid.columns).toMatchObject([
          {
            dataField: 'id',
            caption: 'Id',
            alignment: 'right',
            format: undefined,
            calculateCellValue: expect.any(Function),
          },
          {
            dataField: 'birthDate',
            caption: 'Birth Date',
            alignment: undefined,
            format: 'shortDate',
            calculateCellValue: expect.any(Function),
          },
        ]);
      });

      it('should process column without dataField', () => {
        const grid = new DataGridNext({
          columns: [{
          }],
        });

        expect(grid.columns).toMatchObject([
          {
            caption: '',
            alignment: undefined,
            format: undefined,
            calculateCellValue: expect.any(Function),
          },
        ]);
      });

      it('should pass parameters', () => {
        const calculateCellValue = (data) => (data.id as number) * 10;
        const grid = new DataGridNext({
          columns: [{
            dataField: 'id',
            caption: '#',
            format: '#0',
            alignment: 'right',
            calculateCellValue,
          }],
        });

        expect(grid.columns).toMatchObject([
          {
            dataField: 'id',
            caption: '#',
            alignment: 'right',
            format: '#0',
            calculateCellValue,
          },
        ]);
      });
    });

    describe('keyExpr', () => {
      it('should return keyExpr prop', () => {
        const grid = new DataGridNext({
          keyExpr: 'some key',
        });

        expect(grid.keyExpr).toEqual('some key');
      });

      it('should return key from Store', () => {
        const grid = new DataGridNext({
          dataSource: new CustomStore({
            key: 'my_key',
            load: () => [],
          }),
        });

        expect(grid.keyExpr).toEqual('my_key');
      });

      it('should return null if user did not specified it', () => {
        const grid = new DataGridNext({});

        expect(grid.keyExpr).toEqual(null);
      });
    });

    describe('localData', () => {
      it('should return dataSource prop if it is array', () => {
        const dataSource = [{ id: 1 }];
        const grid = new DataGridNext({
          dataSource,
        });

        expect(grid.localData).toEqual(dataSource);
      });

      it('should return loaded data if dataSource is not array', () => {
        const grid = new DataGridNext({
          dataSource: new CustomStore(),
        });
        grid.loadedData = [{ id: 1 }];

        expect(grid.localData).toEqual(grid.loadedData);
      });
    });

    describe('dataState', () => {
      it('should return default value if dataState prop is not defined', () => {
        const grid = new DataGridNext({
        });

        expect(grid.dataState).toEqual({ data: [], totalCount: 0 });
      });

      it('should return dataState prop if it is defined', () => {
        const dataState = { data: [{}], totalCount: 100 };
        const grid = new DataGridNext({
          dataState,
        });

        expect(grid.dataState).toEqual(dataState);
      });
    });
  });

  describe('Effects', () => {
    describe('updateVisibleRows', () => {
      const watchMock = jest.fn();
      const grid = new DataGridNext({});
      grid.plugins = {
        watch: watchMock,
      } as any;

      it('should update visibleRows', () => {
        grid.updateVisibleRows();

        const data = generateRows(10);

        const callback = watchMock.mock.calls[0][1];
        callback(data);

        expect(grid.visibleRows).toBe(data);
      });
    });

    describe('updateVisibleColumns', () => {
      const watchMock = jest.fn();
      const grid = new DataGridNext({});
      grid.plugins = {
        watch: watchMock,
      } as any;

      it('should update visibleColumns', () => {
        grid.updateVisibleColumns();

        const columns = [{ dataField: 'id' }];

        const callback = watchMock.mock.calls[0][1];
        callback(columns);

        expect(grid.visibleColumns).toBe(columns);
      });
    });

    describe('updateDataStateFromLocal', () => {
      it('should not update dataState if LocalData is undefined', () => {
        const grid = new DataGridNext({});
        grid.props = new DataGridNextProps();
        grid.plugins = new Plugins();
        grid.plugins.set(LocalData, undefined);

        grid.updateDataStateFromLocal();

        expect(grid.props.dataState).toBeUndefined();
      });

      it('should update dataState', () => {
        const data = generateData(5);
        const grid = new DataGridNext({});
        grid.props = new DataGridNextProps();
        grid.plugins = new Plugins();
        grid.plugins.set(LocalData, data);
        grid.plugins.extend(LocalVisibleItems, -1, () => data.slice(0, 2));

        grid.updateDataStateFromLocal();

        expect(grid.props.dataState).toEqual({
          data: data.slice(0, 2),
          totalCount: data.length,
        });
      });
    });

    describe('updateDataSource', () => {
      it('should not load data if array is assigned to dataSource', () => {
        const data = [{ id: 1 }];
        const grid = new DataGridNext({
          dataSource: data,
        });
        grid.plugins = new Plugins();

        grid.loadDataSource();

        expect(grid.localData).toEqual(data);
      });

      it('should load data and assign to loadedData if remoteOperations is false', () => {
        const data = [{ id: 1 }];
        const grid = new DataGridNext({
          remoteOperations: false,
          dataSource: new CustomStore({
            load: () => data,
          }),
        });
        grid.plugins = new Plugins();

        grid.loadDataSource();

        expect(grid.localData).toEqual(data);
      });

      it('should load data on loadOptions change if cacheEnabled is false', () => {
        const loadMock = jest.fn(() => []);
        const grid = new DataGridNext({
          cacheEnabled: false,
          dataSource: new CustomStore({
            load: loadMock,
          }),
        });
        grid.plugins = new Plugins();

        grid.loadDataSource();

        grid.plugins.extend(LoadOptionsValue, 1, () => ({}));

        expect(loadMock).toHaveBeenCalledTimes(2);
      });

      it('should not load data on loadOptions change if cacheEnabled is true', () => {
        const loadMock = jest.fn(() => []);
        const grid = new DataGridNext({
          cacheEnabled: true,
          dataSource: new CustomStore({
            load: loadMock,
          }),
        });
        grid.plugins = new Plugins();

        grid.loadDataSource();

        grid.plugins.extend(LoadOptionsValue, 1, () => ({}));

        expect(loadMock).toHaveBeenCalledTimes(1);
      });

      it('should load data and assign to dataState if remoteOperations is true and promise resolves array', async () => {
        const data = [{ id: 1 }];

        const grid = new DataGridNext({
          remoteOperations: true,
          dataSource: new CustomStore({
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            load: (_options) => Promise.resolve(data),
          }),
        });
        grid.plugins = new Plugins();

        grid.loadDataSource();

        await Promise.resolve();

        expect(grid.props.dataState).toEqual({
          data,
        });
      });

      it('should load data and assign to dataState if remoteOperations is true and promise resolves object', async () => {
        const dataState = {
          data: [{ id: 1 }],
          totalCount: 5,
        };
        const loadOptions = { skip: 0, take: 1 };

        const grid = new DataGridNext({
          remoteOperations: true,
          dataSource: new CustomStore({
            load: () => Promise.resolve(dataState),
          }),
        });
        grid.plugins = new Plugins();
        grid.plugins.extend(LoadOptionsValue, 1, () => loadOptions);

        grid.loadDataSource();

        await Promise.resolve();

        expect(grid.props.dataState).toEqual(dataState);
      });

      it('should load data with loadOptions', () => {
        const loadOptions = { skip: 0, take: 1 };

        const loadMock = jest.fn(() => []);

        const grid = new DataGridNext({
          dataSource: new CustomStore({
            load: loadMock,
          }),
        });
        grid.plugins = new Plugins();
        grid.plugins.extend(LoadOptionsValue, 1, () => loadOptions);

        grid.loadDataSource();

        expect(loadMock).toHaveBeenCalledWith(loadOptions);
      });

      it('should call onDataErrorOcurred event if load data rejects result', async () => {
        const onDataErrorOccurredMock = jest.fn();
        const error = new Error('My error');

        const grid = new DataGridNext({
          onDataErrorOccurred: onDataErrorOccurredMock,
          dataSource: new CustomStore({
            load: () => Promise.reject(error),
          }),
        });
        grid.plugins = new Plugins();

        grid.loadDataSource();

        await Promise.resolve();

        expect(onDataErrorOccurredMock).toHaveBeenCalledWith({
          error,
        });
      });

      it('should not cause errors if load data rejects result', async () => {
        const error = new Error('My error');

        const grid = new DataGridNext({
          dataSource: new CustomStore({
            load: () => Promise.reject(error),
          }),
        });
        grid.plugins = new Plugins();

        grid.loadDataSource();

        await Promise.resolve();

        expect.assertions(0);
      });
    });
  });

  describe('Methods', () => {
    describe('refresh', () => {
      const createDataGridLightWithStore = () => {
        const loadMock = jest.fn(() => []);
        const grid = new DataGridNext({
          dataSource: new CustomStore({
            load: loadMock,
          }),
        });
        return { loadMock, grid };
      };

      it('refresh method should load data', () => {
        const { grid, loadMock } = createDataGridLightWithStore();

        grid.refresh();

        expect(loadMock).toHaveBeenCalled();
      });

      it('refresh method should load data with correct loadOptions', () => {
        const loadOptions = { skip: 0, take: 5 };
        const { grid, loadMock } = createDataGridLightWithStore();

        grid.plugins.extend(LoadOptionsValue, 1, () => loadOptions);

        grid.refresh();

        expect(loadMock).toHaveBeenCalledWith(loadOptions);
      });

      it('refresh method should load data with correct loadOptions is empty', () => {
        const { grid, loadMock } = createDataGridLightWithStore();
        grid.plugins.extend(LoadOptionsValue, 1, () => undefined);

        grid.refresh();

        expect(loadMock).toHaveBeenCalledWith({});
      });
    });
  });

  describe('Selectors', () => {
    describe('TotalCount', () => {
      it('should return totalCount of DataState', () => {
        const plugins = new Plugins();

        plugins.set(DataStateValue, { data: generateData(3), totalCount: 10 });

        expect(plugins.getValue(TotalCount)).toBe(10);
      });

      it('should return data length of DataState if totalCount is not defined', () => {
        const plugins = new Plugins();

        plugins.set(DataStateValue, { data: generateData(3) });

        expect(plugins.getValue(TotalCount)).toBe(3);
      });
    });

    describe('VisibleDataRows', () => {
      it('should wrap item into row object if keyExpr is defined', () => {
        const plugins = new Plugins();

        const data = generateData(2);

        plugins.set(DataStateValue, {
          data,
          totalCount: data.length,
        });
        plugins.set(KeyExprPlugin, 'id');

        expect(plugins.getValue(VisibleDataRows)).toEqual([{
          rowType: 'data',
          key: 0,
          data: data[0],
        }, {
          rowType: 'data',
          key: 1,
          data: data[1],
        }]);
      });

      it('should wrap item into row object if keyExpr is not defined', () => {
        const plugins = new Plugins();

        const data = generateData(2);

        plugins.set(DataStateValue, {
          data,
          totalCount: data.length,
        });
        plugins.set(KeyExprPlugin, null);

        expect(plugins.getValue(VisibleDataRows)).toEqual([{
          rowType: 'data',
          key: data[0],
          data: data[0],
        }, {
          rowType: 'data',
          key: data[1],
          data: data[1],
        }]);
      });
    });
  });

  describe('LocalDataState', () => {
    it('should return undefined if LocalData is undefined', () => {
      const plugins = new Plugins();

      const data = generateData(5);

      plugins.set(LocalData, undefined);
      plugins.extend(LocalVisibleItems, -1, () => data.slice(0, 2));

      expect(plugins.getValue(LocalDataState)).toEqual(undefined);
    });

    it('should return object with empty data if LocalVisibleItems is undefined', () => {
      const plugins = new Plugins();

      const data = generateData(5);

      plugins.set(LocalData, data);
      plugins.extend(LocalVisibleItems, -1, () => undefined);

      expect(plugins.getValue(LocalDataState)).toEqual({
        data: [],
        totalCount: data.length,
      });
    });

    it('should return DataState object', () => {
      const plugins = new Plugins();

      const data = generateData(5);

      plugins.set(LocalData, data);
      plugins.extend(LocalVisibleItems, -1, () => data.slice(0, 2));

      expect(plugins.getValue(LocalDataState)).toEqual({
        data: data.slice(0, 2),
        totalCount: data.length,
      });
    });
  });
});
