$(() => {
  const store = [];
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
  ];
  let isProcessing = false;

  DevExpress.localization.loadMessages({
    en: {
      'dxChat-emptyListMessage': 'Chat is Empty',
      'dxChat-emptyListPrompt': 'Click a tile below to call a function.',
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

  function wait(delay) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  async function requestModel(messageList) {
    const params = {
      messages: messageList,
      model: deployment,
      tools,
      tool_choice: 'auto',
      max_completion_tokens: 1000,
      temperature: 0.7,
    };

    const response = await chatService.chat.completions.create(params, { maxRetries: 0 });

    return response.choices[0].message;
  }

  async function runTool(call) {
    const { name } = call.function;
    let args;

    try {
      args = JSON.parse(call.function.arguments || '{}');
    } catch {
      return {
        name, arguments: {}, status: 'error', result: 'Invalid tool arguments',
      };
    }

    await wait(TOOL_DELAY);

    try {
      const implementation = toolImplementations[name];

      if (!implementation) {
        throw new Error(TOOL_ERROR_TEXT);
      }

      const value = implementation(args);
      const result = typeof value === 'string' ? value : JSON.stringify(value, null, 2);

      return {
        name, arguments: args, status: 'success', result,
      };
    } catch (err) {
      return {
        name, arguments: args, status: 'error', result: err.message,
      };
    }
  }

  async function getAIResponse(messageList, toolCalls = [], round = 0) {
    const answer = await requestModel(messageList);
    const calls = (answer.tool_calls ?? []).filter(({ type }) => type === 'function');

    if (!calls.length) {
      return { text: answer.content ?? '', toolCalls };
    }

    if (round === MAX_TOOL_ROUNDS) {
      throw new Error('The model requested too many tool calls. Try rephrasing your request.');
    }

    messageList.push({
      role: 'assistant',
      content: answer.content,
      tool_calls: calls,
    });

    const results = await Promise.all(calls.map(runTool));

    results.forEach((result, index) => {
      messageList.push({
        role: 'tool',
        tool_call_id: calls[index].id,
        content: result.status === 'error' ? `Error: ${result.result}` : result.result,
      });
    });

    return getAIResponse(messageList, [...toolCalls, ...results], round + 1);
  }

  function getErrorMessage(err) {
    if (err instanceof Error) return err.message;
    if (typeof err === 'string') return err;
    return 'Unknown error';
  }

  function alertError(message) {
    instance.option({
      alerts: [{
        message,
      }],
    });

    setTimeout(() => {
      instance.option({ alerts: [] });
    }, ALERT_TIMEOUT);
  }

  function toggleDisabledState(disabled, event) {
    instance.option('disabled', disabled);
    toolbar.option('items[1].options.disabled', disabled);

    if (disabled) {
      event?.target.blur();
    } else {
      event?.target.focus();
    }
  }

  async function processMessageSending(message, event) {
    isProcessing = true;
    toggleDisabledState(true, event);

    const historyLength = messages.length;

    messages.push({ role: 'user', content: message.text });
    instance.option({ typingUsers: [assistant] });

    try {
      const { text, toolCalls } = await getAIResponse(messages);

      instance.option({ typingUsers: [] });

      messages.push({ role: 'assistant', content: text });

      renderAssistantMessage(text, toolCalls);
    } catch (err) {
      instance.option({ typingUsers: [] });
      messages.length = historyLength;
      alertError(getErrorMessage(err));
    } finally {
      isProcessing = false;
      toggleDisabledState(false, event);
    }
  }

  function renderAssistantMessage(text, toolCalls) {
    const message = {
      id: Date.now(),
      timestamp: new Date(),
      author: assistant,
      text,
    };

    if (toolCalls.length) {
      message.toolCalls = toolCalls;
    }

    dataSource.store().push([{ type: 'insert', data: message }]);
  }

  function onClearButtonClick() {
    store.length = 0;
    messages.length = 1;
    instance.option({ alerts: [], typingUsers: [] });
    dataSource.reload();
  }

  function sendSuggestion(prompt) {
    if (isProcessing) {
      return;
    }

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
      .attr({ type: 'button' })
      .addClass('chat-suggestion-card')
      .append(
        $('<div>').addClass('chat-suggestion-card-title').text(card.title),
        $('<div>').addClass('chat-suggestion-card-description').text(card.description),
      )
      .on('click', () => {
        sendSuggestion(card.prompt);
      });
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

  const toolbar = $('#dx-ai-chat-toolbar').dxToolbar({
    items: [{
      location: 'before',
      text: 'AI Assistant',
      cssClass: 'ai-chat-title',
    }, {
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'clearhistory',
        stylingMode: 'text',
        hint: 'Clear chat',
        onClick: onClearButtonClick,
      },
    }],
  }).dxToolbar('instance');

  const instance = $('#dx-ai-chat').dxChat({
    user,
    height: 710,
    dataSource,
    reloadOnChange: false,
    showAvatar: true,
    showDayHeaders: false,
    speechToTextEnabled: true,
    onMessageEntered: (e) => {
      if (isProcessing) {
        return;
      }

      const { message, event } = e;

      dataSource.store().push([{ type: 'insert', data: { id: Date.now(), ...message } }]);

      if (!instance.option('alerts').length) {
        processMessageSending(message, event);
      }
    },
    emptyViewTemplate: (data) => {
      const $suggestionCards = $('<div>').addClass('chat-suggestion-cards');

      suggestionCards.forEach((card) => {
        $suggestionCards.append(createSuggestionCard(card));
      });

      return $('<div>').append(
        $('<div>').addClass('dx-chat-messagelist-empty-message').text(data.texts.message),
        $('<div>').addClass('dx-chat-messagelist-empty-prompt').text(data.texts.prompt),
        $suggestionCards,
      );
    },
  }).dxChat('instance');

  $('#expand-all').dxCheckBox({
    text: 'Expand all tool calls',
    value: false,
    onValueChanged: ({ value }) => {
      instance.option('toolCallOptions.expandAll', value);
    },
  });
});
