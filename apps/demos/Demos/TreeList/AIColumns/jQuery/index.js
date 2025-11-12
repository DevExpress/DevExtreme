$(() => {
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
      max_tokens: 1000,
      temperature: 0.7,
    };
    const response = await aiService.chat.completions.create(params, { signal });
    const result = response.choices[0].message?.content;

    return result;
  }

  const aiIntegration = new DevExpress.aiIntegration({
    sendRequest({ prompt }) {
      const isValidRequest = JSON.stringify(prompt.user).length < 5000;
      if (!isValidRequest) {
        return {
          promise: Promise.reject(new Error('Request is too large')),
          abort: () => {},
        };
      }
      const controller = new AbortController();
      const signal = controller.signal;

      const aiPrompt = [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user },
      ];

      const promise = getAIResponse(aiPrompt, signal);

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
    const firstNameText = $('<div>').addClass('name__text name__text--title').text(First_Name);
    const lastNameText = $('<div>').addClass('name__text name__text--subtitle').text(Last_Name);

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

  const createEmailTemplate = (email) => {
    const emailLink = $('<a>')
      .attr('href', `mailto:${email}`)
      .text(email);
    return emailLink;
  };

  $('#treeList').dxTreeList({
    dataSource: employees,
    showBorders: true,
    keyExpr: 'ID',
    parentIdExpr: 'Head_ID',
    expandedRowKeys: [1, 3, 4, 5, 32],
    aiIntegration,
    scrolling: {
      mode: 'standard',
    },
    paging: {
      enabled: true,
      pageSize: 10,
    },
    grouping: {
      contextMenuEnabled: false,
    },
    groupPanel: {
      visible: false,
    },
    columns: [
      {
        caption: 'Name',
        width: 200,
        cellTemplate: (container, options) => {
          const employee = options.data;
          const imageWrapper = createNameTemplate(employee);
          container.append(imageWrapper);
        },
        cssClass: 'name_cell',
      },
      {
        dataField: 'Title',
        width: 180,
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
        cellTemplate: (container, options) => {
          const email = options.data.Email;
          const emailLink = createEmailTemplate(email);
          container.append(emailLink);
        },
        minWidth: 200,
      },
      {
        name: 'AI Column',
        caption: 'AI Column',
        type: 'ai',
        ai: {
          prompt: 'Show person initials.',
          mode: 'auto',
          noDataText: 'No data',
        },
        width: 200,
        fixed: true,
        fixedPosition: 'right',
        cssClass: 'ai__cell',
      },
    ],
    onAIColumnRequestCreating(e) {
      e.data = e.data.filter((item) => !item.Type)
        .map((item) => ({
          ID: item.ID,
          First_Name: item.First_Name,
          Last_Name: item.Last_Name,
          Title: item.Title,
          Status: item.Status,
          City: item.City,
          State: item.State,
          Email: item.Email,
        }));
    },
  });
});
