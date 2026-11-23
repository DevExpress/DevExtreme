import type { Locator } from '@playwright/test';
import { expectClass } from './internal/classMatcher';
import type { ScrollableDirection } from './scrollable';

const CLASS = {
  scrollbar: 'dx-scrollbar',
  scroll: 'dx-scrollable-scroll',
  invisible: 'dx-state-invisible',
};

export interface ScrollTranslate {
  left: number;
  top: number;
}

export default class Scrollbar {
  public readonly element: Locator;

  constructor(root: Locator, direction: ScrollableDirection) {
    this.element = root.locator(`.${CLASS.scrollbar}-${direction}`);
  }

  public getScroll(): Locator {
    return this.element.locator(`.${CLASS.scroll}`);
  }

  public expectScrollVisible(visible: boolean): Promise<void> {
    return expectClass(this.getScroll(), CLASS.invisible, !visible);
  }

  public getScrollTranslate(): Promise<ScrollTranslate> {
    return this.getScroll().evaluate((scroll) => {
      const matrixValues = /matrix.*\((.+)\)/.exec(getComputedStyle(scroll).transform);

      if (!matrixValues) {
        return { left: 0, top: 0 };
      }

      const values = matrixValues[1].split(', ');

      return { left: Number(values[4]), top: Number(values[5]) };
    });
  }
}
