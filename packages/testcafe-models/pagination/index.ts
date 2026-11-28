// eslint-disable-next-line max-classes-per-file
import NavPage from './navPage';
import FocusableElement from '../internal/focusable';
import { SelectableElement } from './selectableElement';
import Widget from '../internal/widget';
import { WidgetName } from '../types';

const CLASS = {
  paginationPageSize: 'dx-page-size',
  paginationPrevNavButton: 'dx-prev-button',
  paginationNextNavButton: 'dx-next-button',

  info: 'dx-info',

  focusedState: 'dx-state-focused',
};

export default class Pagination extends Widget {
  getName(): WidgetName { return 'dxPagination'; }

  getPageSize(index: number): SelectableElement {
    return new SelectableElement(this.element
      .find(`.${CLASS.paginationPageSize}`)
      .nth(index));
  }

  getPrevNavButton(): FocusableElement {
    return new FocusableElement(this.element.find(`.${CLASS.paginationPrevNavButton}`));
  }

  getNextNavButton(): FocusableElement {
    return new FocusableElement(this.element.find(`.${CLASS.paginationNextNavButton}`));
  }

  getNavPage(pageIndexText: string): NavPage {
    return new NavPage(this.element, pageIndexText);
  }

  getInfoText(): Selector {
    return this.element.find(`.${CLASS.info}`);
  }

  hasFocusedState(): Promise<boolean> {
    return this.element.hasClass(CLASS.focusedState);
  }
}
