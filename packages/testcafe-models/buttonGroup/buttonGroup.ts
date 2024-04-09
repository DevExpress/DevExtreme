import { Selector } from 'testcafe';
import type { WidgetName } from '../types';

import Widget from '../internal/widget';

const CLASS = {
  buttonGroup: 'dx-buttongroup',
};
export default class ButtonGroup extends Widget {
  // eslint-disable-next-line
  constructor(id: string | Selector) {
    super(id);

    this.element = Selector(`.${CLASS.buttonGroup}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxButtonGroup'; }
}
