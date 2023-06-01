import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import RadioGroupItem from './item';

const CLASS = {
  collection: 'dx-collection',
  item: 'dx-item',
};

export default class RadioGroup extends Widget {
  items: Selector;

  constructor(id: string | Selector) {
    super(id);

    this.items = this.element.child(`.${CLASS.collection}`).child(`.${CLASS.item}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxRadioGroup'; }

  getItem(index = 0): RadioGroupItem {
    return new RadioGroupItem(this.items.nth(index));
  }
}
