// eslint-disable-next-line max-classes-per-file
import { Selector } from 'testcafe';
import NavPage from './navPage';
import FocusableElement from '../internal/focusable';
import { SelectableElement } from './SelectableElement';

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
};

export default class Pager extends FocusableElement {
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

  // eslint-disable-next-line class-methods-use-this
  getPopupPageSizes(): Selector {
    return Selector(`.${CLASS.overlayContent} .${CLASS.item}`);
  }

  getPageIndexWidget(): Selector {
    return this.element.find(`.${CLASS.pagerPageIndex}.${CLASS.numberBox}`);
  }

  get infoText(): Selector {
    return this.element.find(`.${CLASS.info}`);
  }
}
