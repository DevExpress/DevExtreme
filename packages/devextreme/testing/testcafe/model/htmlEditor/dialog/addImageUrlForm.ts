import Form from '../../form/form';
import TextBox from '../../textBox';

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
}
