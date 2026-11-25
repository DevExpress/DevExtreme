import type { Locator } from '@playwright/test';
import { expectClass } from '../internal/classMatcher';

const CLASS = {
  selected: 'dx-gallery-indicator-item-selected',
};

export default class GalleryIndicatorItem {
  public readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  public expectSelected(present = true): Promise<void> {
    return expectClass(this.element, CLASS.selected, present);
  }
}
