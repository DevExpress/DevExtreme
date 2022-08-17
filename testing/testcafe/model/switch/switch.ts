import { Selector } from 'testcafe';
import { WidgetName } from '../../helpers/createWidget';

import Widget from '../internal/widget';

const CLASS = {
  switch: 'dx-switch',
  on: 'dx-switch-on-value',
};
export default class Switch extends Widget {
  on: Promise<boolean>;

  // eslint-disable-next-line
  constructor(id: string | Selector) {
    super(id);

    this.element = Selector(`.${CLASS.switch}`);

    this.on = this.element.hasClass(CLASS.on);
  }

  getIsOn(): Promise<boolean> {
    return this.element.hasClass(CLASS.on);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxSwitch'; }
}
