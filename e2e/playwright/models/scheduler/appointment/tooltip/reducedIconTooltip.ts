import type { Page } from '@playwright/test';
import TooltipBase from './base';

const CLASS = {
  reducedIconTooltip: 'dx-scheduler-reduced-icon-tooltip',
};

export default class ReducedIconTooltip extends TooltipBase {
  constructor(page: Page) {
    super(page, CLASS.reducedIconTooltip);
  }

  public getText(): Promise<string> {
    return this.content.innerText();
  }
}
