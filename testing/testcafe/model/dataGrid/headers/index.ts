import FocusableElement from '../../internal/focusable';
import Widget from '../../internal/widget';
import HeaderRow from './row';
import FilterRow from '../filter/row';

const CLASS = {
    headerRow: 'dx-header-row',
    filterRow: 'filter-row',
};

export default class Headers extends FocusableElement {
  widgetName: string;

  constructor(element: Selector, widgetName: string) {
      super(element);
      this.widgetName = widgetName;
  }

  getHeaderRow(index: number): HeaderRow {
      return new HeaderRow(this.element.find(`.dx-datagrid-content:not(.dx-datagrid-content-fixed) .${CLASS.headerRow}:nth-child(${index + 1})`), this.widgetName);
  }

  getFilterRow(): FilterRow {
      return new FilterRow(this.element.find(`.${Widget.addClassPrefix(this.widgetName, CLASS.filterRow)}`));
  }
}
