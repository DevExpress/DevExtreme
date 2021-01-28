import { getUpdatedOptions } from '../get_updated_options';

describe('get_updated_options', () => {
  it('simple props changed', () => {
    expect(getUpdatedOptions({ visible: true }, { visible: false }))
      .toEqual([
        { path: 'visible', value: false },
      ]);
  });

  it('no props changed', () => {
    expect(getUpdatedOptions({ visible: true }, { visible: true }))
      .toEqual([]);
  });

  it('new props', () => {
    expect(getUpdatedOptions({ visible: true }, { visible: true, enabled: false } as any))
      .toEqual([
        { path: 'enabled', value: false },
      ]);
  });

  it('old and new is undefined', () => {
    expect(getUpdatedOptions({ columns: undefined }, { columns: undefined }))
      .toEqual([]);
  });

  it('eventcallback props changed', () => {
    const callback1 = () => {};
    const callback2 = () => {};
    expect(getUpdatedOptions(
      { visible: true, onCellClick: callback1 },
      { visible: true, onCellClick: callback2 },
    ))
      .toEqual([
        { path: 'onCellClick', value: callback2 },
      ]);
  });

  it('nested props changed', () => {
    expect(getUpdatedOptions(
      { editing: { allowAdding: true } },
      { editing: { allowAdding: false } },
    ))
      .toEqual([
        { path: 'editing.allowAdding', value: false },
      ]);
  });

  it('nested props changed to empty', () => {
    expect(getUpdatedOptions({ visible: true, editing: { allowAdding: true } }, { visible: true }))
      .toEqual([
        { path: 'editing', value: undefined },
      ]);
  });

  it('type of value in props changed', () => {
    expect(getUpdatedOptions(
      { visible: true, filterValue: [] },
      { visible: true, filterValue: '1' },
    ))
      .toEqual([
        { path: 'filterValue', value: '1' },
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
        { path: 'columns[1].visible', value: false },
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
        { path: 'columns', value: columns },
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
});
