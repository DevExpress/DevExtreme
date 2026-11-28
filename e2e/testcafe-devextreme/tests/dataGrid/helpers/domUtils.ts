import { insertStylesheetRulesToPage } from '../../../helpers/domUtils';

/*
  Overrides the toolbar items' :focus-visible outline,
  because in e2e tests flaky outline would appear
  */
export async function insertStylesToSuppressGroupPanelFocusOutline(): Promise<void> {
  await insertStylesheetRulesToPage(`
    .dx-group-panel-item:focus-visible:not(.dx-toolbar-item) {
      outline: none !important;
    }
  `);
}
