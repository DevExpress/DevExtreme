// eslint-disable-next-line max-classes-per-file
import { Selector } from 'testcafe';
import NavPage from './navPage';
import FocusableElement from '../internal/focusable';
import { SelectableElement } from './selectableElement';
import Widget from '../internal/widget';
import { WidgetName } from '../types';
import SelectBox from '../selectBox';

const CLASS = {
  paginationPageSize: 'dx-page-size',
  paginationPageSizes: 'dx-page-sizes',
  paginationPrevNavButton: 'dx-prev-button',
  paginationNextNavButton: 'dx-next-button',
  paginationPageIndex: 'dx-page-index',

  info: 'dx-info',
  select: 'dx-selectbox',
  item: 'dx-item',
  numberBox: 'dx-numberbox',

  overlayContent: 'dx-overlay-content',
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

  getPageSizeSelectBox() : SelectBox {
    return new SelectBox(this.element.find(`.${CLASS.paginationPageSizes} .${CLASS.select}`));
  }

  getPopupPageSizes(): Selector {
    return Selector(`.${CLASS.overlayContent} .${CLASS.item}`);
  }

  getPageIndexWidget(): Selector {
    return this.element.find(`.${CLASS.paginationPageIndex}.${CLASS.numberBox}`);
  }

  getInfoText(): Selector {
    return this.element.find(`.${CLASS.info}`);
  }

  hasFocusedState(): Promise<boolean> {
    return this.element.hasClass(CLASS.focusedState);
  }
}
