import Button from '../../button';
import Toolbar from '../../toolbar';

export default class FooterToolbar extends Toolbar {
  public get addButton(): Button {
    return new Button(this.findButtons().nth(0));
  }

  public get cancelButton(): Button {
    return new Button(this.findButtons().nth(1));
  }

  private findButtons() {
    return this.element.find(`.${Button.className}`);
  }
}
