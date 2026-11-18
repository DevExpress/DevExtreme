import type { Locator } from '@playwright/test';
import FocusableElement from '../../internal/focusable';
import Widget from '../../internal/widget';
import FilterRow from '../filter/row';
import HeaderRow from './row';

const CLASS = {
  headerRow: 'dx-header-row',
  filterRow: 'filter-row',
  content: 'content',
  contentFixed: 'content-fixed',
};

export default class Headers extends FocusableElement {
  public readonly widgetName: string;

  constructor(element: Locator, widgetName: string) {
    super(element);
    this.widgetName = widgetName;
  }

  public getHeaderRow(index: number, isFixed = false): HeaderRow {
    const content = Widget.addClassPrefix(this.widgetName, CLASS.content);
    const contentFixed = Widget.addClassPrefix(this.widgetName, CLASS.contentFixed);
    const headersContainerSelector = isFixed
      ? `.${contentFixed}`
      : `.${content}:not(.${contentFixed})`;

    return new HeaderRow(
      this.element.locator(`${headersContainerSelector} .${CLASS.headerRow}:nth-child(${index + 1})`),
      this.widgetName,
    );
  }

  public getFilterRow(): FilterRow {
    return new FilterRow(
      this.element.locator(`.${Widget.addClassPrefix(this.widgetName, CLASS.filterRow)}`),
    );
  }
}
