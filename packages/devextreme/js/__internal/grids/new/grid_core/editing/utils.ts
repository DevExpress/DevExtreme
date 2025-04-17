import type { Column } from '../columns_controller/types';

export const defaultSetCellValue: Column['setCellValue'] = function (newData, value) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const column = this;
  const { dataField } = column;

  if (!dataField) {
    return;
  }

  newData[dataField] = value;
};

export class PendingPromises {
  private readonly promises = new Set<Promise<void>>();

  public waitForAll(): Promise<void> {
    return Promise.all([...this.promises]) as unknown as Promise<void>;
  }

  public add<T>(p: Promise<T>): Promise<T> {
    this.promises.add(p as Promise<void>);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    p.then(() => {
      this.promises.delete(p as Promise<void>);
    });

    return p;
  }
}
