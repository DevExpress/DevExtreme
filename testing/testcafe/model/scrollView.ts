import { Selector } from 'testcafe';
import Widget from './internal/widget';
import Scrollbar from './internal/scrollbar';

const CLASS = {
  scrollView: 'dx-scrollview',
  scrollbarContainer: 'dx-scrollable-container',
};
export default class ScrollView extends Widget {
  scrollbar: Scrollbar;

  name = 'dxScrollView';

  constructor(id: string | Selector, direction: string) {
    super(id);

    this.element = Selector(`.${CLASS.scrollView}`);
    this.scrollbar = new Scrollbar(direction);
  }

  static getScrollViewContainer(): Selector {
    return Selector(`.${CLASS.scrollbarContainer}`);
  }
}
