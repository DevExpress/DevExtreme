/* eslint-disable class-methods-use-this */
import DataGridComponent from '../data_grid';

const mockBeginUpdate = jest.fn();
const mockEndUpdate = jest.fn();

jest.mock('../common/component', () => class {
  beginUpdate() {
    mockBeginUpdate();
  }

  endUpdate() {
    mockEndUpdate();
  }
});

it('beginUpdate', () => {
  const beginUpdate = jest.fn();
  const component = new DataGridComponent({} as HTMLElement) as any;

  component.viewRef = {
    getComponentInstance: () => ({
      beginUpdate,
    }),
  };
  component.beginUpdate();

  expect(mockBeginUpdate).toBeCalledTimes(1);
  expect(beginUpdate).toBeCalledTimes(1);
});

it('endUpdate', () => {
  const endUpdate = jest.fn();
  const component = new DataGridComponent({} as HTMLElement) as any;

  component.viewRef = {
    getComponentInstance: () => ({
      endUpdate,
    }),
  };
  component.endUpdate();

  expect(mockEndUpdate).toBeCalledTimes(1);
  expect(endUpdate).toBeCalledTimes(1);
});
