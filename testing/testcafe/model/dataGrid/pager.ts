import FocusableElement from '../internal/focusable';
import NavPage from './navPage';

const CLASS = {
  pagerPageSize: 'dx-page-size',
  pagerPrevNavButton: 'dx-prev-button',
  pagerNextNavButton: 'dx-next-button',
};

export default class Pager extends FocusableElement {
  getPageSize(index: number): FocusableElement {
    return new FocusableElement(this.element.find(`.${CLASS.pagerPageSize}:nth-child(${index + 1})`));
  }

  getPrevNavButton(): FocusableElement {
    return new FocusableElement(this.element.find(`.${CLASS.pagerPrevNavButton}`));
  }

  getNextNavButton(): FocusableElement {
    return new FocusableElement(this.element.find(`.${CLASS.pagerNextNavButton}`));
  }

  getNavPage(index: number): NavPage {
    return new NavPage(this.element, index);
  }
}
