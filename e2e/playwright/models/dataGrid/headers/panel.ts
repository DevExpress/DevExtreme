import type { Locator } from '@playwright/test';
import FocusableElement from '../../internal/focusable';
import ExportButton from './panelButtons/exportButton';

const CLASS = {
  applyFilterButton: 'dx-apply-button',
};

export default class HeaderPanel extends FocusableElement {
  public readonly widgetName: string;

  constructor(element: Locator, widgetName: string) {
    super(element);
    this.widgetName = widgetName;
  }

  public getExportButton(): ExportButton {
    return new ExportButton(this.element, this.widgetName);
  }

  public getApplyFilterButton(): Locator {
    return this.element.locator(`.${CLASS.applyFilterButton}`);
  }
}
