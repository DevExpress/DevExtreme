import { ClientFunction } from 'testcafe';
import type DataGrid from './index';

export class ColumnSeparator {
  private readonly dataGrid: DataGrid;

  constructor(dataGrid: DataGrid) {
    this.dataGrid = dataGrid;
  }

  async getX(): Promise<number> {
    const { getInstance } = this.dataGrid;
    const getX = ClientFunction(() => {
      const gridInstance = getInstance();
      // eslint-disable-next-line no-underscore-dangle
      return (gridInstance as any).getView('columnsSeparatorView')._testPosX;
    }, {
      dependencies: {
        getInstance,
      },
    });

    return getX();
  }
}
