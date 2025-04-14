import CardView from 'devextreme-testcafe-models/cardView';
import Button from 'devextreme-testcafe-models/button';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { baseConfig } from './helpers/baseConfig';

fixture.disablePageReloads`CardView - FilterPanel Behavior`
  .page(url(__dirname, '../../container.html'));

test('filterEnabled checkbox switches the filter by click', async (t) => {
  const cardView = new CardView('#container');
  const filterEnabledCheckbox = cardView.getFilterPanel().getFilterEnabledCheckbox();
  await t
    .expect(filterEnabledCheckbox.isChecked)
    .notOk()
    .expect(cardView.getCards().count)
    .eql(4);

  await t
    .click(filterEnabledCheckbox.element)
    .expect(filterEnabledCheckbox.isChecked)
    .ok()
    .expect(cardView.getCards().count)
    .eql(3);

  await t
    .click(filterEnabledCheckbox.element)
    .expect(filterEnabledCheckbox.isChecked)
    .notOk()
    .expect(cardView.getCards().count)
    .eql(4);
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

test('filterEnabled checkbox switches the filter by keyboard', async (t) => {
  const cardView = new CardView('#container');
  const startButton = new Button('#otherContainer');
  const filterEnabledCheckbox = cardView.getFilterPanel().getFilterEnabledCheckbox();

  await t
    .expect(filterEnabledCheckbox.isChecked)
    .notOk()
    .expect(cardView.getCards().count)
    .eql(4);

  await t
    .click(startButton.element)
    .pressKey('shift+tab shift+tab shift+tab shift+tab')
    .pressKey('space')
    .expect(filterEnabledCheckbox.isChecked)
    .ok()
    .expect(cardView.getCards().count)
    .eql(3);

  await t
    .click(startButton.element) // TODO: remove this when checkbox focus loosing is fixed
    .pressKey('shift+tab shift+tab shift+tab shift+tab')
    .pressKey('space')
    .expect(filterEnabledCheckbox.isChecked)
    .notOk()
    .expect(cardView.getCards().count)
    .eql(4);
}).before(async () => {
  await createWidget('dxButton', {
    text: 'Click Here First',
  }, '#otherContainer');

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

test('FilterIcon opens popup by click', async (t) => {
  const cardView = new CardView('#container');
  const popup = cardView.getFilterPanel().getFilterBuilderPopup();

  await t
    .expect(popup.element.exists)
    .notOk()
    .click(cardView.getFilterPanel().getIconFilter().element)
    .expect(popup.element.exists)
    .ok();
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
  });
});

test('FilterIcon opens popup by keyboard', async (t) => {
  const cardView = new CardView('#container');
  const startButton = new Button('#otherContainer');
  const popup = cardView.getFilterPanel().getFilterBuilderPopup();

  await t
    .expect(popup.element.exists)
    .notOk()
    .click(startButton.element)
    .pressKey('shift+tab shift+tab')
    .pressKey('enter')
    .expect(popup.element.exists)
    .ok();
}).before(async () => {
  await createWidget('dxButton', {
    text: 'Click Here First',
  }, '#otherContainer');

  await createWidget('dxCardView', {
    ...baseConfig,
  });
});

test('FilterText opens popup by click', async (t) => {
  const cardView = new CardView('#container');
  const popup = cardView.getFilterPanel().getFilterBuilderPopup();

  await t
    .expect(popup.element.exists)
    .notOk()
    .click(cardView.getFilterPanel().getFilterText().element)
    .expect(popup.element.exists)
    .ok();
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
  });
});

test('FilterText opens popup by click by keyboard', async (t) => {
  const cardView = new CardView('#container');
  const startButton = new Button('#otherContainer');
  const popup = cardView.getFilterPanel().getFilterBuilderPopup();

  await t
    .expect(popup.element.exists)
    .notOk()
    .click(startButton.element)
    .pressKey('shift+tab')
    .pressKey('enter')
    .expect(popup.element.exists)
    .ok();
}).before(async () => {
  await createWidget('dxButton', {
    text: 'Click Here First',
  }, '#otherContainer');

  await createWidget('dxCardView', {
    ...baseConfig,
  });
});

test('ClearFilter button clears filter by click', async (t) => {
  const cardView = new CardView('#container');

  await t
    .expect(cardView.option('filterValue'))
    .eql(['title', '=', 'Mr.']);

  await t
    .click(cardView.getFilterPanel().getClearFilterButton().element)
    .expect(cardView.option('filterValue'))
    .eql(null);
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    filterValue: ['title', '=', 'Mr.'],
  });
});

test('ClearFilter button clears filter by keyboard', async (t) => {
  const cardView = new CardView('#container');
  const startButton = new Button('#otherContainer');

  await t
    .expect(cardView.option('filterValue'))
    .eql(['title', '=', 'Mr.']);

  await t
    .click(startButton.element)
    .pressKey('shift+tab')
    .pressKey('enter')
    .expect(cardView.option('filterValue'))
    .eql(null);
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    filterValue: ['title', '=', 'Mr.'],
  });

  await createWidget('dxButton', {
    text: 'Click Here First',
  }, '#otherContainer');
});

test('Focus returns to FilterIcon after FilterPopup is closed', async (t) => {
  const cardView = new CardView('#container');
  const startButton = new Button('#otherContainer');
  const filterIcon = cardView.getFilterPanel().getIconFilter();

  await t
    .click(startButton.element)
    .pressKey('shift+tab shift+tab')
    .expect(filterIcon.element.focused)
    .ok()
    .pressKey('enter')
    .expect(filterIcon.element.focused)
    .notOk()
    .pressKey('esc')
    .expect(filterIcon.element.focused)
    .ok();
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
  });

  await createWidget('dxButton', {
    text: 'Click Here First',
  }, '#otherContainer');
});
