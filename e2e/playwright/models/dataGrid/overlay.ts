import type { Locator } from '@playwright/test';
import GridModule from '../gridCore/module';

const CLASS = {
  invalidMessage: 'dx-invalid-message',
  revertTooltip: 'revert-tooltip',
};

export default class Overlay extends GridModule {
  public getInvalidMessage(): Locator {
    return this.element.and(this.element.page().locator(`.${CLASS.invalidMessage}`));
  }

  public getRevertTooltip(): Locator {
    return this.element.and(
      this.element.page().locator(`.${this.addWidgetPrefix(CLASS.revertTooltip)}`),
    );
  }
}
