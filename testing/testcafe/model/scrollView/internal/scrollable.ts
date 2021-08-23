import { ClientFunction, Selector } from 'testcafe';
import { ScrollableProps } from '../../../../../js/renovation/ui/scroll_view/scrollable_props';
import Widget from '../../internal/widget';
import Scrollbar from './scrollbar';

const CLASS = {
  scrollable: 'dx-scrollable',
  scrollableContainer: 'dx-scrollable-container',
};
export default class Scrollable extends Widget {
  scrollbar: Scrollbar;

  getInstance: ClientFunction;

  name: string;

  constructor(id: string | Selector, options: Partial<ScrollableProps>, name = 'dxScrollable') {
    super(id);

    this.element = Selector(`.${CLASS.scrollable}`);
    this.scrollbar = new Scrollbar(options.direction ?? 'vertical');

    const scrollable = this.element;

    this.name = name;
    this.getInstance = ClientFunction(
      () => $(scrollable())[`${name}`]('instance'),
      { dependencies: { scrollable, name } },
    );
  }

  static getContainer(): Selector {
    return Selector(`.${CLASS.scrollableContainer}`);
  }
}
