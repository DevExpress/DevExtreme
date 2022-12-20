import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import Popup from '../popup';
import Dialog from './dialog/dialog';
import RootToolbar from './rootToolbar';

const CLASS = {
  CONTENT: '.dx-htmleditor-content',
};

export default class HtmlEditor extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName {
    return 'dxHtmlEditor';
  }

  public get content(): Selector {
    return this.element.find(CLASS.CONTENT);
  }

  // eslint-disable-next-line class-methods-use-this
  public get dialog(): Dialog {
    return new Dialog(Popup.className);
  }

  // eslint-disable-next-line class-methods-use-this
  public get toolbar(): RootToolbar {
    return new RootToolbar();
  }
}
