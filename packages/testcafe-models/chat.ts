import type { WidgetName } from './types';
import Widget from './internal/widget';

const CLASS = {
  input: 'dx-texteditor-input',
};

export default class Chat extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxChat'; }

  getInput(): Selector {
    return this.element.find(`.${CLASS.input}`);
  }
}
