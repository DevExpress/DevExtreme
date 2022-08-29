// eslint-disable-next-line max-classes-per-file
import NavPage from './navPage';
import FocusableElement from '../internal/focusable';
import { SelectableElement } from './SelectableElement';

const CLASS = {
  pagerPageSize: 'dx-page-size',
  pagerPrevNavButton: 'dx-prev-button',
  pagerNextNavButton: 'dx-next-button',
  info: 'dx-info',
};

const SELECTOR = {
  pageSizeWidget: '.dx-page-sizes .dx-selectbox',
  pageIndexWidget: '.dx-page-index.dx-numberbox',
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

  getPageSizeWidget(): Selector {
    return this.element.find(SELECTOR.pageSizeWidget);
  }

  getPageIndexWidget(): Selector {
    return this.element.find(SELECTOR.pageIndexWidget);
  }

  get infoText(): Selector {
    return this.element.find(`.${CLASS.info}`);
  }
}
