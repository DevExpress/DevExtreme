import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import GalleryIndicatorItem from './indicatorItem';

const CLASS = {
  indicatorItem: 'dx-gallery-indicator-item',
};

export default class List extends Widget {
  indicatorItems: Selector;

  constructor(id: string | Selector) {
    super(id);

    this.indicatorItems = this.element.find(`.${CLASS.indicatorItem}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxGallery'; }

  getIndicatorItem(index = 0): GalleryIndicatorItem {
    return new GalleryIndicatorItem(this.indicatorItems.nth(index));
  }
}
