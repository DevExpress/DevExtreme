import Popup from '../../popup';
import Tabs from '../../tabs';
import AddImageFileForm from './addImageFileForm';
import AddImageUrlForm from './addImageUrlForm';
import FooterToolbar from './footerToolbar';

const CLASS = {
  FORM: '.dx-formdialog-form',
};

export default class Dialog extends Popup {
  public get tabs(): Tabs {
    return new Tabs(this.element.find(Tabs.className));
  }

  public get footerToolbar(): FooterToolbar {
    return new FooterToolbar(this.element.find(Popup.footerToolbarClassName));
  }

  public get addImageFileForm(): AddImageFileForm {
    return new AddImageFileForm(this.element.find(CLASS.FORM));
  }

  public get addImageUrlForm(): AddImageUrlForm {
    return new AddImageUrlForm(this.element.find(CLASS.FORM));
  }
}
