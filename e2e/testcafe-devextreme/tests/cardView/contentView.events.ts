import CardView from 'devextreme-testcafe-models/cardView';
import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture.disablePageReloads`CardView - ContentView - events`
  .page(url(__dirname, '../container.html'));

const CARD_VIEW_SELECTOR = '#container';

declare global {
  interface Window {
    dxCardViewEventTest: any;
  }
}

const CONFIG = {
  dataSource: [
    { caption1: 'value11', caption2: 'value21', caption3: 'value31' },
    { caption1: 'value12', caption2: 'value22', caption3: 'value32' },
    { caption1: 'value13', caption2: 'value23', caption3: 'value33' },
    { caption1: 'value14', caption2: 'value24', caption3: 'value34' },
    { caption1: 'value15', caption2: 'value25', caption3: 'value35' },
  ],
  onCardClick(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onCardClick ??= [];
    window.dxCardViewEventTest.onCardClick.push(e);
  },
  onCardDblClick(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onCardDblClick ??= [];
    window.dxCardViewEventTest.onCardDblClick.push(e);
  },
  onCardPrepared(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onCardPrepared ??= [];
    window.dxCardViewEventTest.onCardPrepared.push(e);
  },
  onFieldCaptionClick(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onFieldCaptionClick ??= [];
    window.dxCardViewEventTest.onFieldCaptionClick.push(e);
  },
  onFieldCaptionDblClick(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onFieldCaptionDblClick ??= [];
    window.dxCardViewEventTest.onFieldCaptionDblClick.push(e);
  },
  onFieldCaptionPrepared(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onFieldCaptionPrepared ??= [];
    window.dxCardViewEventTest.onFieldCaptionPrepared.push(e);
  },
  onFieldValueClick(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onFieldValueClick ??= [];
    window.dxCardViewEventTest.onFieldValueClick.push(e);
  },
  onFieldValueDblClick(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onFieldValueDblClick ??= [];
    window.dxCardViewEventTest.onFieldValueDblClick.push(e);
  },
  onFieldValuePrepared(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onFieldValuePrepared ??= [];
    window.dxCardViewEventTest.onFieldValuePrepared.push(e);
  },
  onCardHoverChanged(e) {
    window.dxCardViewEventTest ??= {};
    window.dxCardViewEventTest.onCardHoverChanged ??= [];
    window.dxCardViewEventTest.onCardHoverChanged.push(e);
  },
  onDisposing() {
    delete window.dxCardViewEventTest;
  },
};

interface TestModel {
  eventName: string;

  action: (t: TestController, cardView: CardView) => Promise<void>;

  additionalAssertOnClient?: (event: any) => boolean;

  eventCount?: number;
}

function testFactory({
  eventName,
  action,
  additionalAssertOnClient,
  eventCount = 1,
}: TestModel) {
  test(eventName, async (t) => {
    const cardView = new CardView(CARD_VIEW_SELECTOR);

    await action(t, cardView);

    const actualEventCount = await ClientFunction(
      () => window.dxCardViewEventTest[eventName].length,
      { dependencies: { eventName } },
    )();

    await t.expect(actualEventCount).eql(eventCount);

    if (additionalAssertOnClient) {
      const result = await ClientFunction(
        () => additionalAssertOnClient(
          window.dxCardViewEventTest[eventName][0],
        ),
        { dependencies: { additionalAssertOnClient, eventName } },
      )();

      await t.expect(result).ok();
    }
  }).before(async () => createWidget('dxCardView', CONFIG));
}

function assertCardInfo(event) {
  if (event.card.index !== 0) {
    return false;
  }

  if (!event.cardElement) {
    return false;
  }

  return true;
}

testFactory({
  eventName: 'onCardClick',
  async action(t, cardView) {
    await t.click(cardView.getCard(0).element);
  },
  additionalAssertOnClient: assertCardInfo,
});
testFactory({
  eventName: 'onCardDblClick',
  async action(t, cardView) {
    await t.doubleClick(cardView.getCard(0).element);
  },
  additionalAssertOnClient: assertCardInfo,
});
testFactory({
  eventName: 'onCardPrepared',
  async action() {
    // pass (we just need render)
  },
  additionalAssertOnClient: assertCardInfo,
  eventCount: 5,
});

function assertFieldCaptionInfo(event) {
  if (event.field.index !== 0) {
    return false;
  }

  if (event.field.card.index !== 0) {
    return false;
  }

  if (!event.fieldCaptionElement) {
    return false;
  }

  return true;
}

testFactory({
  eventName: 'onFieldCaptionClick',
  async action(t, cardView) {
    await t.click(cardView.getCard(0).getFieldCaptionCell('Caption 1'));
  },
  additionalAssertOnClient: assertFieldCaptionInfo,
});
testFactory({
  eventName: 'onFieldCaptionDblClick',
  async action(t, cardView) {
    await t.doubleClick(cardView.getCard(0).getFieldCaptionCell('Caption 1'));
  },
  additionalAssertOnClient: assertFieldCaptionInfo,
});
testFactory({
  eventName: 'onFieldCaptionPrepared',
  async action() {
    // pass (we just need render)
  },
  additionalAssertOnClient: assertFieldCaptionInfo,
  eventCount: 15,
});

function assertFieldValueInfo(event) {
  if (event.field.index !== 0) {
    return false;
  }

  if (event.field.card.index !== 0) {
    return false;
  }

  if (!event.fieldValueElement) {
    return false;
  }

  return true;
}

testFactory({
  eventName: 'onFieldValueClick',
  async action(t, cardView) {
    await t.click(cardView.getCard(0).getFieldValueCell('Caption 1'));
  },
  additionalAssertOnClient: assertFieldValueInfo,
});
testFactory({
  eventName: 'onFieldValueDblClick',
  async action(t, cardView) {
    await t.doubleClick(cardView.getCard(0).getFieldValueCell('Caption 1'));
  },
  additionalAssertOnClient: assertFieldValueInfo,
});
testFactory({
  eventName: 'onFieldValuePrepared',
  async action() {
    // pass (we just need render)
  },
  additionalAssertOnClient: assertFieldValueInfo,
  eventCount: 15,
});
