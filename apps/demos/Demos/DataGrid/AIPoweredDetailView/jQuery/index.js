$(() => {
  const { formatMessage } = DevExpress.localization;

  const CLASS = {
    categoryWrapper: 'category__wrapper',
    promptEditor: 'prompt-editor',
    chatSuggestions: 'dx-chat-suggestions',
    responseEditor: 'response-editor',
    outputInitialMessage: 'output-initial-message',
    outputErrorMessage: 'output-error-message',
  };

  const AzureOpenAIConfig = {
    dangerouslyAllowBrowser: true,
    deployment: 'demo-mini',
    apiVersion: '2024-02-01',
    endpoint: 'https://public-api.devexpress.com/demo-openai',
    apiKey: 'DEMO',
  };

  const aiService = new AzureOpenAI(AzureOpenAIConfig);

  let activeAbortController = null;

  async function getAIResponse(messages, signal) {
    const params = {
      messages,
      model: AzureOpenAIConfig.deployment,
      max_completion_tokens: 1000,
      temperature: 0.7,
    };

    const response = await aiService.chat.completions.create(params, { signal });
    const result = response.choices[0].message?.content;

    return result ?? '';
  }

  const createCategoryTemplate = ({ CategoryName, CategoryID }) => $('<div>')
    .addClass(CLASS.categoryWrapper)
    .addClass(`category-${CategoryID}__bg-color`)
    .text(CategoryName);

  function setMessage($outputArea, $newMessage) {
    const $oldMessage = $outputArea.find(`.${CLASS.outputInitialMessage}, .${CLASS.outputErrorMessage}`);
    $oldMessage.remove();
    if ($newMessage) $outputArea.append($newMessage);
  }

  function toggleLoadingState(isLoading, event, controls) {
    const { inputArea, outputArea } = controls;
    const { promptEditor, suggestions, submitButton } = inputArea;
    const { responseEditor, loadPanel, $container } = outputArea;

    const responseText = responseEditor.option('value');

    responseEditor.option('disabled', isLoading || !responseText);
    promptEditor.option('disabled', isLoading);
    suggestions.option('disabled', isLoading);
    submitButton.option('disabled', isLoading);

    if (isLoading) {
      setMessage($container, null);
      loadPanel.show();
      event?.target?.blur();
    } else {
      loadPanel.hide();
      event?.target?.focus();
    }
  }

  async function handleSubmit(event, rowData, controls) {
    const { inputArea, outputArea } = controls;
    const { promptEditor, submitButton } = inputArea;
    const { responseEditor, $container } = outputArea;

    const userPrompt = promptEditor.option('value');
    if (!userPrompt) return;

    const controller = new AbortController();
    activeAbortController = controller;

    toggleLoadingState(true, event, controls);

    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `User prompt: ${userPrompt}\nRow data: ${JSON.stringify(rowData)}` },
      ];

      const aiResponse = await getAIResponse(messages, controller.signal);

      if (aiResponse === '') throw new Error('AI response is empty');
      responseEditor.option('value', aiResponse);
    } catch {
      responseEditor.option('value', '');
      setMessage($container, createErrorMessage());
    } finally {
      if (activeAbortController === controller) {
        activeAbortController = null;
      }
      submitButton.option('text', 'Resubmit');
      toggleLoadingState(false, event, controls);
    }
  }

  function createSubmitButton() {
    return $('<div>').dxButton({
      icon: 'sparkle',
      text: 'Submit',
      type: 'default',
      disabled: true,
    }).dxButton('instance');
  }

  function createPromptEditor(submitButton) {
    return $('<div>').dxTextBox({
      placeholder: 'Ask AI Assistant...',
      stylingMode: 'filled',
      valueChangeEvent: 'input',
      onValueChanged({ value }) {
        submitButton.option('disabled', !value);
      },
      elementAttr: { class: CLASS.promptEditor },
    }).dxTextBox('instance');
  }

  function createSuggestions() {
    return $('<div>').dxButtonGroup({
      items: suggestions,
      stylingMode: 'outlined',
      selectionMode: 'none',
      elementAttr: { class: CLASS.chatSuggestions },
    }).dxButtonGroup('instance');
  }

  function createInputArea() {
    const submitButton = createSubmitButton();
    const promptEditor = createPromptEditor(submitButton);
    const suggestions = createSuggestions();

    const $container = $('<div>')
      .addClass('input-container')
      .append(
        $('<div>').addClass('prompt-container').append(promptEditor.element(), suggestions.element()),
        $('<div>').addClass('submit-container').append(submitButton.element()),
      );

    return { $container, submitButton, promptEditor, suggestions };
  }

  function getTheme() {
    const themeName = DevExpress.ui.themes.current();

    return {
      isCompact: themeName.endsWith('compact'),
      isMaterial: themeName.startsWith('material'),
      isGeneric: themeName.startsWith('generic'),
    };
  }

  function getOutputAreaMinHeight() {
    const { isCompact, isMaterial } = getTheme();

    if (isMaterial) return isCompact ? 60 : 68;

    return isCompact ? 42 : 56;
  }

  function getOutputAreaMaxHeight() {
    const { isCompact, isMaterial, isGeneric } = getTheme();

    if (isMaterial) return isCompact ? 200 : 244;

    if (isGeneric) return isCompact ? 154 : 178;

    return isCompact ? 154 : 196;
  }

  function createResponseEditor() {
    return $('<div>').dxTextArea({
      autoResizeEnabled: true,
      width: '100%',
      minHeight: getOutputAreaMinHeight(),
      maxHeight: getOutputAreaMaxHeight(),
      readOnly: true,
      disabled: true,
      stylingMode: 'outlined',
      hoverStateEnabled: false,
      focusStateEnabled: false,
      elementAttr: { class: CLASS.responseEditor },
      inputAttr: { 'aria-label': 'AI Response' },
    }).dxTextArea('instance');
  }

  function createLoadPanel() {
    return $('<div>').dxLoadPanel({
      container: '.output-container',
      position: { of: '.output-container' },
      showPane: false,
      shading: true,
      message: '',
      visible: false,
    }).dxLoadPanel('instance');
  }

  function createInitialMessage() {
    return $('<div>')
      .addClass(CLASS.outputInitialMessage)
      .text('AI Assistant is ready to answer your questions about this record.');
  }

  function createErrorMessage() {
    return $('<div>')
      .addClass(CLASS.outputErrorMessage)
      .append(
        $('<span>').addClass('dx-icon-warning'),
        'An unexpected error occurred. Please try again.',
      );
  }

  function createOutputArea() {
    const responseEditor = createResponseEditor();
    const loadPanel = createLoadPanel();

    const $container = $('<div>')
      .addClass('output-container')
      .append(loadPanel.element(), responseEditor.element());

    setMessage($container, createInitialMessage());

    return { $container, responseEditor, loadPanel };
  }

  $('#gridContainer').dxDataGrid({
    dataSource: vehicles,
    showBorders: true,
    keyExpr: 'ID',
    paging: {
      pageSize: 10,
    },
    height: 500,
    columns: [
      {
        type: 'detailExpand',
        cellTemplate() {
          return $('<div>').addClass('dx-icon-sparkle');
        },
      },
      {
        caption: 'Model',
        calculateCellValue: (data) => `${data.TrademarkName} ${data.Name}`,
      },
      {
        dataField: 'Price',
        alignment: 'left',
        format: 'currency',
      },
      {
        caption: 'Category',
        cellTemplate: (container, options) => {
          const category = options.data;
          const categoryWrapper = createCategoryTemplate(category);
          container.append(categoryWrapper);
        },
        minWidth: 180,
      },
      {
        dataField: 'Modification',
      },
      {
        dataField: 'Horsepower',
      },
      {
        dataField: 'BodyStyleName',
        caption: 'Body Style',
      },
    ],
    masterDetail: {
      enabled: true,
      template: ($detailView, { data }) => {
        const inputArea = createInputArea();
        const outputArea = createOutputArea();
        const controls = { inputArea, outputArea };
        const onSubmit = ({ event }) => handleSubmit(event, data, controls);

        inputArea.promptEditor.option('onEnterKey', onSubmit);
        inputArea.submitButton.option('onClick', onSubmit);
        inputArea.suggestions.option('onItemClick', ({ itemData, event }) => {
          const suggestion = itemData;
          inputArea.promptEditor.option('value', suggestion.prompt);
          handleSubmit(event, data, controls);
        });

        $detailView.append(inputArea.$container, outputArea.$container);

        DevExpress.events.one($detailView, 'dxremove', () => {
          activeAbortController?.abort();
          activeAbortController = null;
        });
      },
    },
    onRowExpanding(e) {
      e.component.collapseAll(-1);
    },
    onRowCollapsing() {
      activeAbortController?.abort();
      activeAbortController = null;
    },
    onCellClick(e) {
      if (e.column.type === 'detailExpand' && e.rowType === 'data') {
        if (e.row.isExpanded) {
          e.component.collapseRow(e.key);
        } else {
          e.component.expandRow(e.key);
        }
      }
    },
    onCellPrepared(e) {
      if (e.rowType === 'data' && e.column.type === 'detailExpand') {
        const ariaLabelCollapse = formatMessage('dxDataGrid-ariaCollapse');
        const ariaLabelExpand = formatMessage('dxDataGrid-ariaExpand');
        const ariaLabel = e.row.isExpanded ? ariaLabelCollapse : ariaLabelExpand;
        e.cellElement.attr('aria-label', ariaLabel);
      }
    },
  });
});
