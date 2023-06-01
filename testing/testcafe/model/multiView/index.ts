import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import MultiViewItem from './item';

const CLASS = {
  item: 'dx-multiview-item',
};

export default class MultiView extends Widget {
  itemElements: Selector;

  constructor(id: string) {
    super(id);

    this.itemElements = this.element.find(`.${CLASS.item}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxMultiView'; }

  getItem(index = 0): MultiViewItem {
    return new MultiViewItem(this.itemElements.nth(index));
  }
}
