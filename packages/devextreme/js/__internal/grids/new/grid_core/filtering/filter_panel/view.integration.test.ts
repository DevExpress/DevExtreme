import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import {
  afterTest,
  beforeTest,
  createCardView,
  flushAsync,
} from '../../../card_view/__tests__/__mock__/helpers/utils';

const COLUMNS = ['id', 'name'];

const DATA = [
  { id: 1, name: 'first' },
  { id: 2, name: 'second' },
];

describe('FilterPanelView', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('is not rendered when there is no data source', async () => {
    const { component } = await createCardView({
      columns: COLUMNS,
      filterPanel: { visible: true },
    });
    await flushAsync();

    expect(component.getFilterPanel().isVisible()).toBe(false);
  });

  it('is rendered when there is a data source', async () => {
    const { component } = await createCardView({
      dataSource: DATA,
      keyExpr: 'id',
      columns: COLUMNS,
      filterPanel: { visible: true },
    });
    await flushAsync();

    expect(component.getFilterPanel().isVisible()).toBe(true);
  });

  it('appears once the data source option is set', async () => {
    const { component } = await createCardView({
      columns: COLUMNS,
      filterPanel: { visible: true },
    });
    await flushAsync();

    component.apiOption('dataSource', DATA);
    await flushAsync();
    await flushAsync();

    expect(component.getFilterPanel().isVisible()).toBe(true);
  });
});
