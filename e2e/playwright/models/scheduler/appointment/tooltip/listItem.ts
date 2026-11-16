import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { classMatcher } from '../../../internal/classMatcher';
import { textMatcher } from '../../../internal/textMatcher';

const CLASS = {
  listItem: 'dx-list-item',
  stateFocused: 'dx-state-focused',
  contentDate: 'dx-tooltip-appointment-item-content-date',
  contentSubject: 'dx-tooltip-appointment-item-content-subject',
};

export default class ListItem {
  public readonly element: Locator;

  public readonly date: Locator;

  public readonly subject: Locator;

  constructor(wrapper: Locator, title?: string, index = 0) {
    const items = wrapper.locator(`.${CLASS.listItem}`);

    this.element = (title ? items.filter({ hasText: textMatcher(title) }) : items).nth(index);
    this.date = this.element.locator(`.${CLASS.contentDate}`);
    this.subject = this.element.locator(`.${CLASS.contentSubject}`);
  }

  public async expectFocused(present = true): Promise<void> {
    const assertion = expect(this.element);

    await (present ? assertion : assertion.not).toHaveClass(classMatcher(CLASS.stateFocused));
  }
}
