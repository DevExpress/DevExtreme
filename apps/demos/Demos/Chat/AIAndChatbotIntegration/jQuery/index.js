$(() => {
  const store = [];
  const messages = [];

  DevExpress.localization.loadMessages({
    en: {
      'dxChat-emptyListMessage': 'Chat is Empty',
      'dxChat-emptyListPrompt': 'AI Assistant is ready to answer your questions.',
      'dxChat-textareaPlaceholder': 'Ask AI Assistant...',
    },
  });

  const chatService = new AzureOpenAI({
    dangerouslyAllowBrowser: true,
    deployment,
    endpoint,
    apiVersion,
    apiKey,
  });

  async function getAIResponse(messages) {
    const params = {
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    };

    const responseAzure = await chatService.chat.completions.create(params);
    const data = { choices: responseAzure.choices };

    return data.choices[0].message?.content;
  }

  function alertLimitReached() {
    instance.option({
      alerts: [{
        message: 'Request limit reached, try again in a minute.',
      }],
    });

    setTimeout(() => {
      instance.option({ alerts: [] });
    }, 10000);
  }

  async function processMessageSending() {
    instance.option({ typingUsers: [assistant] });

    try {
      const aiResponse = await getAIResponse(messages);

      setTimeout(() => {
        instance.option({ typingUsers: [] });

        messages.push({ role: 'assistant', content: aiResponse });

        renderMessage(aiResponse);
      }, 200);
    } catch {
      instance.option({ typingUsers: [] });
      alertLimitReached();
    }
  }

  async function regenerate() {
    try {
      const aiResponse = await getAIResponse(messages.slice(0, -1));

      updateLastMessage(aiResponse);
      messages.at(-1).content = aiResponse;
    } catch {
      updateLastMessage(messages.at(-1).content);
      alertLimitReached();
    }
  }

  function renderMessage(text) {
    const message = {
      id: Date.now(),
      timestamp: new Date(),
      author: assistant,
      text,
    };

    customStore.push([{ type: 'insert', data: message }]);
  }

  function updateLastMessage(text) {
    const { items } = instance.option();
    const lastMessage = items.at(-1);
    const data = {
      text: text ?? REGENERATION_TEXT,
    };

    customStore.push([{
      type: 'update',
      key: lastMessage.id,
      data,
    }]);
  }

  function convertToHtml(value) {
    const result = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .processSync(value)
      .toString();

    return result;
  }

  const customStore = new DevExpress.data.CustomStore({
    key: 'id',
    load: () => {
      const d = $.Deferred();

      setTimeout(() => {
        d.resolve([...store]);
      });

      return d.promise();
    },
    insert: (message) => {
      const d = $.Deferred();

      setTimeout(() => {
        store.push(message);
        d.resolve();
      });

      return d.promise();
    },
  });

  const instance = $('#dx-ai-chat').dxChat({
    dataSource: customStore,
    reloadOnChange: false,
    showAvatar: false,
    showDayHeaders: false,
    user,
    height: 710,
    onMessageEntered: (e) => {
      const { message } = e;

      customStore.push([{ type: 'insert', data: { id: Date.now(), ...message } }]);
      messages.push({ role: 'user', content: message.text });

      processMessageSending();
    },
    messageTemplate: (data, element) => {
      const { message } = data;

      if (message.text === REGENERATION_TEXT) {
        element.text(REGENERATION_TEXT);
        return;
      }

      const $textElement = $('<div>')
        .addClass('dx-chat-messagebubble-text')
        .html(convertToHtml(message.text))
        .appendTo(element);

      const $buttonContainer = $('<div>')
        .addClass('dx-bubble-button-container');

      $('<div>')
        .dxButton({
          icon: 'copy',
          stylingMode: 'text',
          hint: 'Copy',
          onClick: ({ component }) => {
            navigator.clipboard.writeText($textElement.text());
            component.option({ icon: 'check' });
            setTimeout(() => {
              component.option({ icon: 'copy' });
            }, 5000);
          },
        })
        .appendTo($buttonContainer);

      $('<div>')
        .dxButton({
          icon: 'refresh',
          stylingMode: 'text',
          hint: 'Regenerate',
          onClick: () => {
            updateLastMessage();
            regenerate();
          },
        })
        .appendTo($buttonContainer);

      $buttonContainer.appendTo(element);
    },
  }).dxChat('instance');
});
