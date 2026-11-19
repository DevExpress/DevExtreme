import GridModule from '../../gridCore/module';
import FilterRow from '../filter/row';
import HeaderRow from './row';

const CLASS = {
  headerRow: 'dx-header-row',
  filterRow: 'filter-row',
  content: 'content',
  contentFixed: 'content-fixed',
};

export default class Headers extends GridModule {
  public getHeaderRow(index: number, isFixed = false): HeaderRow {
    const content = this.addWidgetPrefix(CLASS.content);
    const contentFixed = this.addWidgetPrefix(CLASS.contentFixed);
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
      this.element.locator(`.${this.addWidgetPrefix(CLASS.filterRow)}`),
    );
  }
}
