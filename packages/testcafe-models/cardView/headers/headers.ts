import FocusableElement from '../../internal/focusable';
import Widget from '../../internal/widget';
import HeaderItem from './item';

const CLASS = {
  headerItem: 'header-item',
};

export default class HeadersElement extends FocusableElement {
  widgetName: string;

  constructor(element: Selector, widgetName: string) {
    super(element);
    this.widgetName = widgetName;
  }

  getHeaderItemByText(text: string): HeaderItem {
    const selector = this.element.find(`.${Widget.addClassPrefix(this.widgetName, CLASS.headerItem)}`).withText(text);
    return new HeaderItem(selector, this.widgetName);
  }

  getHeaderItemNth(nth: number): HeaderItem {
    const selector = this.element.find(`.${Widget.addClassPrefix(this.widgetName, CLASS.headerItem)}`).nth(nth);
    return new HeaderItem(selector, this.widgetName);
  }
}
