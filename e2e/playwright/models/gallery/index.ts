import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import GalleryIndicatorItem from './indicatorItem';

const CLASS = {
  indicatorItem: 'dx-gallery-indicator-item',
};

export default class Gallery extends Widget {
  name: WidgetName = 'dxGallery';

  public getIndicatorItem(index = 0): GalleryIndicatorItem {
    return new GalleryIndicatorItem(this.element.locator(`.${CLASS.indicatorItem}`).nth(index));
  }
}
