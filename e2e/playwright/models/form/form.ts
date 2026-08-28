import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import TextBox from '../textBox';

export default class Form extends Widget {
  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxForm'; }

  public async validate(): Promise<void> {
    await this.invoke('validate');
  }

  public async smartPaste(): Promise<void> {
    await this.invoke('smartPaste', 'test');
  }

  public findTextBox(fieldName: string): TextBox {
    return new TextBox(
      this.page,
      this.element.locator(`input[name='${fieldName}']`).locator('../../..'),
    );
  }
}
