import type { WidgetName } from './types';
import Widget from './internal/widget';

export default class Form extends Widget {
  public getName(): WidgetName { return 'dxForm'; }

  public async validate(): Promise<void> {
    await this.element.evaluate((element) => {
      ($(element) as any).dxForm('instance').validate();
    });
  }
}
