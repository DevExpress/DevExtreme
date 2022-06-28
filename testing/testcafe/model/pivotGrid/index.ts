import { ClientFunction } from 'testcafe';
import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';

export default class PivotGrid extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxPivotGrid'; }

  addWidgetPrefix(className: string): string {
    return Widget.addClassPrefix(this.getName(), className);
  }

  scrollTo(options: { top?: number; left?: number }): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      // eslint-disable-next-line no-underscore-dangle
      () => (getInstance() as any)._dataArea._getScrollable().scrollTo(options),
      { dependencies: { getInstance, options } },
    )();
  }

  scrollBy(options: { top?: number; left?: number }): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      // eslint-disable-next-line no-underscore-dangle
      () => (getInstance() as any)._dataArea._getScrollable().scrollBy(options),
      { dependencies: { getInstance, options } },
    )();
  }
}
