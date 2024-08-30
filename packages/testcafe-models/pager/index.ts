// eslint-disable-next-line max-classes-per-file
import { Selector } from 'testcafe';
import NavPage from './navPage';
import FocusableElement from '../internal/focusable';
import { SelectableElement } from './selectableElement';
import Widget from '../internal/widget';
import { WidgetName } from '../types';

const CLASS = {
  pagerPageSize: 'dx-page-size',
  pagerPageSizes: 'dx-page-sizes',
  pagerPrevNavButton: 'dx-prev-button',
  pagerNextNavButton: 'dx-next-button',
  pagerPageIndex: 'dx-page-index',

  info: 'dx-info',
  select: 'dx-selectbox',
  item: 'dx-item',
  numberBox: 'dx-numberbox',

  overlayContent: 'dx-overlay-content',
  focusedState: 'dx-state-focused',
};

export default class Pager extends Widget {
  getName(): WidgetName { return 'dxPager'; }

  getPageSize(index: number): SelectableElement {
    return new SelectableElement(this.element
      .find(`.${CLASS.pagerPageSize}`)
      .nth(index));
  }

  getPrevNavButton(): FocusableElement {
    return new FocusableElement(this.element.find(`.${CLASS.pagerPrevNavButton}`));
  }

  getNextNavButton(): FocusableElement {
    return new FocusableElement(this.element.find(`.${CLASS.pagerNextNavButton}`));
  }

  getNavPage(pageIndexText: string): NavPage {
    return new NavPage(this.element, pageIndexText);
  }

  getPageSizeSelect(): Selector {
    return this.element.find(`.${CLASS.pagerPageSizes} .${CLASS.select}`);
  }

  getPopupPageSizes(): Selector {
    return Selector(`.${CLASS.overlayContent} .${CLASS.item}`);
  }

  getPageIndexWidget(): Selector {
    return this.element.find(`.${CLASS.pagerPageIndex}.${CLASS.numberBox}`);
  }

  getInfoText(): Selector {
    return this.element.find(`.${CLASS.info}`);
  }

  hasFocusedState(): Promise<boolean> {
    return this.element.hasClass(CLASS.focusedState);
  }
}
