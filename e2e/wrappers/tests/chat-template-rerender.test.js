import { Selector } from 'testcafe';
import { testInFramework } from '../test-helpers';

if(process.env.FRAMEWORK === 'react') {
  testInFramework('Chat template re-rendering', 'chat-template-rerender', [
      'Chat should be able to re-render its messages',
      async (t) => {
          const textarea = Selector('.dx-chat-messagebox textarea');
          const sendButton = Selector('.dx-chat-messagebox .dx-chat-textarea-toolbar .dx-button');
          const assistantBubble = Selector('.chat-messagebubble-text').nth(1);
          const regenerateButton = Selector('.dx-icon-refresh').nth(1);
      
          await t
            .typeText(textarea, 'Hi there!')
            .click(sendButton)
            .expect(assistantBubble.textContent).eql('How can I help you?')
            .click(regenerateButton)
            .expect(assistantBubble.textContent).eql('In other words, what do you want?');
      }
  ]);
}
