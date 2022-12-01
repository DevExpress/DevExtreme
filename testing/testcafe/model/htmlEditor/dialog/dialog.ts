import Popup from '../../popup';
import FooterToolbar from './footerToolbar';

export default class Dialog extends Popup {
  get footerToolbar(): FooterToolbar {
    return new FooterToolbar(this.element.find(Popup.footerToolbarClassName));
  }
}
