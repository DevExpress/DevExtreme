import Popup from '@js/ui/popup';

const CLASSES = {
  popupWrapper: 'dx-popup-wrapper',
  popupTitle: 'dx-popup-title',
  overlayContent: 'dx-overlay-content',
};

export class PopupModel {
  protected getPopupWrapper(): HTMLElement | null {
    return document.body.querySelector(`.${CLASSES.popupWrapper}`);
  }

  public getOverlayContent(): HTMLElement | null {
    const wrapper = this.getPopupWrapper();
    return wrapper?.querySelector(`.${CLASSES.overlayContent}`) ?? null;
  }

  public isVisible(): boolean {
    return this.getOverlayContent() !== null;
  }

  public getTitle(): string {
    const overlay = this.getOverlayContent();
    const titleElement = overlay?.querySelector(`.${CLASSES.popupTitle}`);
    return titleElement?.textContent ?? '';
  }

  public getElement(): HTMLElement {
    return this.getPopupWrapper() as HTMLElement;
  }

  public getInstance(): Popup {
    const element = this.getElement();
    return Popup.getInstance(element) as Popup;
  }
}
