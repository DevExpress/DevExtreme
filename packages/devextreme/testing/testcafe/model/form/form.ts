import { ClientFunction, Selector } from 'testcafe';
import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import TextBox from '../textBox';

export default class Form extends Widget {
  // dx-form
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxForm'; }

  validate(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => { (getInstance() as any).validate(); },
      { dependencies: { getInstance } },
    )();
  }

  findTextBox(filedName: string): TextBox {
    return new TextBox(Selector(this.element.find(`input[name='${filedName}']`)).parent(2));
  }
}
