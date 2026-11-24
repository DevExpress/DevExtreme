import type { Page } from '@playwright/test';
import { test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import CardView from '../../../models/cardView';

async function createCardViewWithPager(page: Page, config: any = {}): Promise<void> {
  const dataSource = Array.from({ length: 20 }, (_, i) => ({ text: i.toString(), value: i }));
  return createWidget(page, 'dxCardView', {
    dataSource,

    // TODO: resolve the situation when columns are not set in config
    // There is the 'Maximum call stack size exceeded' error in this case
    columns: [
      'text',
      'value',
    ],
    paging: {
      pageSize: 2,
      pageIndex: 5,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [2, 3, 4],
      showInfo: true,
      showNavigationButtons: true,
    },
    ...config,
  });
}

const CARD_VIEW_SELECTOR = '#container';

[true, false].forEach((remoteOperation) => {
  test(`Runtime filterValue change updates paging when remoteOperations = ${remoteOperation}`, async ({ page }) => {
    await createCardViewWithPager(page, { remoteOperations: remoteOperation });

    const cardView = new CardView(page, CARD_VIEW_SELECTOR);

    await cardView.apiOption('filterValue', [
      ['value', '=', '1'],
      'or', ['value', '=', '2'],
      'or', ['value', '=', '3'],
      'or', ['value', '=', '4'],
    ]);

    await a11yCheck(page, {}, CARD_VIEW_SELECTOR);
  });
});
