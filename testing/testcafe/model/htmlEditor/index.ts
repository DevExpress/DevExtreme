import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import Toolbar from './toolbar';

export default class HtmlEditor extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName {
    return 'dxHtmlEditor';
  }

  get toolbar(): Toolbar {
    return new Toolbar(this.element);
  }
}
