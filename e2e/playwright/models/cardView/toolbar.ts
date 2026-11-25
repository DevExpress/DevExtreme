import Button from '../button';
import GridElement from '../gridCore/element';

export default class Toolbar extends GridElement {
  public getAddButton(): Button {
    return new Button(this.element.page(), this.element.locator('[aria-label=\'add\']'));
  }
}
