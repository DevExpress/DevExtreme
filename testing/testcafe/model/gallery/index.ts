import Widget from '../internal/widget';
import GalleryIndicatorItem from './indicatorItem';

const CLASS = {
  indicatorItem: 'dx-gallery-indicator-item',
};

export default class List extends Widget {
  indicatorItems: Selector;

  name = 'dxGallery';

  constructor(id: string | Selector) {
    super(id);

    this.indicatorItems = this.element.find(`.${CLASS.indicatorItem}`);
  }

  getIndicatorItem(index = 0): GalleryIndicatorItem {
    return new GalleryIndicatorItem(this.indicatorItems.nth(index));
  }
}
