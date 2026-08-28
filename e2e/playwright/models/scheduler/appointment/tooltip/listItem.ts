import type { Locator } from '@playwright/test';
import { hasClass } from '../../../internal/hasClass';

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

    this.element = (title ? items.filter({ hasText: title }) : items).nth(index);
    this.date = this.element.locator(`.${CLASS.contentDate}`);
    this.subject = this.element.locator(`.${CLASS.contentSubject}`);
  }

  public isFocused(): Promise<boolean> {
    return hasClass(this.element, CLASS.stateFocused);
  }
}
