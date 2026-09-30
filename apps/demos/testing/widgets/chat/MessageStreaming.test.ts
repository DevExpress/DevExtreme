import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction, Selector } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const CHAT_SUGGESTION_CARD_CLASS = 'chat-suggestion-card';
const CHAT_MESSAGELIST_EMPTY_VIEW_CLASS = 'dx-chat-messagelist-empty-view';

const waitForTransitionsToEnd = ClientFunction((selector: string) => Promise.all(
  document.querySelector(selector)
    .getAnimations()
    .map((animation) => animation.finished),
).then(() => undefined));

fixture('Chat.MessageStreaming')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 800];
  });

runManualTest('Chat', 'MessageStreaming', (test) => {
  test('MessageStreaming', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const suggestionCard = Selector(`.${CHAT_SUGGESTION_CARD_CLASS}`);

    await t
      .hover(suggestionCard.nth(0))
      .expect(suggestionCard.nth(0).getStyleProperty('box-shadow'))
      .notEql('none');

    await waitForTransitionsToEnd(`.${CHAT_SUGGESTION_CARD_CLASS}`);

    await testScreenshot(t, takeScreenshot, 'chat_message_streaming_suggestion_card_is_hovered.png', `.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`, {
      looksSameComparisonOptions: { tolerance: 2.3, ignoreAntialiasing: false },
    });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
