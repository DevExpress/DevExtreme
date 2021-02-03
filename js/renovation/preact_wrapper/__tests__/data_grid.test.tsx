/* eslint-disable class-methods-use-this */
import DataGridComponent from '../data_grid';
import BaseComponent from '../component';

jest.mock('../component', () => {
  class T {
    static beginUpdateMock = jest.fn();

    static endUpdateMock = jest.fn();

    beginUpdate() {
      T.beginUpdateMock();
    }

    endUpdate() {
      T.endUpdateMock();
    }
  }

  return T;
});

it('beginUpdate', () => {
  const beginUpdate = jest.fn();
  const component = new DataGridComponent({} as Element) as any;

  component.viewRef = {
    getComponentInstance: () => ({
      beginUpdate,
    }),
  };
  component.beginUpdate();

  expect((BaseComponent as any).beginUpdateMock).toBeCalledTimes(1);
  expect(beginUpdate).toBeCalledTimes(1);
});

it('endUpdate', () => {
  const endUpdate = jest.fn();
  const component = new DataGridComponent({} as Element) as any;

  component.viewRef = {
    getComponentInstance: () => ({
      endUpdate,
    }),
  };
  component.endUpdate();

  expect((BaseComponent as any).endUpdateMock).toBeCalledTimes(1);
  expect(endUpdate).toBeCalledTimes(1);
});
