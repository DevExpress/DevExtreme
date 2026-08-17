$(() => {
  const deployment = 'demo-mini';
  const apiVersion = '2024-02-01';
  const endpoint = 'https://public-api.devexpress.com/demo-openai';
  const apiKey = 'DEMO';

  const aiService = new AzureOpenAI({
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

    const response = await aiService.chat.completions.create(params);
    const result = response.choices[0].message?.content;

    return result;
  }

  const createCategoryTemplate = ({ CategoryName, CategoryID }) => $('<div>')
    .addClass('category__wrapper')
    .addClass(`category-${CategoryID}__bg-color`)
    .text(CategoryName);

  function getOutputAreaMinHeight() {
    const isMaterial = $('.dx-theme-material').length > 0;
    return isMaterial ? 68 : 56;
  }

  function getOutputAreaMaxHeight() {
    const isMaterial = $('.dx-theme-material').length > 0;
    const isGeneric = $('.dx-theme-generic').length > 0;
    return isMaterial ? 244 : isGeneric ? 178 : 196;
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
      template: ($detailContainer, options) => {
        async function submit(event) {
          const promptEditor = $promptEditor.dxTextBox('instance');
          const userPrompt = promptEditor.option('value');
          if (userPrompt === '') return;

          const suggestions = $suggestions.dxButtonGroup('instance');
          const submitButton = $submitButton.dxButton('instance');
          const responseEditor = $responseEditor.dxTextArea('instance');
          const loadPanel = $loadPanel.dxLoadPanel('instance');

          function toggleLoadingState(isLoading) {
            const responseText = responseEditor.option('value');
            responseEditor.option('disabled', isLoading || !responseText);
            promptEditor.option('disabled', isLoading);
            suggestions.option('disabled', isLoading);
            submitButton.option('disabled', isLoading);

            if (isLoading) {
              $emptyMessage.hide();
              $errorMessage.hide();
              loadPanel.show();
              event?.target.blur();
            } else {
              submitButton.option('text', 'Resubmit');
              loadPanel.hide();
              event?.target.focus();
            }
          }

          toggleLoadingState(true);

          try {
            const rowData = options.data;
            const messages = [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: `User prompt: ${userPrompt}\nRow data: ${JSON.stringify(rowData)}` },
            ];
            const aiResponse = await getAIResponse(messages);
            responseEditor.option('value', aiResponse);
          } catch {
            responseEditor.option('value', '');
            $errorMessage.show();
          } finally {
            toggleLoadingState(false);
          }
        }

        const $promptEditor = $('<div>').dxTextBox({
          placeholder: 'Ask AI Assistant...',
          stylingMode: 'filled',
          valueChangeEvent: 'input',
          onValueChanged({ value }) {
            const submitButton = $submitButton.dxButton('instance');
            submitButton.option('disabled', !value);
          },
          onEnterKey: ({ event }) => submit(event),
          elementAttr: { class: 'prompt-editor' },
        });

        const $submitButton = $('<div>').dxButton({
          icon: 'sparkle',
          text: 'Submit',
          type: 'default',
          disabled: true,
          onClick: ({ event }) => submit(event),
        });

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

        $('<div>')
          .addClass('input-container')
          .append(
            $('<div>').addClass('prompt-container').append($promptEditor, $suggestions),
            $('<div>').addClass('submit-container').append($submitButton),
          ).appendTo($detailContainer);

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
        });

        const $loadPanel = $('<div>').dxLoadPanel({
          container: '.output-container',
          position: { of: '.output-container' },
          showPane: false,
          shading: true,
          message: '',
          visible: false,
        });

        const $emptyMessage = $('<div>')
          .addClass('output-empty-message')
          .text('AI Assistant is ready to answer your questions about this record.');

        const $errorMessage = $('<div>')
          .addClass('output-error-message')
          .append(
            $('<span>').addClass('dx-icon-warning'),
            'An unexpected error occured. Please try again.'
          )
          .hide();

        $('<div>')
          .addClass('output-container')
          .append($loadPanel, $responseEditor, $emptyMessage, $errorMessage)
          .appendTo($detailContainer);
      },
    },
    onRowExpanding(e) {
      e.component.collapseAll(-1);
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
  });
});
