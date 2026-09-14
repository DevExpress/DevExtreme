$(() => {
  let abortController = null;

  const AzureOpenAIConfig = {
    dangerouslyAllowBrowser: true,
    deployment: 'demo-mini',
    apiVersion: '2024-02-01',
    endpoint: 'https://public-api.devexpress.com/demo-openai',
    apiKey: 'DEMO',
  };

  const aiService = new AzureOpenAI(AzureOpenAIConfig);

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
    .addClass('category__wrapper')
    .addClass(`category-${CategoryID}__bg-color`)
    .text(CategoryName);

  function toggleLoadingState(isLoading, event, controls) {
    const {
      responseEditor,
      promptEditor,
      suggestions,
      submitButton,
      $emptyMessage,
      $errorMessage,
      loadPanel
    } = controls;

    const responseText = responseEditor.option('value');

    responseEditor.option('disabled', isLoading || !responseText);
    promptEditor.option('disabled', isLoading);
    suggestions.option('disabled', isLoading);
    submitButton.option('disabled', isLoading);

    if (isLoading) {
      $emptyMessage.hide();
      $errorMessage.hide();
      loadPanel.show();
      event?.target?.blur();
    } else {
      loadPanel.hide();
      event?.target?.focus();
    }
  }

  async function handleSubmit(event, rowData, controls) {
    const { promptEditor, responseEditor, submitButton, $errorMessage } = controls;
    const userPrompt = promptEditor.option('value');
    if (userPrompt === '') return;

    abortController = new AbortController();

    toggleLoadingState(true, event, controls);

    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `User prompt: ${userPrompt}\nRow data: ${JSON.stringify(rowData)}` },
      ];

      const aiResponse = await getAIResponse(messages, abortController.signal);

      if (aiResponse === '') throw new Error('AI response is empty');
      responseEditor.option('value', aiResponse);
    } catch {
      responseEditor.option('value', '');
      $errorMessage.show();
    } finally {
      abortController = null;
      submitButton.option('text', 'Resubmit');
      toggleLoadingState(false, event, controls);
    }
  }

  function createInputArea(rowData) {
    const $promptEditor = $('<div>').dxTextBox({
      placeholder: 'Ask AI Assistant...',
      stylingMode: 'filled',
      valueChangeEvent: 'input',
      onValueChanged({ value }) {
        submitButton.option('disabled', !value);
      },
      elementAttr: { class: 'prompt-editor' },
    });
    const promptEditor = $promptEditor.dxTextBox('instance');

    const $suggestions = $('<div>').dxButtonGroup({
      items: [
        { type: 'default', text: '✨ Summary', prompt: 'Display general information about this vehicle and its features.' },
        { type: 'default', text: '⚡ Ideal Buyer', prompt: 'Describe who this vehicle appeals to the most in a sentence.' },
        { type: 'default', text: '🏎️ Competitors', prompt: 'List 2-3 models that directly compete with this vehicle.' },
      ],
      stylingMode: 'outlined',
      selectionMode: 'none',
      elementAttr: { class: 'dx-chat-suggestions' },
      onItemClick(e) {
        const suggestion = e.itemData;
        const promptEditor = $promptEditor.dxTextBox('instance');
        promptEditor.option('value', suggestion.prompt);
      },
    });
    const suggestions = $suggestions.dxButtonGroup('instance');

    const $submitButton = $('<div>').dxButton({
      icon: 'sparkle',
      text: 'Submit',
      type: 'default',
      disabled: true,
    });
    const submitButton = $submitButton.dxButton('instance');

    const $inputArea = $('<div>')
      .addClass('input-container')
      .append(
        $('<div>').addClass('prompt-container').append($promptEditor, $suggestions),
        $('<div>').addClass('submit-container').append($submitButton),
      );

    return { $inputArea, promptEditor, suggestions, submitButton };
  }

  function getOutputAreaMinHeight() {
    const isMaterial = DevExpress.ui.themes.current().startsWith('material');
    if (isMaterial) return 68;

    return 56;
  }

  function getOutputAreaMaxHeight() {
    const isMaterial = DevExpress.ui.themes.current().startsWith('material');
    if (isMaterial) return 244;

    const isGeneric = DevExpress.ui.themes.current().startsWith('generic');
    if (isGeneric) return 178;

    return 196;
  }

  function createOutputArea() {
    const $responseEditor = $('<div>').dxTextArea({
      autoResizeEnabled: true,
      width: '100%',
      minHeight: getOutputAreaMinHeight(),
      maxHeight: getOutputAreaMaxHeight(),
      readOnly: true,
      disabled: true,
      stylingMode: 'outlined',
      hoverStateEnabled: false,
      focusStateEnabled: false,
      elementAttr: { class: 'response-editor' },
      inputAttr: { 'aria-label': 'AI Response' },
    });
    const responseEditor = $responseEditor.dxTextArea('instance');

    const $loadPanel = $('<div>').dxLoadPanel({
      container: '.output-container',
      position: { of: '.output-container' },
      showPane: false,
      shading: true,
      message: '',
      visible: false,
    });
    const loadPanel = $loadPanel.dxLoadPanel('instance');

    const $emptyMessage = $('<div>')
      .addClass('output-initial-message')
      .text('AI Assistant is ready to answer your questions about this record.');

    const $errorMessage = $('<div>')
      .addClass('output-error-message')
      .append(
        $('<span>').addClass('dx-icon-warning'),
        'An unexpected error occurred. Please try again.',
      )
      .hide();

    const $outputArea = $('<div>')
      .addClass('output-container')
      .append($loadPanel, $responseEditor, $emptyMessage, $errorMessage);

    return { $outputArea, responseEditor, loadPanel, $emptyMessage, $errorMessage };
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
      template: (container, { data }) => {
        const { $inputArea, ...input } = createInputArea(data);
        const { $outputArea, ...output } = createOutputArea();
        const controls = { ...input, ...output };
        const onSubmit = ({ event }) => handleSubmit(event, data, controls);

        input.promptEditor.option('onEnterKey', onSubmit);
        input.submitButton.option('onClick', onSubmit);

        container.append($inputArea, $outputArea);
      },
    },
    onRowExpanding(e) {
      abortController?.abort();
      e.component.collapseAll(-1);
    },
    onCellClick(e) {
      if (e.column.type === 'detailExpand' && e.rowType === 'data') {
        if (e.row.isExpanded) {
          abortController?.abort();
          e.component.collapseRow(e.key);
        } else {
          e.component.expandRow(e.key);
        }
      }
    },
  });
});
