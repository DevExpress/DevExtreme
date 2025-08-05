import CardView from 'devextreme-testcafe-models/cardView';
import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { data } from '../helpers/simpleArrayData';

fixture.disablePageReloads`CardView - Sorting Behavior - Functional`
  .page(url(__dirname, '../../container.html'));

([
  ['none', false, false, false, [undefined, undefined]],
  ['none', true, false, false, [undefined, undefined]],
  ['none', false, true, false, [undefined, undefined]],
  ['none', false, false, true, [undefined, undefined]],

  ['single', false, false, false, ['desc', undefined]],
  ['single', true, false, false, ['desc', undefined]],
  ['single', false, true, false, [undefined, undefined]],
  ['single', false, false, true, [undefined, undefined]],

  ['multiple', false, false, false, ['desc', 0]],
  ['multiple', true, false, false, ['desc', 0]],
  ['multiple', false, true, false, [undefined, undefined]],
  ['multiple', false, false, true, [undefined, undefined]],
] as [
  string,
  boolean,
  boolean,
  boolean,
  [
    string | undefined,
    number | undefined,
  ],
][]
).forEach(([
  mode,
  shift,
  ctrl,
  meta,
  [
    titleSortOrder,
    titleSortIndex,
  ]]) => {
  test(`Change sorting of sorted item in ${mode} mode with shift=${shift}, ctrl=${ctrl}, meta=${meta}`, async (t) => {
    const cardView = new CardView('#container');
    const titleHeaderItem = cardView.getHeaders().getHeaderItemByText('Title');

    await t
      .click(titleHeaderItem.element);

    await t
      .click(titleHeaderItem.element, {
        modifiers: {
          shift,
          ctrl,
          meta,
        },
      })
      .expect(cardView.apiColumnOption('title', 'sortOrder'))
      .eql(titleSortOrder)
      .expect(cardView.apiColumnOption('title', 'sortIndex'))
      .eql(titleSortIndex);
  }).before(async () => {
    await createWidget('dxCardView', {
      dataSource: data,
      sorting: {
        mode,
      },
      columns: [
        {
          dataField: 'title',
        },
        {
          dataField: 'name',
        },
      ],
    });
  });
});

([
  ['none', false, false, false, [undefined, undefined], [undefined, undefined]],
  ['none', true, false, false, [undefined, undefined], [undefined, undefined]],
  ['none', false, true, false, [undefined, undefined], [undefined, undefined]],
  ['none', false, false, true, [undefined, undefined], [undefined, undefined]],

  ['single', false, false, false, [undefined, undefined], ['asc', undefined]],
  ['single', true, false, false, [undefined, undefined], ['asc', undefined]],
  ['single', false, true, false, ['asc', undefined], [undefined, undefined]],
  ['single', false, false, true, ['asc', undefined], [undefined, undefined]],

  ['multiple', false, false, false, [undefined, undefined], ['asc', 0]],
  ['multiple', true, false, false, ['asc', 0], ['asc', 1]],
  ['multiple', false, true, false, ['asc', 0], [undefined, undefined]],
  ['multiple', false, false, true, ['asc', 0], [undefined, undefined]],
] as [
  string,
  boolean,
  boolean,
  boolean,
  [
    string | undefined,
    number | undefined,
  ],
  [
    string | undefined,
    number | undefined,
  ],
][]
).forEach(([
  mode,
  shift,
  ctrl,
  meta,
  [
    titleSortOrder,
    titleSortIndex,
  ],
  [
    nameSortOrder,
    nameSortIndex,
  ],
]) => {
  test(`Change sorting of neighbour non sorted item in ${mode} mode with shift=${shift}, ctrl=${ctrl}, meta=${meta}`, async (t) => {
    const cardView = new CardView('#container');
    const titleHeaderItem = cardView.getHeaders().getHeaderItemByText('Title');
    const nameHeaderItem = cardView.getHeaders().getHeaderItemByText('Name');

    await t
      .click(titleHeaderItem.element);

    await t
      .click(nameHeaderItem.element, {
        modifiers: {
          shift,
          ctrl,
          meta,
        },
      })
      .expect(cardView.apiColumnOption('title', 'sortOrder'))
      .eql(titleSortOrder)
      .expect(cardView.apiColumnOption('title', 'sortIndex'))
      .eql(titleSortIndex)
      .expect(cardView.apiColumnOption('name', 'sortOrder'))
      .eql(nameSortOrder)
      .expect(cardView.apiColumnOption('name', 'sortIndex'))
      .eql(nameSortIndex);
  }).before(async () => {
    await createWidget('dxCardView', {
      dataSource: data,
      sorting: {
        mode,
      },
      columns: [
        {
          dataField: 'title',
        },
        {
          dataField: 'name',
        },
      ],
    });
  });
});

([
  ['none', false, false, false, [undefined, undefined], [undefined, undefined]],
  ['none', true, false, false, [undefined, undefined], [undefined, undefined]],
  ['none', false, true, false, [undefined, undefined], [undefined, undefined]],
  ['none', false, false, true, [undefined, undefined], [undefined, undefined]],

  ['single', false, false, false, [undefined, undefined], ['desc', undefined]],
  ['single', true, false, false, [undefined, undefined], ['desc', undefined]],
  ['single', false, true, false, [undefined, undefined], [undefined, undefined]],
  ['single', false, false, true, [undefined, undefined], [undefined, undefined]],

  ['multiple', false, false, false, [undefined, undefined], ['desc', 0]],
  ['multiple', true, false, false, ['asc', 0], ['desc', 1]],
  ['multiple', false, true, false, ['asc', 0], [undefined, undefined]],
  ['multiple', false, false, true, ['asc', 0], [undefined, undefined]],
] as [
  string,
  boolean,
  boolean,
  boolean,
  [
    string | undefined,
    number | undefined,
  ],
  [
    string | undefined,
    number | undefined,
  ],
][]
).forEach(([
  mode,
  shift,
  ctrl,
  meta,
  [
    titleSortOrder,
    titleSortIndex,
  ],
  [
    nameSortOrder,
    nameSortIndex,
  ],
]) => {
  test(`Change sorting of neighbour sorted item in ${mode} mode with shift=${shift}, ctrl=${ctrl}, meta=${meta}`, async (t) => {
    const cardView = new CardView('#container');
    const titleHeaderItem = cardView.getHeaders().getHeaderItemByText('Title');
    const nameHeaderItem = cardView.getHeaders().getHeaderItemByText('Name');

    await t
      .click(titleHeaderItem.element)
      .click(nameHeaderItem.element, {
        modifiers: {
          shift: true,
        },
      });

    await t
      .click(nameHeaderItem.element, {
        modifiers: {
          shift,
          ctrl,
          meta,
        },
      })
      .expect(cardView.apiColumnOption('title', 'sortOrder'))
      .eql(titleSortOrder)
      .expect(cardView.apiColumnOption('title', 'sortIndex'))
      .eql(titleSortIndex)
      .expect(cardView.apiColumnOption('name', 'sortOrder'))
      .eql(nameSortOrder)
      .expect(cardView.apiColumnOption('name', 'sortIndex'))
      .eql(nameSortIndex);
  }).before(async () => {
    await createWidget('dxCardView', {
      dataSource: data,
      sorting: {
        mode,
      },
      columns: [
        {
          dataField: 'title',
        },
        {
          dataField: 'name',
        },
      ],
    });
  });
});

const SORT_ACSENDING_MENUITEM_INDEX = 0;
const SORT_DESCENDING_MENUITEM_INDEX = 1;
const CLEAR_SORTING_MENUITEM_INDEX = 2;

([
  ['none', SORT_ACSENDING_MENUITEM_INDEX, [undefined, undefined]],
  ['none', SORT_DESCENDING_MENUITEM_INDEX, [undefined, undefined]],
  ['none', CLEAR_SORTING_MENUITEM_INDEX, [undefined, undefined]],
  ['single', SORT_ACSENDING_MENUITEM_INDEX, ['asc', undefined]],
  ['single', SORT_DESCENDING_MENUITEM_INDEX, ['desc', undefined]],
  ['single', CLEAR_SORTING_MENUITEM_INDEX, [undefined, undefined]],
  ['multiple', SORT_ACSENDING_MENUITEM_INDEX, ['asc', 0]],
  ['multiple', SORT_DESCENDING_MENUITEM_INDEX, ['desc', 0]],
  ['multiple', CLEAR_SORTING_MENUITEM_INDEX, [undefined, undefined]],
] as [
  string,
  number,
  [
    string | undefined,
    number | undefined,
  ],
][]).forEach(([
  mode,
  menuItemIndex,
  [
    titleSortOrder,
    titleSortIndex,
  ]]) => {
  test(`Change sorting of sorted item in ${mode} mode with ${menuItemIndex} context menu item`, async (t) => {
    const cardView = new CardView('#container');
    const titleHeaderItem = cardView.getHeaders().getHeaderItemByText('Title');

    await t
      .rightClick(titleHeaderItem.element)
      .click(cardView.getContextMenu().getItemWrapperByIndex(menuItemIndex));

    await t
      .expect(cardView.apiColumnOption('title', 'sortOrder'))
      .eql(titleSortOrder)
      .expect(cardView.apiColumnOption('title', 'sortIndex'))
      .eql(titleSortIndex);

    // Note: To ensure context menu is closed
    await t
      .click(Selector('body'))
      .expect(cardView.getContextMenu().element.exists)
      .notOk();
  }).before(async () => {
    await createWidget('dxCardView', {
      dataSource: data,
      sorting: {
        mode,
      },
      columns: [
        {
          dataField: 'title',
        },
        {
          dataField: 'name',
        },
      ],
    });
  });
});

([
  ['none', SORT_ACSENDING_MENUITEM_INDEX, [undefined, undefined], [undefined, undefined]],
  ['none', SORT_DESCENDING_MENUITEM_INDEX, [undefined, undefined], [undefined, undefined]],
  ['none', CLEAR_SORTING_MENUITEM_INDEX, [undefined, undefined], [undefined, undefined]],
  ['single', SORT_ACSENDING_MENUITEM_INDEX, [undefined, undefined], ['asc', undefined]],
  ['single', SORT_DESCENDING_MENUITEM_INDEX, [undefined, undefined], ['desc', undefined]],
  ['single', CLEAR_SORTING_MENUITEM_INDEX, ['asc', undefined], [undefined, undefined]],
  ['multiple', SORT_ACSENDING_MENUITEM_INDEX, ['asc', 0], ['asc', 1]],
  ['multiple', SORT_DESCENDING_MENUITEM_INDEX, ['asc', 0], ['desc', 1]],
  ['multiple', CLEAR_SORTING_MENUITEM_INDEX, ['asc', 0], [undefined, undefined]],
] as [
  string,
  number,
  [
    string | undefined,
    number | undefined,
  ],
  [
    string | undefined,
    number | undefined,
  ],
][]).forEach(([
  mode,
  menuItemIndex,
  [
    titleSortOrder,
    titleSortIndex,
  ], [
    nameSortOrder,
    nameSortIndex,
  ]]) => {
  test(`Change sorting of neighbour non sorted item in ${mode} mode with ${menuItemIndex} context menu item`, async (t) => {
    const cardView = new CardView('#container');
    const titleHeaderItem = cardView.getHeaders().getHeaderItemByText('Title');
    const nameHeaderItem = cardView.getHeaders().getHeaderItemByText('Name');

    await t
      .click(titleHeaderItem.element);

    await t
      .rightClick(nameHeaderItem.element)
      .click(cardView.getContextMenu().getItemWrapperByIndex(menuItemIndex));

    await t
      .expect(cardView.apiColumnOption('title', 'sortOrder'))
      .eql(titleSortOrder)
      .expect(cardView.apiColumnOption('title', 'sortIndex'))
      .eql(titleSortIndex)
      .expect(cardView.apiColumnOption('name', 'sortOrder'))
      .eql(nameSortOrder)
      .expect(cardView.apiColumnOption('name', 'sortIndex'))
      .eql(nameSortIndex);

    // Note: Ensure context menu is closed
    await t
      .click(Selector('body'))
      .expect(cardView.getContextMenu().element.exists)
      .notOk();
  }).before(async () => {
    await createWidget('dxCardView', {
      dataSource: data,
      sorting: {
        mode,
      },
      columns: [
        {
          dataField: 'title',
        },
        {
          dataField: 'name',
        },
      ],
    });
  });
});

([
  ['none', SORT_ACSENDING_MENUITEM_INDEX, [undefined, undefined], [undefined, undefined]],
  ['none', SORT_DESCENDING_MENUITEM_INDEX, [undefined, undefined], [undefined, undefined]],
  ['none', CLEAR_SORTING_MENUITEM_INDEX, [undefined, undefined], [undefined, undefined]],
  ['single', SORT_ACSENDING_MENUITEM_INDEX, [undefined, undefined], ['asc', undefined]],
  ['single', SORT_DESCENDING_MENUITEM_INDEX, [undefined, undefined], ['desc', undefined]],
  ['single', CLEAR_SORTING_MENUITEM_INDEX, [undefined, undefined], [undefined, undefined]],
  ['multiple', SORT_ACSENDING_MENUITEM_INDEX, ['asc', 0], ['asc', 1]],
  ['multiple', SORT_DESCENDING_MENUITEM_INDEX, ['asc', 0], ['desc', 1]],
  ['multiple', CLEAR_SORTING_MENUITEM_INDEX, ['asc', 0], [undefined, undefined]],
] as [
  string,
  number,
  [
    string | undefined,
    number | undefined,
  ],
  [
    string | undefined,
    number | undefined,
  ],
][]).forEach(([
  mode,
  menuItemIndex,
  [
    titleSortOrder,
    titleSortIndex,
  ], [
    nameSortOrder,
    nameSortIndex,
  ]]) => {
  test(`Change sorting of neighbour sorted item in ${mode} mode with ${menuItemIndex} context menu item`, async (t) => {
    const cardView = new CardView('#container');
    const titleHeaderItem = cardView.getHeaders().getHeaderItemByText('Title');
    const nameHeaderItem = cardView.getHeaders().getHeaderItemByText('Name');

    await t
      .click(titleHeaderItem.element)
      .click(nameHeaderItem.element, {
        modifiers: {
          shift: true,
        },
      });

    await t
      .rightClick(nameHeaderItem.element)
      .click(cardView.getContextMenu().getItemWrapperByIndex(menuItemIndex));

    await t
      .expect(cardView.apiColumnOption('title', 'sortOrder'))
      .eql(titleSortOrder)
      .expect(cardView.apiColumnOption('title', 'sortIndex'))
      .eql(titleSortIndex)
      .expect(cardView.apiColumnOption('name', 'sortOrder'))
      .eql(nameSortOrder)
      .expect(cardView.apiColumnOption('name', 'sortIndex'))
      .eql(nameSortIndex);

    // Note: Ensure context menu is closed
    await t
      .click(Selector('body'))
      .expect(cardView.getContextMenu().element.exists)
      .notOk();
  }).before(async () => {
    await createWidget('dxCardView', {
      dataSource: data,
      sorting: {
        mode,
      },
      columns: [
        {
          dataField: 'title',
        },
        {
          dataField: 'name',
        },
      ],
    });
  });
});

test('Sorting should work with computed columns', async (t) => {
  const cardView = new CardView('#container');
  const headerItem = cardView.getHeaders().getHeaderItemByText('Computed');

  await t.click(headerItem.element);

  const getCardTexts = async () => {
    await t.expect(cardView.getCards().count).eql(4);

    return [
      await cardView.getCard(0).getFieldValueCell('Computed').textContent,
      await cardView.getCard(1).getFieldValueCell('Computed').textContent,
      await cardView.getCard(2).getFieldValueCell('Computed').textContent,
      await cardView.getCard(3).getFieldValueCell('Computed').textContent,
    ];
  };

  await t.expect(await getCardTexts()).eql(['str_0', 'str_1', 'str_2', 'str_3']);

  await t.click(headerItem.element);

  await t.expect(await getCardTexts()).eql(['str_3', 'str_2', 'str_1', 'str_0']);
}).before(async () => {
  await createWidget('dxCardView', {
    dataSource: [
      { id: 0 }, { id: 1 }, { id: 2 }, { id: 3 },
    ],
    keyExpr: 'id',
    columns: [
      {
        caption: 'Computed',
        allowSorting: true,
        calculateFieldValue: ({ id }) => `str_${id}`,
      },
    ],
  });
});
