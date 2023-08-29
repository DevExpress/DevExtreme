import FocusableElement from '../../internal/focusable';
import Widget from '../../internal/widget';
import { FilterBuilderPopup } from './builder';

const CLASS = {
  filterPanelIcon: 'dx-icon-filter',
  filterPanelText: 'filter-panel-text',
};

export default class FilterPanel extends FocusableElement {
  widgetName: string;

  constructor(element: Selector, widgetName: string) {
    super(element);
    this.widgetName = widgetName;
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
