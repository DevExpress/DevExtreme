import { OverlayModel } from './overlay';
import { TextEditorModel } from './text_editor';

const CLASSES = {
  button: 'dx-dropdowneditor-button',
  inputWrapper: 'dx-dropdowneditor-input-wrapper',
};

const ATTR = {
  popupContent: 'aria-owns',
};

export class DropDownEditorModel extends TextEditorModel {
  public open(): void {
    const button = this.root.querySelector<HTMLElement>(`.${CLASSES.button}`);
    const target = button ?? this.root.querySelector<HTMLElement>(`.${CLASSES.inputWrapper}`);

    target?.click();
  }

  public getOverlay(): OverlayModel {
    const contentId = this.root.getAttribute(ATTR.popupContent);
    const content = contentId ? document.getElementById(contentId) : null;

    return new OverlayModel(content);
  }
}
