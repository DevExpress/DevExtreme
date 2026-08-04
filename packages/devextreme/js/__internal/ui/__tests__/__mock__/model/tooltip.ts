import type Popup from '@ts/ui/popup/popup';
import Tooltip from '@ts/ui/tooltip';

import { PopoverModel } from './popover';

const CLASSES = {
  tooltip: 'dx-tooltip',
  tooltipWrapper: 'dx-tooltip-wrapper',
};

export class TooltipModel extends PopoverModel {
  protected getRootClass(): string {
    return CLASSES.tooltip;
  }

  protected getWrapperClass(): string {
    return CLASSES.tooltipWrapper;
  }

  public getInstance(): Popup {
    return Tooltip.getInstance<Popup>(this.getRoot());
  }
}
