import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { baseConfig } from './helpers/baseConfig';

fixture.disablePageReloads`CardView - SearchPanel API`
  .page(url(__dirname, '../../container.html'));

test('searchPanel.visible API', async (t) => {
  const cardView = new CardView('#container');
  const searchBox = cardView.getSearchBox();

  await t
    .expect(searchBox.element.exists)
    .ok();

  await cardView.apiOption('searchPanel.visible', false);

  await t
    .expect(searchBox.element.exists)
    .notOk();

  await cardView.apiOption('searchPanel.visible', true);

  await t
    .expect(searchBox.element.exists)
    .ok();
}).before(async () => {
  await createWidget('dxCardView', baseConfig);
});

test('searchPanel.width API', async (t) => {
  const cardView = new CardView('#container');
  const searchBox = cardView.getSearchBox();

  await t
    .expect(searchBox.element.getBoundingClientRectProperty('width'))
    .eql(300);

  await cardView.apiOption('searchPanel.width', 200);

  await t
    .expect(searchBox.element.getBoundingClientRectProperty('width'))
    .eql(200);
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    searchPanel: {
      ...baseConfig.searchPanel,
      width: 300,
    },
  });
});

test('searchPanel.placeholder API', async (t) => {
  const cardView = new CardView('#container');
  const searchBox = cardView.getSearchBox();

  await t
    .expect(searchBox.getInput().getAttribute('placeholder'))
    .eql('Test placeholder');

  await cardView.apiOption('searchPanel.placeholder', 'Test placeholder 2');

  await t
    .expect(searchBox.getInput().getAttribute('placeholder'))
    .eql('Test placeholder 2');
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    searchPanel: {
      ...baseConfig.searchPanel,
      placeholder: 'Test placeholder',
    },
  });
});

test('searchPanel.text API', async (t) => {
  const cardView = new CardView('#container');
  const searchBox = cardView.getSearchBox();

  await t
    .expect(searchBox.getInput().value)
    .eql('rt');

  await cardView.apiOption('searchPanel.text', '');

  await t
    .expect(searchBox.getInput().value)
    .eql('');
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    searchPanel: {
      ...baseConfig.searchPanel,
      text: 'rt',
    },
  });
});

test('searchPanel.text API from UI', async (t) => {
  const cardView = new CardView('#container');
  const searchBox = cardView.getSearchBox().getInput();

  await t
    .typeText(searchBox, 'rt')
    .expect(cardView.apiOption('searchPanel.text')).eql('rt');
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    searchPanel: {
      ...baseConfig.searchPanel,
      text: '',
    },
  });
});

test('searchPanel.searchVisibleColumnsOnly API', async (t) => {
  const cardView = new CardView('#container');
  const searchInput = cardView.getSearchBox().getInput();

  await t
    .expect(cardView.getCards().count)
    .eql(4)
    .typeText(searchInput, '2')
    .expect(cardView.getCards().count)
    .eql(1);

  await cardView.apiOption('searchPanel.searchVisibleColumnsOnly', true);

  await t
    .expect(cardView.getCards().count)
    .eql(0);
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    columns: [
      {
        dataField: 'id',
        visible: false,
      },
      {
        dataField: 'title',
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

test('searchPanel.highlightSearchText API', async (t) => {
  const cardView = new CardView('#container');
  const searchInput = cardView.getSearchBox().getInput();

  await t
    .expect(cardView.getCards().count)
    .eql(4)
    .typeText(searchInput, 'rt')
    .expect(cardView.getCards().count)
    .eql(2)
    .expect(cardView.getCard(0).getHighlightedTexts().count)
    .eql(1)
    .expect(cardView.getCard(0).getHighlightedTexts().nth(0).innerText)
    .eql('rt')
    .expect(cardView.getCard(0).getFieldValueCell('Last Name').innerText)
    .eql('Heart');

  await cardView.apiOption('searchPanel.highlightSearchText', false);

  await t
    .expect(cardView.getCards().count)
    .eql(2)
    .expect(cardView.getCard(0).getHighlightedTexts().count)
    .eql(0);
}).before(async () => {
  await createWidget('dxCardView', baseConfig);
});

test('searchPanel.highlightCaseSensitive API', async (t) => {
  const cardView = new CardView('#container');
  const searchInput = cardView.getSearchBox().getInput();

  await t
    .expect(cardView.getCards().count)
    .eql(4)
    .typeText(searchInput, 'rt')
    .expect(cardView.getCards().count)
    .eql(2)
    .expect(cardView.getCard(0).getHighlightedTexts().count)
    .eql(1)
    .expect(cardView.getCard(0).getHighlightedTexts().nth(0).innerText)
    .eql('rt')
    .expect(cardView.getCard(0).getFieldValueCell('Last Name').innerText)
    .eql('Heart');

  await t
    .typeText(searchInput, 'RT', { replace: true })
    .expect(cardView.getCards().count)
    .eql(2)
    .expect(cardView.getCard(0).getHighlightedTexts().count)
    .eql(0);

  await cardView.apiOption('searchPanel.highlightCaseSensitive', false);

  await t
    .expect(cardView.getCard(0).getHighlightedTexts().count)
    .eql(1)
    .expect(cardView.getCard(0).getHighlightedTexts().nth(0).innerText)
    .eql('rt')
    .expect(cardView.getCard(0).getFieldValueCell('Last Name').innerText)
    .eql('Heart');
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    searchPanel: {
      ...baseConfig.searchPanel,
      highlightCaseSensitive: true,
    },
  });
});
