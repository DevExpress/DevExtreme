import type { Page } from '@playwright/test';
import { insertStylesheetRulesToPage } from '../../../helpers/domUtils';

export async function insertStylesToSuppressGroupPanelFocusOutline(page: Page): Promise<void> {
  await insertStylesheetRulesToPage(page, `
    .dx-group-panel-item:focus-visible:not(.dx-toolbar-item) {
      outline: none !important;
    }
  `);
}
