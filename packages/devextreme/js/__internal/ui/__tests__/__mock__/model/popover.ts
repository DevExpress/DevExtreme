import Popover from '@ts/ui/popover/popover';
import type Popup from '@ts/ui/popup/popup';

import { PopupModel } from './popup';

const CLASSES = {
  popover: 'dx-popover',
  popoverWrapper: 'dx-popover-wrapper',
};

export class PopoverModel extends PopupModel {
  protected getRootClass(): string {
    return CLASSES.popover;
  }

  protected getWrapperClass(): string {
    return CLASSES.popoverWrapper;
  }

  public getInstance(): Popup {
    return Popover.getInstance<Popup>(this.getRoot());
  }
}
