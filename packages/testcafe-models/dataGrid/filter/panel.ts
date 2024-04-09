import { Selector } from 'testcafe';
import FocusableElement from '../../internal/focusable';
import Widget from '../../internal/widget';
import { FilterBuilderPopup } from './builder';

const CLASS = {
  filterPanelIcon: 'dx-icon-filter',
  filterPanelText: 'filter-panel-text',
  popupWrapper: 'dx-popup-wrapper',
  filterBuilder: 'dx-filterbuilder',
};

export default class FilterPanel extends FocusableElement {
  body: Selector;

  widgetName: string;

  isOpened: Promise<boolean>;

  constructor(element: Selector, widgetName: string) {
    super(element);

    this.body = Selector('body');
    this.widgetName = widgetName;
    this.isOpened = this.body.find(`.${CLASS.popupWrapper} .${CLASS.filterBuilder}`).exists;
  }

  getIconFilter(): FocusableElement {
    return new FocusableElement(this.element.find(`.${CLASS.filterPanelIcon}`));
  }

  getFilterText(): FocusableElement {
    return new FocusableElement(this.element.find(`.${Widget.addClassPrefix(this.widgetName, CLASS.filterPanelText)}`));
  }

  async openFilterBuilderPopup(t: TestController): Promise<FilterBuilderPopup> {
    await t.click(this.getIconFilter().element);

    return new FilterBuilderPopup();
  }
}
