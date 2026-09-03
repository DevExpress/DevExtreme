import type { Locator } from '@playwright/test';
import type { WidgetName } from './types';
import Widget from './internal/widget';

export const CLASS = {
  area: '.dx-pivotgrid-area',
  dataArea: '.dx-pivotgrid-area-data',
  fieldChooserButton: '.dx-pivotgrid-field-chooser-button',
};

// The reference model of the package: it shows what a squad writes on top of Widget — a Locator
// per part of the markup and the widget API through option()/invoke().
export default class PivotGrid extends Widget {
  public static className = 'dx-pivotgrid';

  public get dataArea(): Locator {
    return this.element.locator(CLASS.dataArea);
  }

  public getAreaCell(area: string, index: number): Locator {
    return this.element.locator(`${CLASS.area}-${area} td`).nth(index);
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxPivotGrid'; }
}
