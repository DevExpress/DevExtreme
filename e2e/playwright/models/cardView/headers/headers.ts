import GridModule from '../../gridCore/module';
import HeaderItem from './item';

const CLASS = {
  headerItem: 'header-item',
};

export default class HeadersElement extends GridModule {
  public getHeaderItemNth(nth: number): HeaderItem {
    const selector = this.element
      .locator(`.${this.addWidgetPrefix(CLASS.headerItem)}`)
      .nth(nth);

    return new HeaderItem(selector, this.widgetName);
  }
}
