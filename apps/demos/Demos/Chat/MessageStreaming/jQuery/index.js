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

  function createDelayedRenderer({ delay = 20, onRender }) {
    let queue = [];
    let rendering = false;

    function processQueue() {
      if (!queue.length) {
        rendering = false;

        return;
      }

      rendering = true;
      const chunk = queue.shift();
      onRender(chunk);

      setTimeout(processQueue, delay);
    }

    function pushChunk(chunk) {
      queue.push(chunk);

      if (!rendering) {
        processQueue();
      }
    }

    function stop() {
      queue = [];
      rendering = false;
    }

    return { pushChunk, stop };
  }

  async function getAIResponseStream(messages, { onAborted, onDelta, onError, signal }) {
    const params = {
      messages,
      model: deployment,
      max_completion_tokens: 1000,
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

      if (signal.aborted) {
        onAborted();
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
        onClick: null,
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
    setTimeout(setMainButtonToStop, 0);

    messages.push({ role: 'user', content: message.text });
    instance.option({ typingUsers: [assistant] });

    let assistantId;
    let buffer = '';
    let typingCleared = false;

    const delayedRenderer = createDelayedRenderer({ onRender: (chunk) => {
      if (!typingCleared) {
        instance.option({ typingUsers: [] });
        typingCleared = true;
      }

      if (!assistantId) {
        assistantId = insertAssistantPlaceholder();
      }

      buffer += chunk;

      updateMessageText(assistantId, buffer);
    } });

    const onAborted = () => {
      delayedRenderer.stop();
    };

    try {
      await getAIResponseStream(messages, {
        onAborted,
        onDelta: delayedRenderer.pushChunk,
        signal: abortController.signal,
      });

      instance.option({ typingUsers: [] });
      messages.push({ role: 'assistant', content: buffer });
    } catch (e) {
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

  function sendSuggestion(prompt) {
    const message = {
      id: Date.now(),
      timestamp: new Date(),
      author: user,
      text: prompt,
    };

    dataSource.store().push([{ type: 'insert', data: message }]);

    if (!instance.option('alerts').length) {
      processMessageSending(message);
    }
  }

  function createSuggestionCard(card) {
    return $('<button>')
      .attr({
        type: 'button',
        tabindex: 0,
      })
      .addClass('chat-suggestion-card')
      .append(
        $('<div>').addClass('chat-suggestion-card-title').text(card.title),
        $('<div>').addClass('chat-suggestion-card-prompt').text(card.description),
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
        const { message } = e;

        dataSource
          .store()
          .push([{ type: 'insert', data: { id: Date.now(), ...message } }]);

        if (!instance.option('alerts').length) {
          processMessageSending(message);
        }
      },
      messageTemplate: (data, element) => {
        const { message } = data;

        renderMessageContent(message, element);
      },
      emptyViewTemplate(data) {
        const $suggestionCards = $('<div>').addClass('chat-suggestion-cards');

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
