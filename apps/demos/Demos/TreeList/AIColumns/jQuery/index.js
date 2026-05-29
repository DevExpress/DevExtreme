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

  async function getAIResponse(messages, signal) {
    const params = {
      messages,
      model: deployment,
      max_completion_tokens: 1000,
      temperature: 0.7,
    };
    const response = await aiService.chat.completions
      .create(params, { signal });
    const result = response.choices[0].message?.content;

    return result;
  }

  async function getAIResponseRecursive(messages, signal) {
    return getAIResponse(messages, signal)
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

        return getAIResponseRecursive(messages, signal);
      });
  }

  const aiIntegration = new DevExpress.aiIntegration.AIIntegration({
    sendRequest({ prompt }) {
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

      const promise = getAIResponseRecursive(aiPrompt, signal);

      const result = {
        promise,
        abort: () => {
          controller.abort();
        },
      };

      return result;
    },
  });

  const createNameTemplate = (employee) => {
    const {
      ID,
      First_Name,
      Last_Name,
    } = employee;

    if (!ID || !First_Name || !Last_Name) {
      return $('<div>').text('');
    }

    const nameWrapper = $('<div>').addClass('name__wrapper');
    const imgWrapper = $('<div>').addClass('name__img-wrapper');
    const img = $('<img>').addClass('name__img');
    img.attr({
      src: `../../../../images/employees/new/${First_Name} ${Last_Name}.jpg`,
      alt: `${First_Name} ${Last_Name}`,
    });

    imgWrapper.append(img);
    nameWrapper.append(imgWrapper);

    const textWrapper = $('<div>').addClass('name__text-wrapper');
    const firstNameText = $('<div>').addClass('name__text').text(First_Name);
    const lastNameText = $('<div>').addClass('name__text').text(Last_Name);

    textWrapper.append(firstNameText, lastNameText);
    nameWrapper.append(textWrapper);

    return nameWrapper;
  };

  const createStatusTemplate = (status) => $('<div>')
    .append(
      $('<div>').addClass('indicator'),
    )
    .append(
      $('<div>').text(status),
    )
    .addClass('status')
    .toggleClass('status--salaried', status === 'Salaried')
    .toggleClass('status--commission', status === 'Commission')
    .toggleClass('status--terminated', status === 'Terminated');

  $('#treeList').dxTreeList({
    dataSource: employees,
    showBorders: true,
    keyExpr: 'ID',
    parentIdExpr: 'Head_ID',
    autoExpandAll: true,
    aiIntegration,
    scrolling: {
      mode: 'standard',
    },
    paging: {
      enabled: true,
      pageSize: 10,
    },
    columns: [
      {
        caption: 'Employee',
        width: 260,
        cellTemplate: (container, options) => {
          const employee = options.data;
          const imageWrapper = createNameTemplate(employee);
          container.append(imageWrapper);
        },
        cssClass: 'name_cell',
      },
      {
        dataField: 'Title',
        caption: 'Position',
        width: 140,
      },
      {
        dataField: 'Status',
        cellTemplate: (container, options) => {
          const status = options.data.Status;
          const statusWrapper = createStatusTemplate(status);
          container.append(statusWrapper);
        },
        minWidth: 180,
      },
      {
        dataField: 'City',
        width: 180,
      },
      {
        dataField: 'State',
        width: 140,
      },
      {
        dataField: 'Email',
        minWidth: 200,
      },
      {
        name: 'AI Column',
        caption: 'AI Column',
        type: 'ai',
        ai: {
          prompt: 'Identify the department where the employee works. Select from the following department list: "Management", "Human Resources", "IT", "Shipping", "Support", "Sales", "Engineering". Use "Engineering" if you cannot find a better match.',
          mode: 'auto',
          noDataText: 'No data',
        },
        width: 180,
        fixed: true,
        fixedPosition: 'right',
        cssClass: 'ai__cell',
      },
    ],
    onAIColumnRequestCreating(e) {
      e.data = e.data.map((item) => ({
        ID: item.ID,
        First_Name: item.First_Name,
        Last_Name: item.Last_Name,
        Title: item.Title,
      }));
    },
  });
});
