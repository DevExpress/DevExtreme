import { ClientFunction } from 'testcafe';
import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';

export default class Form extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxForm'; }

  validate(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => { (getInstance() as any).validate(); },
      { dependencies: { getInstance } },
    )();
  }
}
