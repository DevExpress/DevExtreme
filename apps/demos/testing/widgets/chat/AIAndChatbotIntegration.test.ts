import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';
import { widgetsGalleryServiceMock } from '../../apiMocks/widgetsGalleryServiceMock';
import { CHAT_ANSWER, CHAT_QUESTION } from '../../apiMocks/handlers/openai';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS = 'dx-chat-messagegroup-alignment-start';
const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
const BUTTON_CLASS = 'dx-button';

fixture('Chat.AIAndChatbotIntegration')
  .requestHooks(widgetsGalleryServiceMock)
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 800];
  });

runManualTest('Chat', 'AIAndChatbotIntegration', (test) => {
  test('AIAndChatbotIntegration', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const assistantMessageBubble = Selector(`.${CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS} .${CHAT_MESSAGEBUBBLE_CLASS}`);
    const copyButton = assistantMessageBubble.find(`.${BUTTON_CLASS}`).nth(0);

    await t
      .typeText(`.${TEXTEDITOR_INPUT_CLASS}`, CHAT_QUESTION)
      .pressKey('enter')
      .expect(assistantMessageBubble.withText(CHAT_ANSWER).exists)
      .ok()
      .hover(copyButton);

    await testScreenshot(t, takeScreenshot, 'chat_ai_and_chatbot_integration_copy_button_is_hovered.png', copyButton);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
