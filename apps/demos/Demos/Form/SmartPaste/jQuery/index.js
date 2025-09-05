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
      const controller = new AbortController();
      const signal = controller.signal;

      const aiPrompt = [
        { role: 'system', content: prompt.system, },
        { role: 'user', content: prompt.user, },
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

  const showNotification = (message, of, offset) => {
    DevExpress.ui.notify({
      message,
      position: {
        my: "bottom center",
        at: "bottom center",
        of,
        offset: offset ?? '0 -50',
      },
      width: 'fit-content',
      maxWidth: 'fit-content',
      minWidth: 'fit-content',
    }, 'info', 1500);
  }

  const customSmartPasteHandler = () => {
    navigator.clipboard.readText()
      .then((text) => {
        if (text) {
          form.smartPaste(text);
        } else {
          showNotification(
            'Copy the text to paste into the form',
            '#form'
          );
        }
      })
      .catch(() => {
        showNotification(
          'Could not access the clipboard',
          '#form'
        );
      });
  }

  const form = $('#form').dxForm({
    formData: {},
    aiIntegration,
    labelMode: 'outside',
    showColonAfterLabel: false,
    labelLocation: 'top',
    minColWidth: 220,
    items: [{
      itemType: 'group',
      caption: 'Billing Summary',
      colCountByScreen: {
        xs: 2,
        sm: 2,
        md: 2,
        lg: 2,
      },
      items: [{
        dataField: 'Amount Due',
        editorType: 'dxTextBox',
        editorOptions: {
          placeholder: '$0.00',
          stylingMode: 'filled',
        },
        aiOptions: {
          instruction: 'Format as the following: $0.00',
        },
      }, {
        dataField: 'Statement Date',
        editorType: 'dxDateBox',
        editorOptions: {
          placeholder: 'MM/DD/YYYY',
          stylingMode: 'filled',
        },
        aiOptions: {
          instruction: 'Format as the following: MM/DD/YYYY',
        },
      }],
    }, {
      itemType: 'group',
      caption: 'Billing Information',
      colCountByScreen: {
        xs: 2,
        sm: 2,
        md: 2,
        lg: 2,
      },
      items: [{
        dataField: 'First Name',
        editorType: 'dxTextBox',
        editorOptions: {
          stylingMode: 'filled',
        },
      }, {
        dataField: 'Last Name',
        editorType: 'dxTextBox',
        editorOptions: {
          stylingMode: 'filled',
        },
      }, {
        dataField: 'Phone Number',
        editorType: 'dxTextBox',
        editorOptions: {
          placeholder: '(000) 000-0000',
          stylingMode: 'filled',
        },
        aiOptions: {
          instruction: 'Format as the following: (000) 000-0000',
        },
      }, {
        dataField: 'Email',
        editorType: 'dxTextBox',
        editorOptions: {
          stylingMode: 'filled',
        },
        validationRules: [{ type: 'email' }],
        aiOptions: {
          instruction: 'Do not fill this field if the text contains an invalid email address. A valid email is in the following format: email@example.com',
        },
      }]
    }, {
      itemType: 'group',
      caption: 'Billing Address',
      colCountByScreen: {
        xs: 2,
        sm: 2,
        md: 2,
        lg: 2,
      },
      items: [{
        dataField: 'Street Address',
        editorType: 'dxTextBox',
        editorOptions: {
          stylingMode: 'filled',
        },
      }, {
        dataField: 'City',
        editorType: 'dxTextBox',
        editorOptions: {
          stylingMode: 'filled',
        },
      }, {
        dataField: 'State/Province/Region',
        editorType: 'dxTextBox',
        editorOptions: {
          stylingMode: 'filled',
        },
      }, {
        dataField: 'ZIP',
        editorType: 'dxNumberBox',
        editorOptions: {
          stylingMode: 'filled',
          mode: 'text',
          value: null,
        },
        aiOptions: {
          instruction: 'If the text does not contain a ZIP, determine the ZIP code from the provided address.',
        },
      }]
    }, {
      itemType: 'group',
      cssClass: 'buttons-group',
      colCountByScreen: {
        xs: 2,
        sm: 2,
        md: 2,
        lg: 2,
      },
      items: [{
        itemType: 'button',
        name: 'smartPaste',
        buttonOptions: {
          stylingMode: 'contained',
          type: 'default',
        },
      }, {
        itemType: 'button',
        name: 'reset',
        buttonOptions: {
          stylingMode: 'outlined',
          type: 'normal',
        },
      }],
    }],
  }).dxForm('instance');

  const textarea = $('#textarea').dxTextArea({
    value: defaultText,
    stylingMode: 'filled',
    height: '100%',
  }).dxTextArea('instance');

  $('#copy').dxButton({
    text: 'Copy Text',
    icon: 'copy',
    stylingMode: 'contained',
    type: 'default',
    width: 'fit-content',
    onClick: () => {
      const { value } = textarea.option();
      navigator.clipboard.writeText(value);

      showNotification(
        'Text copied to clipboard',
        '#textarea',
        '0 -20',
      );
    }
  });

  form.registerKeyHandler("V", (event) => {
    if (event.ctrlKey && event.shiftKey) {
      customSmartPasteHandler();
    }
  });
});
