import { BaseModel } from './base_model';

const CLASSES = {
  overlayContent: 'dx-overlay-content',
};

export class OverlayModel extends BaseModel<HTMLElement | null> {
  constructor(element: HTMLElement | null) {
    super(element?.closest<HTMLElement>(`.${CLASSES.overlayContent}`) ?? null);
  }
}
