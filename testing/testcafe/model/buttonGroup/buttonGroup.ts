import { ClientFunction, Selector } from 'testcafe';

import Widget from '../internal/widget';

const CLASS = {
  buttonGroup: 'dx-buttongroup',
};
export default class ButtonGroup extends Widget {
  getInstance: ClientFunction;

  name: string;

  // eslint-disable-next-line
  constructor(id: string | Selector, options: any, name = 'dxButtonGroup') {
    super(id);

    this.element = Selector(`.${CLASS.buttonGroup}`);

    const buttonGroup = this.element;

    this.name = name;
    this.getInstance = ClientFunction(
      () => $(buttonGroup())[`${name}`]('instance'),
      { dependencies: { buttonGroup, name } },
    );
  }
}
