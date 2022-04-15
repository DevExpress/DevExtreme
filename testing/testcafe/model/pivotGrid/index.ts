import { ClientFunction } from 'testcafe';
import Widget from '../internal/widget';

export default class DataGrid extends Widget {
  getGridInstance: ClientFunction;

  name: string;

  constructor(id: string, name = 'dxPivotGrid') {
    super(id);

    this.name = name;

    const grid = this.element;

    this.getGridInstance = ClientFunction(
      () => $(grid())[`${name}`]('instance'),
      { dependencies: { grid, name } },
    );
  }

  addWidgetPrefix(className: string): string {
    return Widget.addClassPrefix(this.name, className);
  }

  scrollTo(options: { top?: number; left?: number }): Promise<void> {
    const { getGridInstance } = this;

    return ClientFunction(
      // eslint-disable-next-line no-underscore-dangle
      () => (getGridInstance() as any)._dataArea._getScrollable().scrollTo(options),
      { dependencies: { getGridInstance, options } },
    )();
  }

  scrollBy(options: { top?: number; left?: number }): Promise<void> {
    const { getGridInstance } = this;

    return ClientFunction(
      // eslint-disable-next-line no-underscore-dangle
      () => (getGridInstance() as any)._dataArea._getScrollable().scrollBy(options),
      { dependencies: { getGridInstance, options } },
    )();
  }
}
