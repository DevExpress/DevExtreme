$(() => {
  const store = [];
  const messages = [];
  let abortController = null;

  DevExpress.localization.loadMessages({
    en: {
      'dxChat-emptyListMessage': 'Chat is Empty',
      'dxChat-emptyListPrompt':
        'AI Assistant is ready to answer your questions.',
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

  async function getAIResponseStream(messages, { onDelta, onError, signal }) {
    const params = {
      messages,
      model: deployment,
      max_tokens: 1000,
      temperature: 0.7,
      stream: true,
    };

    try {
      const stream = await chatService.chat.completions.create(params, {
        signal,
      });

      // eslint-disable-next-line no-restricted-syntax
      for await (const event of stream) {
        const delta = event.choices?.[0]?.delta?.content;
        if (delta) {
          onDelta(delta);
        }
      }
    } catch (e) {
      onError?.(e);
      throw e;
    }
  }

  function alertLimitReached() {
    instance.option({
      alerts: [
        {
          message: 'Request limit reached, try again in a minute.',
        },
      ],
    });

    setTimeout(() => {
      instance.option({ alerts: [] });
    }, ALERT_TIMEOUT);
  }

  function setMainButtonToDefault() {
    instance.option({
      sendButtonOptions: {
        action: 'send',
        icon: 'arrowright',
      },
    });
  }

  function setMainButtonToStop() {
    instance.option({
      sendButtonOptions: {
        action: 'custom',
        icon: 'stopfilled',
        onClick: stopStreaming,
      },
    });
  }

  function stopStreaming() {
    if (abortController) {
      abortController.abort();
      setMainButtonToDefault();
    }
  }

  async function processMessageSending(message) {
    abortController = new AbortController();
    setMainButtonToStop();

    messages.push({ role: 'user', content: message.text });
    instance.option({ typingUsers: [assistant] });

    let assistantId;
    let buffer = '';
    let typingCleared = false;

    const onDelta = (chunk) => {
      if (!typingCleared) {
        instance.option({ typingUsers: [] });
        typingCleared = true;
      }

      if (!assistantId) {
        assistantId = insertAssistantPlaceholder();
      }

      buffer += chunk;

      updateMessageText(assistantId, buffer);
    };

    try {
      await getAIResponseStream(messages, {
        onDelta,
        signal: abortController.signal,
      });

      instance.option({ typingUsers: [] });
      messages.push({ role: 'assistant', content: buffer });
    } catch {
      instance.option({ typingUsers: [] });

      messages.pop();

      if (e?.name !== 'AbortError' && assistantId) {
        updateMessageText(assistantId, '');
        alertLimitReached();
      }
    } finally {
      abortController = null;
      setMainButtonToDefault();
    }
  }

  function insertAssistantPlaceholder() {
    const id = Date.now();

    dataSource.store().push([
      {
        type: 'insert',
        data: {
          id,
          timestamp: new Date(),
          author: assistant,
          text: '',
        },
      },
    ]);

    return id;
  }

  function updateMessageText(id, text) {
    dataSource.store().push([
      {
        type: 'update',
        key: id,
        data: { text },
      },
    ]);
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

  function sendSuggestion(prompt, event) {
    const message = {
      id: Date.now(),
      timestamp: new Date(),
      author: user,
      text: prompt,
    };

    dataSource.store().push([{ type: 'insert', data: message }]);

    if (!instance.option('alerts').length) {
      processMessageSending(message, event);
    }
  }

  function createSuggestionCard(card) {
    return $('<button>')
      .attr({
        type: 'button',
        tabindex: 0,
      })
      .addClass('dx-chat-suggestion-card')
      .append(
        $('<div>').addClass('dx-chat-suggestion-card-title').text(card.title),
        $('<div>').addClass('dx-chat-suggestion-card-prompt').text(card.prompt),
      )
      .on('click', (e) => {
        sendSuggestion(card.prompt, e);
      });
  }

  const instance = $('#dx-ai-chat')
    .dxChat({
      user,
      height: 710,
      dataSource,
      reloadOnChange: false,
      showAvatar: false,
      showDayHeaders: false,
      speechToTextEnabled: true,
      sendButtonOptions: {
        action: 'send',
      },
      onMessageEntered: (e) => {
        const { message, event } = e;

        dataSource
          .store()
          .push([{ type: 'insert', data: { id: Date.now(), ...message } }]);

        if (!instance.option('alerts').length) {
          processMessageSending(message, event);
        }
      },
      messageTemplate: (data, element) => {
        const { message } = data;

        renderMessageContent(message, element);
      },
      emptyViewTemplate(data) {
        const $suggestionCards = $('<div>').addClass('dx-chat-suggestion-cards');

        suggestionCards.forEach((card) => {
          $suggestionCards.append(createSuggestionCard(card));
        });

        return $('<div>')
          .append(
            $('<div>').addClass('dx-chat-messagelist-empty-message').text(data.texts.message),
            $('<div>').addClass('dx-chat-messagelist-empty-prompt').text(data.texts.prompt),
            $suggestionCards,
          );
      },
    })
    .dxChat('instance');
});
