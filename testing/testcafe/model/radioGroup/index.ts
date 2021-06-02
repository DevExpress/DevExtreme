import Widget from '../internal/widget';
import RadioGroupItem from './item';

const CLASS = {
  collection: 'dx-collection',
  item: 'dx-item',
};

export default class RadioGroup extends Widget {
  items: Selector;

  name = 'dxRadioGroup';

  constructor(id: string | Selector) {
    super(id);

    this.items = this.element.child(`.${CLASS.collection}`).child(`.${CLASS.item}`);
  }

  getItem(index = 0): RadioGroupItem {
    return new RadioGroupItem(this.items.nth(index));
  }
}
