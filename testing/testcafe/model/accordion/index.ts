import { Selector } from 'testcafe';
import Widget from '../internal/widget';
import { WidgetName } from '../../helpers/createWidget';

const CLASS = {
  accordion: 'dx-accordion',
  item: 'dx-accordion-item',
};

export default class Accordion extends Widget {
  items: Selector;

  constructor(id: string | Selector) {
    super(id);

    this.items = Selector(`.${CLASS.accordion}`).find(`.${CLASS.item}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxAccordion'; }
}
