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
      model: deployment,
      max_tokens: 1000,
      temperature: 0.7,
    };

    const response = await chatService.chat.completions.create(params);
    const data = { choices: response.choices };

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
    }, ALERT_TIMEOUT);
  }

  function toggleDisabledState(disabled, event) {
    instance.element().toggleClass(CHAT_DISABLED_CLASS, disabled);

    if (disabled) {
      event?.target.blur();
    } else {
      event?.target.focus();
    }
  };

  async function processMessageSending(message, event) {
    toggleDisabledState(true, event);

    messages.push({ role: 'user', content: message.text });
    instance.option({ typingUsers: [assistant] });

    try {
      const aiResponse = await getAIResponse(messages);

      setTimeout(() => {
        instance.option({ typingUsers: [] });

        messages.push({ role: 'assistant', content: aiResponse });

        renderAssistantMessage(aiResponse);
      }, 200);
    } catch {
      instance.option({ typingUsers: [] });
      messages.pop();
      alertLimitReached();
    } finally {
      toggleDisabledState(false, event);
    }
  }

  async function regenerate() {
    toggleDisabledState(true);

    try {
      const aiResponse = await getAIResponse(messages.slice(0, -1));

      updateLastMessage(aiResponse);
      messages.at(-1).content = aiResponse;
    } catch {
      updateLastMessage(messages.at(-1).content);
      alertLimitReached();
    } finally {
      toggleDisabledState(false);
    }
  }

  function renderAssistantMessage(text) {
    const message = {
      id: Date.now(),
      timestamp: new Date(),
      author: assistant,
      text,
    };

    dataSource.store().push([{ type: 'insert', data: message }]);
  }

  function updateLastMessage(text) {
    const items = dataSource.items();
    const lastMessage = items.at(-1);
    const data = {
      text: text ?? REGENERATION_TEXT,
    };

    dataSource.store().push([{
      type: 'update',
      key: lastMessage.id,
      data,
    }]);
  }

  function convertToHtml(value) {
    const result = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeMinifyWhitespace)
      .use(rehypeStringify)
      .processSync(value)
      .toString();

    return result;
  }

  function onCopyButtonClick(component, text) {
    navigator.clipboard?.writeText(text);

    component.option({ icon: 'check' });

    setTimeout(() => {
      component.option({ icon: 'copy' });
    }, 2500);
  }

  function onRegenerateButtonClick() {
    if (instance.option('alerts').length) {
      return;
    }

    updateLastMessage();
    regenerate();
  }

  function renderMessageContent(message, element) {
    $('<div>')
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
          onCopyButtonClick(component, message.text);
        },
      })
      .appendTo($buttonContainer);

    $('<div>')
      .dxButton({
        icon: 'refresh',
        stylingMode: 'text',
        hint: 'Regenerate',
        onClick: onRegenerateButtonClick,
      })
      .appendTo($buttonContainer);

    $buttonContainer.appendTo(element);
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
  
  const dataSource = new DevExpress.data.DataSource({
    store: customStore,
    paginate: false,
  });

  const instance = $('#dx-ai-chat').dxChat({
    user,
    height: 710,
    dataSource,
    reloadOnChange: false,
    showAvatar: false,
    showDayHeaders: false,
    onMessageEntered: (e) => {
      const { message, event } = e;

      dataSource.store().push([{ type: 'insert', data: { id: Date.now(), ...message } }]);
      
      if (!instance.option('alerts').length) {
        processMessageSending(message, event);
      }
    },
    messageTemplate: (data, element) => {
      const { message } = data;

      if (message.text === REGENERATION_TEXT) {
        element.text(REGENERATION_TEXT);
        return;
      }

      renderMessageContent(message, element);
    },
  }).dxChat('instance');
});
