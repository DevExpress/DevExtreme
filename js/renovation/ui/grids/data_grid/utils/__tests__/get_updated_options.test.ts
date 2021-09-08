import { getUpdatedOptions } from '../get_updated_options';

describe('get_updated_options', () => {
  class DummyDataSource {}

  it('simple props changed', () => {
    expect(getUpdatedOptions({ visible: true }, { visible: false }))
      .toEqual([
        { path: 'visible', value: false, previousValue: true },
      ]);
  });

  it('no props changed', () => {
    expect(getUpdatedOptions({ visible: true }, { visible: true }))
      .toEqual([]);
  });

  it('new props', () => {
    expect(getUpdatedOptions({ visible: true }, { visible: true, enabled: false } as any))
      .toEqual([
        { path: 'enabled', value: false, previousValue: undefined },
      ]);
  });

  it('old and new is undefined', () => {
    expect(getUpdatedOptions({ columns: undefined }, { columns: undefined }))
      .toEqual([]);
  });

  it('eventcallback props changed', () => {
    const callback1 = () => { };
    const callback2 = () => { };
    expect(getUpdatedOptions(
      { visible: true, onCellClick: callback1 },
      { visible: true, onCellClick: callback2 },
    ))
      .toEqual([
        { path: 'onCellClick', value: callback2, previousValue: callback1 },
      ]);
  });

  it('nested props changed', () => {
    expect(getUpdatedOptions(
      { editing: { allowAdding: true } },
      { editing: { allowAdding: false } },
    ))
      .toEqual([
        { path: 'editing.allowAdding', value: false, previousValue: true },
      ]);
  });

  it('nested props changed to empty', () => {
    expect(getUpdatedOptions({ visible: true, editing: { allowAdding: true } }, { visible: true }))
      .toEqual([
        { path: 'editing', value: undefined, previousValue: { allowAdding: true } },
      ]);
  });

  it('type of value in props changed', () => {
    expect(getUpdatedOptions(
      { visible: true, filterValue: [] },
      { visible: true, filterValue: '1' },
    ))
      .toEqual([
        { path: 'filterValue', value: '1', previousValue: [] },
      ]);
  });

  it('array item props changed', () => {
    const oldColumns = [{ id: 'field1', visible: true }, { id: 'field2', visible: true }];
    const columns = [oldColumns[0], { ...oldColumns[1], visible: false }];
    expect(getUpdatedOptions(
      { columns: oldColumns },
      { columns },
    ))
      .toEqual([
        { path: 'columns[1].visible', value: false, previousValue: true },
      ]);
  });

  it('array items count changed', () => {
    const oldColumns = [{ id: 'field1', visible: true }, { id: 'field2', visible: true }];
    const columns = [...oldColumns, { id: 'field3', visible: true }];
    expect(getUpdatedOptions(
      { columns: oldColumns },
      { columns },
    ))
      .toEqual([
        { path: 'columns', value: columns, previousValue: oldColumns },
      ]);
  });

  it('ignore react props', () => {
    expect(getUpdatedOptions(
      { key: 'grid1', ref: {}, children: [] } as any,
      { key: 'grid2', ref: {}, children: [] } as any,
    ))
      .toEqual([]);
  });

  it('not to deep equal for equal object', () => {
    const obj = { ref: null };
    const refObj = { ref: obj };
    obj.ref = refObj as any;
    const dataSource = [obj];
    expect(getUpdatedOptions(
      { dataSource },
      { dataSource },
    ))
      .toEqual([]);
  });

  it('use equal for compare array "dataSource"', () => {
    const oldObj = { dataSource: [] };
    const obj = { dataSource: [] };
    expect(getUpdatedOptions(oldObj, obj))
      .toEqual([{ path: 'dataSource', value: [], previousValue: [] }]);
  });

  it('prevProps is undefined', () => {
    const oldObj = { focusedRowKey: null };
    const obj = { focusedRowKey: 0 };
    expect(getUpdatedOptions(oldObj, obj))
      .toEqual([{ path: 'focusedRowKey', value: 0, previousValue: null }]);
  });

  it('deep diff only for plain object', () => {
    const oldObj = { dataSource: new DummyDataSource() };
    const obj = { dataSource: new DummyDataSource() };
    expect(getUpdatedOptions(oldObj, obj))
      .toEqual([{ path: 'dataSource', value: obj.dataSource, previousValue: oldObj.dataSource }]);
  });
});
