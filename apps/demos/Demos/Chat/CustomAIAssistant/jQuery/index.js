$(() => {
  DevExpress.config({
    editorStylingMode: 'filled',
  });

  DevExpress.config({
    floatingActionButtonConfig: {
      position: {
        my: 'right bottom',
        at: 'right bottom',
        of: '#grid-container',
        offset: '-16 -16',
      },
    },
  });

  DevExpress.localization.loadMessages({
    en: {
      'dxChat-textareaPlaceholder': 'Enter a prompt...',
    },
  });

  let chatInstance;
  let clearButtonInstance;
  let formInstance;
  let gridInstance;

  const toastInstance = $('#toast')
    .dxToast({
      displayTime: 600,
      closeOnClick: true,
      message: 'Form data is saved.',
      type: 'success',
      position: {
        of: '#form-container',
        at: 'bottom center',
        my: 'bottom center',
        offset: '0 -20',
      },
    })
    .dxToast('instance');

  function pushMessage(message) {
    chatInstance
      .getDataSource()
      .store()
      .push([
        {
          type: 'insert',
          data: {
            id: Date.now() + Math.random(),
            timestamp: new Date(),
            ...message,
          },
        },
      ]);
  }

  function setDisabled(disabled) {
    chatInstance.option('disabled', disabled);
  }

  function updateClearButtonState() {
    const items = chatInstance.getDataSource().items();
    clearButtonInstance?.option('disabled', items.length === 0);
  }

  function clearChat() {
    const store = chatInstance.getDataSource().store();

    store.clear();
    chatInstance.getDataSource().reload();
    updateClearButtonState();
  }

  function handleUserMessage(message) {
    setDisabled(true);

    const finish = () => {
      setDisabled(false);
      updateClearButtonState();
    };

    const routed = routeMessage(message.text, {
      form: formInstance,
      gridInstance,
      aiIntegration,
      pushMessage,
    });

    routed.finally(finish);
  }

  const popupInstance = $('#aiAssistantContainer')
    .dxPopup({
      title: 'AI Assistant',
      wrapperAttr: {
        class: 'chat-popup',
      },
      width: 400,
      height: '90%',
      dragEnabled: true,
      resizeEnabled: true,
      showCloseButton: true,
      shading: false,
      visible: false,
      onHiding() {
        fabBtn.option('visible', true);
      },
      onShowing() {
        fabBtn.option('visible', false);
      },
      position: {
        my: 'right top',
        at: 'right top',
        of: '.demo-container',
        offset: '-20 20',
      },
      toolbarItems: [
        {
          widget: 'dxButton',
          toolbar: 'top',
          location: 'after',
          cssClass: CLASSES.clearChatButton,
          options: {
            icon: 'clearhistory',
            disabled: true,
            hint: 'Clear chat',
            onClick: () => clearChat(),
            onInitialized: (e) => {
              clearButtonInstance = e.component;
            },
          },
        },
      ],
      contentTemplate($container) {
        const $chatContainer = $('<div>')
          .addClass('ai-chat-content')
          .appendTo($container);

        $chatContainer.dxChat({
          height: '100%',
          showAvatar: false,
          width: 'auto',
          dataSource: {
            store: new DevExpress.data.ArrayStore({ key: 'id' }),
          },
          reloadOnChange: true,
          user: { id: 'user' },
          showUserName: false,
          speechToTextEnabled: true,
          suggestions: {
            items: [
              { text: 'Show Completed Tasks', prompt: 'Show Completed Tasks' },
              {
                text: 'Change State to Texas',
                prompt: 'Change State to Texas',
              },
            ],
            onItemClick(e) {
              const { prompt } = e.itemData;
              const message = {
                id: Date.now() + Math.random(),
                timestamp: new Date(),
                author: { id: 'user' },
                text: prompt,
              };

              pushMessage(message);
              handleUserMessage(message);
            },
          },
          emptyViewTemplate(_data, container) {
            const $icon = $('<div>').addClass(
              'dx-chat-messagelist-empty-image dx-ai-chat__empty-image',
            );
            const $message = $('<div>')
              .addClass('ai-chat-empty-message')
              .text(emptyViewMessage);
            const $prompt = $('<div>')
              .addClass('ai-chat-empty-prompt')
              .html(emptyViewPrompt);

            $(container).append($icon).append($message).append($prompt);
          },
          onMessageEntered(e) {
            handleUserMessage(e.message);
          },
          onInitialized(e) {
            chatInstance = e.component;
          },
        });
      },
    })
    .dxPopup('instance');

  const aiIntegration = createAiIntegration();

  formInstance = $('#form-container')
    .dxForm({
      formData: employee,
      colCount: 3,
      labelLocation: 'top',
      onOptionChanged: (e) => {
        if (e.name === 'isDirty') {
          const saveButton = formInstance.getButton('Save');
          saveButton.option('disabled', !e.value);
        }
      },
      aiIntegration,
      items: [
        {
          dataField: 'Prefix',
          label: { text: 'Title' },
          editorType: 'dxSelectBox',
          editorOptions: { items: titles, searchEnabled: true },
          aiOptions: {
            instruction:
              'Only fill this field with one of the allowed values (Mr., Mrs., Ms.) if a ' +
              'title is explicitly mentioned in the text. Never use this field for any part ' +
              "of a person's name.",
          },
        },
        {
          dataField: 'FirstName',
          label: { text: 'First Name' },
          aiOptions: {
            instruction:
              "Only fill this field if the text clearly refers to a person's given name. " +
              'Never use grid/task-related words like Subject, Priority, Status, Due Date, ' +
              'Completion, or generic verbs like sort/filter/show as a name.',
          },
        },
        {
          dataField: 'LastName',
          label: { text: 'Last Name' },
          aiOptions: {
            instruction:
              "If the text gives a full person name (e.g. 'customer name', 'employee name') " +
              'without separately labeled first/last names, use only the first word as First ' +
              'Name and the rest of the name as Last Name.',
          },
        },
        {
          dataField: 'Position',
          editorType: 'dxSelectBox',
          editorOptions: { items: positions, searchEnabled: true },
          aiOptions: {
            instruction:
              'Only fill this field with one of the allowed job position values if the text ' +
              "explicitly refers to the employee's own job title/role.",
          },
        },
        {
          dataField: 'State',
          editorType: 'dxSelectBox',
          editorOptions: { items: states, searchEnabled: true },
          aiOptions: {
            instruction:
              'Only fill this field with one of the allowed US state values if the text ' +
              "explicitly refers to the employee's home/office state",
          },
        },
        {
          dataField: 'BirthDate',
          editorType: 'dxDateBox',
          editorOptions: { displayFormat: 'M/d/yyyy' },
          aiOptions: {
            instruction:
              "Only fill this field if the text explicitly refers to the employee's own birth " +
              'date or date of birth.',
          },
        },
        {
          itemType: 'button',
          name: 'Save',
          colSpan: 3,
          cssClass: 'save-button',
          buttonOptions: {
            text: 'Save',
            type: 'default',
            disabled: true,
            useSubmitBehavior: true,
            width: '120px',
            onClick: () => {
              toastInstance.show();
            },
          },
        },
      ],
    })
    .dxForm('instance');

  gridInstance = $('#grid-container')
    .dxDataGrid({
      dataSource: tasks,
      keyExpr: 'ID',
      showBorders: true,
      filterRow: { visible: true },
      headerFilter: { visible: true },
      filterSyncEnabled: true,
      columns: [
        { dataField: 'Subject', width: 250 },
        { dataField: 'StartDate', dataType: 'date' },
        { dataField: 'DueDate', dataType: 'date' },
        {
          dataField: 'Priority',
          caption: 'Priority',
          cellTemplate: (container, options) => {
            $('<div>')
              .css({
                background: colors[options.value],
                borderRadius: '24px',
                padding: '2px 8px',
                display: 'inline-block',
                textAlign: 'center',
              })
              .text(options.value)
              .appendTo(container);
          },
        },
        {
          dataField: 'Completion',
          caption: 'Completed',
          alignment: 'center',
          dataType: 'boolean',
          editorOptions: {
            elementAttr: {
              'aria-label': 'Completed',
            },
          },
          calculateCellValue: (rowData) => rowData.Completion === 100,
          calculateFilterExpression(filterValue, selectedFilterOperation) {
            const wantsCompleted =
              selectedFilterOperation === '<>' ? !filterValue : !!filterValue;
            const rawCompletion = (rowData) => rowData.Completion;
            return wantsCompleted
              ? [rawCompletion, '=', 100]
              : [rawCompletion, '<', 100];
          },
        },
      ],
    })
    .dxDataGrid('instance');

  let fabBtn = $('#ai-fab')
    .dxSpeedDialAction({
      icon: 'sparkle',
      label: 'AI Assistant',
      onClick() {
        popupInstance.toggle();
      },
    })
    .dxSpeedDialAction('instance');
});
