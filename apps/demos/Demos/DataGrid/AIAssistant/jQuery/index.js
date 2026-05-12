$(() => {
  const deployment = 'gpt-4o-mini';
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

  async function getAIResponse(messages, signal, responseSchema) {
    const params = {
      messages,
      model: deployment,
      max_tokens: 1000,
      temperature: 0.7,
    };

    if (responseSchema) {
      params.response_format = {
        type: 'json_schema',
        json_schema: {
          name: 'grid_assistant_response',
          strict: true,
          schema: responseSchema,
        },
      };
    }

    const response = await aiService.chat.completions
      .create(params, { signal });
    const result = response.choices[0].message?.content;

    return result;
  }

  async function getAIResponseRecursive(messages, signal, responseSchema) {
    return getAIResponse(messages, signal, responseSchema)
      .catch(async (error) => {
        if (!error.message.includes('Connection error')) {
          return Promise.reject(error);
        }

        DevExpress.ui.notify({
          message: 'Our demo AI service reached a temporary request limit. Retrying in 30 seconds.',
          width: 'auto',
          type: 'error',
          displayTime: 5000,
        });

        await new Promise((resolve) => setTimeout(resolve, 30000));

        return getAIResponseRecursive(messages, signal, responseSchema);
      });
  }

  const aiIntegration = new DevExpress.aiIntegration.AIIntegration({
    sendRequest({ prompt, data }) {
      const isValidRequest = JSON.stringify(prompt.user).length < 5000;
      if (!isValidRequest) {
        return {
          promise: Promise.reject(new Error('Request is too long. Specify a shorter prompt.')),
          abort: () => {},
        };
      }
      const controller = new AbortController();
      const signal = controller.signal;

      const aiPrompt = [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user },
      ];
      const promise = getAIResponseRecursive(aiPrompt, signal, data?.responseSchema);

      const result = {
        promise,
        abort: () => {
          controller.abort();
        },
      };

      return result;
    },
  });

  let chatInstance;

  $('#gridContainer').dxDataGrid({
    dataSource: sales,
    showBorders: true,
    keyExpr: 'Id',
    searchPanel: {
      visible: true,
      width: 240,
      placeholder: 'Search...',
    },
    groupPanel: {
      visible: true,
    },
    headerFilter: {
      visible: true,
    },
    filterRow: {
      visible: true,
    },
    paging: {
      pageSize: 10,
    },
    pager: {
      visible: true,
      allowedPageSizes: [10, 25, 50, 100],
      showPageSizeSelector: true,
    },
    aiAssistant: {
      enabled: true,
      aiIntegration,
      chat: {
        onInitialized(e) {
          chatInstance = e.component;
        },
        suggestions: {
          items: [
            {
              text: '💡 Help',
              prompt: `The DataGrid AI Assistant allows you to control the component using natural language. You can execute commands such as the following:
  - Sort records
  - Apply a filter
  - Search for a specific value
  - Group records by a field
  - Focus and select rows
  - Modify paging settings
  - Pin, resize, and reorder columns
  - Configure data summaries
  - Pick a suggestion or enter a custom request to get started.`,
            },
            {
              text: '🔤 Sort by Region',
              prompt: 'Sort by Region ascending',
            },
            {
              text: '🔍 Filter by Health Sales',
              prompt: 'Filter by Sector equals Health',
            },
            {
              text: '📁 Group by Product',
              prompt: 'Group by Product',
            },
          ],
          onItemClick(e) {
            const { prompt, text } = e.itemData;

            if (text === '💡 Help') {
              const message = {
                id: Date.now(),
                timestamp: new Date(),
                author: { id: 'user' },
                text: prompt,
              };

              chatInstance.option('dataSource').store.push([{ type: 'insert', data: message }]);
            } else {
              chatInstance.option('inputFieldText', prompt);
            }
          },
        },
      },
    },
    columns: [
      {
        dataField: 'Product',
        width: 120,
      },
      {
        dataField: 'Amount',
        caption: 'Sale Amount',
        dataType: 'number',
        format: 'currency',
      },
      {
        dataField: 'Region',
        dataType: 'string',
      },
      {
        dataField: 'Sector',
        dataType: 'string',
      },
      {
        dataField: 'SaleDate',
        dataType: 'date',
      },
      {
        dataField: 'Customer',
        dataType: 'string',
        width: 150,
      },
    ],
  });
});
