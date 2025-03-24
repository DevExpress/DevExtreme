import CardView from 'devextreme-testcafe-models/cardView';
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
