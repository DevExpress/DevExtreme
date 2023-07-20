import { WidgetName } from '../helpers/createWidget';
import SelectBox from './selectBox';

const CLASS = {
  tag: 'dx-tag',
};

export default class TagBox extends SelectBox {
  tags: Selector;

  constructor(id: string) {
    super(id);

    this.tags = this.element.find(`.${CLASS.tag}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxTagBox'; }
}
