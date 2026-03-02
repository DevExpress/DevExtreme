import { PopupModel } from '@ts/ui/__tests__/__mock__/model/popup';

const SELECTORS = {
  dialogMessage: 'dx-dialog-message',
  cancelButton: '[aria-label="No"]',
};

export class ConfirmationDialogModel extends PopupModel {
  public getMessage(): string {
    const overlay = this.getOverlayContent();
    const messageElement = overlay.querySelector(`.${SELECTORS.dialogMessage}`) as HTMLElement;
    return messageElement.textContent ?? '';
  }

  public getCancelButton(): HTMLElement {
    const element = this.getElement();
    return element.querySelector(SELECTORS.cancelButton) as HTMLElement;
  }
}
