import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { baseConfig } from './helpers/baseConfig';

fixture.disablePageReloads`CardView - FilterPanel API`
  .page(url(__dirname, '../../container.html'));

test('filterPanel.customizeText API', async (t) => {
  const cardView = new CardView('#container');

  await t
    .expect(cardView.getFilterPanel().getFilterText().element.innerText)
    .eql('Men');

  await cardView.apiOption('filterPanel.customizeText', (e) => {
    if (e.text === '[Title] Equals \'Mr.\'') {
      return 'Not women';
    }
    if (e.text === '[Title] Equals \'Mrs.\'') {
      return 'Not men';
    }
    return e.text;
  });

  await t
    .expect(cardView.getFilterPanel().getFilterText().element.innerText)
    .eql('Not women');
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    ...{
      filterValue: ['title', '=', 'Mr.'],
      filterPanel: {
        ...baseConfig.filterPanel,
        customizeText(e) {
          if (e.text === '[Title] Equals \'Mr.\'') {
            return 'Men';
          }
          if (e.text === '[Title] Equals \'Mrs.\'') {
            return 'Women';
          }
          return e.text;
        },
      },
    },
  });
});

test('filterEnabled API', async (t) => {
  const cardView = new CardView('#container');
  await t
    .expect(cardView.getFilterPanel().getFilterEnabledCheckbox().isChecked)
    .notOk()
    .expect(cardView.getCards().count)
    .eql(4);

  await cardView.apiOption('filterPanel.filterEnabled', true);

  await t
    .expect(cardView.getFilterPanel().getFilterEnabledCheckbox().isChecked)
    .ok()
    .expect(cardView.getCards().count)
    .eql(3);
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    ...{
      filterValue: ['title', '=', 'Mr.'],
      filterPanel: {
        ...baseConfig.filterPanel,
        filterEnabled: false,
      },
    },
  });
});

test('filterPanel.texts API', async (t) => {
  const cardView = new CardView('#container');
  const filterPanel = cardView.getFilterPanel();
  await t
    .expect(filterPanel.getFilterEnabledCheckbox().element.getAttribute('title'))
    .eql('Custom Filter Enabled Hint')
    .expect(filterPanel.getClearFilterButton().element.innerText)
    .eql('Custom Clear Filter');

  await cardView.apiOption('filterPanel.texts.clearFilter', 'Custom Clear Filter2');
  await cardView.apiOption('filterPanel.texts.filterEnabledHint', 'Custom Filter Enabled Hint2');

  await t
    .expect(filterPanel.getFilterEnabledCheckbox().element.getAttribute('title'))
    .eql('Custom Filter Enabled Hint2')
    .expect(filterPanel.getClearFilterButton().element.innerText)
    .eql('Custom Clear Filter2');

  await t
    .click(filterPanel.getClearFilterButton().element)
    .expect(filterPanel.getFilterText().element.innerText)
    .eql('Custom Create Filter');

  await cardView.apiOption('filterPanel.texts.createFilter', 'Custom Create Filter2');

  await t
    .expect(filterPanel.getFilterText().element.innerText)
    .eql('Custom Create Filter2');
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    ...{
      filterValue: ['title', '=', 'Mr.'],
      filterPanel: {
        ...baseConfig.filterPanel,
        texts: {
          clearFilter: 'Custom Clear Filter',
          createFilter: 'Custom Create Filter',
          filterEnabledHint: 'Custom Filter Enabled Hint',
        },
      },
    },
  });
});

test('filterPanel.visible API', async (t) => {
  const cardView = new CardView('#container');

  await t
    .expect(cardView.getFilterPanel().element.exists)
    .notOk();

  await cardView.apiOption('filterPanel.visible', true);

  await t
    .expect(cardView.getFilterPanel().element.exists)
    .ok();
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    ...{
      filterValue: ['title', '=', 'Mr.'],
      filterPanel: {
        ...baseConfig.filterPanel,
        visible: false,
      },
    },
  });
});

test('filterValue API', async (t) => {
  const cardView = new CardView('#container');
  const filterText = cardView.getFilterPanel().getFilterText();

  await t
    .expect(filterText.element.innerText)
    .eql('[Title] Equals \'Mr.\'');

  await cardView.apiOption('filterValue', ['title', '=', 'Mrs.']);

  await t
    .expect(filterText.element.innerText)
    .eql('[Title] Equals \'Mrs.\'');
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    ...{
      filterValue: ['title', '=', 'Mr.'],
    },
  });
});

test('clearFilter API', async (t) => {
  const cardView = new CardView('#container');
  const filterText = cardView.getFilterPanel().getFilterText();

  await t
    .expect(filterText.element.innerText)
    .eql('[Title] Equals \'Mr.\'')
    .expect(cardView.getCards().count)
    .eql(3);

  await cardView.apiClearFilter();

  await t
    .expect(filterText.element.innerText)
    .eql('Create Filter')
    .expect(cardView.getCards().count)
    .eql(4);
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    ...{
      filterValue: ['title', '=', 'Mr.'],
    },
  });
});
