import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { changeTheme } from '../../../helpers/changeTheme';
import { Themes } from '../../../helpers/themes';
import { createWidget } from '../../../helpers/createWidget';
import CardView from 'devextreme-testcafe-models/cardView';

fixture.disablePageReloads`CardView - Sorting API`
  .page(url(__dirname, '../../container.html'));;

const data = [
  {
    id: 1,
    title: 'Mr.',
    name: 'John',
    lastName: 'Heart',
  },
  {
    id: 2,
    title: 'Mrs.',
    name: 'Olivia',
    lastName: 'Peyton',
  },
  {
    id: 3,
    title: 'Mr.',
    name: 'Robert',
    lastName: 'Reagan',
  },
  {
    id: 4,
    title: 'Mr.',
    name: 'Greta',
    lastName: 'Sims',
  },
];

test('Default render', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView('#container');

  await takeScreenshot('headers_default_render.png', cardView.element);
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
    await createWidget('dxCardView', {
      dataSource: data,
      columns: [
        {
          dataField: 'id',
        },
        {
          dataField: 'title',
          sortOrder: 'desc',
        },
        {
          dataField: 'name',
        },
        {
          dataField: 'lastName',
        },
      ],
    });
});
test('Default multiple sorting render', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView('#container');
  await takeScreenshot('headers_with_multiple_sorting_render.png', cardView.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
    await createWidget('dxCardView', {
      dataSource: data,
      columns: [
        {
          dataField: 'id',
        },
        {
          dataField: 'title',
          sortOrder: 'desc',
        },
        {
          dataField: 'name',
          sortOrder: 'asc',
        },
        {
          dataField: 'lastName',
        },
      ],
    });
});

([
  ['none', false, false, false, [undefined, undefined]],
  ['none', true, false, false,  [undefined, undefined]],
  ['none', false, true, false,  [undefined, undefined]],
  ['none', false, false, true,  [undefined, undefined]],

  ['single', false, false, false, ['desc', undefined]],
  ['single', true, false, false,  ['desc', undefined]],
  ['single', false, true, false,  [undefined, undefined]],
  ['single', false, false, true,  [undefined, undefined]],

  ['multiple', false, false, false, ['desc', 0]],
  ['multiple', true, false, false,  ['desc', 0]],
  ['multiple', false, true, false,  [undefined, undefined]],
  ['multiple', false, false, true,  [undefined, undefined]],
] as [
  string,
  boolean,
  boolean,
  boolean,
  [
    string | undefined,
    number | undefined,
  ]
][]
).forEach(([
  mode,
  shift,
  ctrl,
  meta,
  [
    titleSortOrder,
    titleSortIndex
  ]]) => {
  test(`Change sorting of sorted item in ${mode} mode with shift=${shift}, ctrl=${ctrl}, meta=${meta}`, async (t) => {
    const cardView = new CardView('#container');
    const titleHeaderItem = cardView.getHeaders().getHeaderItemByText('Title');
  
    await t
      .click(titleHeaderItem.element);
  
    await t
      .click(titleHeaderItem.element, { 
        modifiers: {
          shift: shift,
          ctrl: ctrl,
          meta: meta,
        }
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
