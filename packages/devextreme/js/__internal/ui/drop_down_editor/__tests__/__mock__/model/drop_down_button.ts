import { ListModel } from '@ts/ui/list/__tests__/__mock__/model/list';

const CLASSES = {
  button: 'dx-button',
  list: 'dx-list',
  stateInvisible: 'dx-state-invisible',
};

const ATTR = {
  popupId: 'aria-owns',
};

export class DropDownButtonModel {
  constructor(protected readonly root: HTMLElement) {}

  public getElement(): HTMLElement {
    return this.root;
  }

  public getButtonElement(): HTMLElement {
    return this.root.querySelector(`.${CLASSES.button}`) as HTMLElement;
  }

  public getPopupContent(): HTMLElement {
    const popupId = this.root.getAttribute(ATTR.popupId);

    return document.body.querySelector(`#${popupId}`) as HTMLElement;
  }

  public getList(): ListModel {
    return new ListModel(this.getPopupContent().querySelector(`.${CLASSES.list}`) as HTMLElement);
  }

  public isOpened(): boolean {
    const popupContent = this.getPopupContent();
    const overlayContent = popupContent?.parentElement;

    return !overlayContent?.classList.contains(CLASSES.stateInvisible);
  }
}
