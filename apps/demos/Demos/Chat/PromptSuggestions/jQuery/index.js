$(() => {
  const store = [];
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
  ];

  DevExpress.localization.loadMessages({
    en: {
      'dxChat-emptyListMessage': 'Chat is Empty',
      'dxChat-emptyListPrompt': 'Your Shopping AI Assistant is ready to help. Ask a question or choose one of the suggested prompts to get started.',
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
      max_completion_tokens: 1000,
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
    isDisabled = disabled;
    instance.option({ suggestions: { disabled } });
    instance.element().toggleClass(CHAT_DISABLED_CLASS, disabled);

    if (disabled) {
      event?.target.blur();
    } else {
      event?.target.focus();
    }
  }

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

  function renderAssistantMessage(text) {
    const message = {
      id: Date.now(),
      timestamp: new Date(),
      author: assistant,
      text,
    };

    dataSource.store().push([{ type: 'insert', data: message }]);
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

  function renderMessageContent(message, element) {
    $('<div>')
      .addClass('chat-messagebubble-text')
      .html(convertToHtml(message.text))
      .appendTo(element);
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

  let isDisabled = false;
  let sendImmediately = false;
  let hideAfterUse = false;

  const suggestions = {
    items: suggestionItems,
    onItemClick(e) {
      const { prompt, text } = e.itemData;

      if (hideAfterUse) {
        const currentSuggestions = instance.option('suggestions');
        instance.option('suggestions', { items: currentSuggestions.items.filter((item) => item.text !== text) });
      }

      if (sendImmediately) {
        const message = { id: Date.now(), timestamp: new Date(), author: user, text: prompt };

        dataSource.store().push([{ type: 'insert', data: message }]);

        if (!instance.option('alerts').length) {
          processMessageSending(message);
        }
      } else {
        instance.option('inputFieldText', prompt);
      }
    },
  };

  const instance = $('#dx-ai-chat').dxChat({
    user,
    height: 520,
    dataSource,
    reloadOnChange: false,
    showAvatar: false,
    showDayHeaders: false,
    speechToTextEnabled: true,
    suggestions,
    onMessageEntered: (e) => {
      if (isDisabled) return;

      const { message, event } = e;

      dataSource.store().push([{ type: 'insert', data: { id: Date.now(), ...message } }]);

      if (!instance.option('alerts').length) {
        processMessageSending(message, event);
      }
    },
    messageTemplate: (data, element) => {
      const { message } = data;

      renderMessageContent(message, element);
    },
  }).dxChat('instance');

  $('#send-immediately').dxSwitch({
    value: sendImmediately,
    onValueChanged(e) {
      sendImmediately = e.value;
    },
  });

  $('#hide-after-use').dxSwitch({
    value: hideAfterUse,
    onValueChanged(e) {
      hideAfterUse = e.value;
    },
  });
});
