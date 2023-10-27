import { Selector } from 'testcafe';
import Form from '../../form/form';
import TextBox from '../../textBox';
import Button from '../../button';

const CLASS = {
  buttonGroup: 'dx-buttongroup',
  button: 'dx-button',
};

export default class AddImageUrlForm extends Form {
  public get url(): TextBox {
    return this.findTextBox('src');
  }

  public get width(): TextBox {
    return this.findTextBox('width');
  }

  public get height(): TextBox {
    return this.findTextBox('height');
  }

  public get lockButton(): Button {
    return new Button(Selector(this.element.find(`.${CLASS.buttonGroup}`).find(`.${CLASS.button}`)));
  }
}
