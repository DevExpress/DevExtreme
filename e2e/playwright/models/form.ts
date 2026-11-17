import type { WidgetName } from './types';
import Widget from './internal/widget';

export default class Form extends Widget {
  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxForm'; }

  public async validate(): Promise<void> {
    // The validation result holds the validators, which cannot leave the page.
    await this.element.evaluate((element) => {
      ($(element) as any).dxForm('instance').validate();
    });
  }
}
