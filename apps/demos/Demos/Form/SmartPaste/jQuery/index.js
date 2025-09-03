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

    console.log('messages', messages, signal);
    const response = await aiService.chat.completions.create(params, { signal });
    const result = response.choices[0].message?.content;
    console.log('result', result);

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

  const form = $('#form').dxForm({
    formData: {},
    aiIntegration,
    labelMode: 'outside',
    showColonAfterLabel: false,
    labelLocation: 'top',
    minColWidth: 220,
    items,
  }).dxForm('instance');

  let text = defaultText;

  $('#textarea').dxTextArea({
    value: text,
    stylingMode: 'filled',
    height: '100%',
    onValueChanged: (data) => {
      text = data.value;
    }
  });

  $('#copy').dxButton({
    text: 'Copy Text',
    icon: 'copy',
    stylingMode: 'Contained',
    type: 'default',
    width: 'fit-content',
    onClick: () => {
      navigator.clipboard.writeText(text);
      DevExpress.ui.notify({
        message: 'Text copied to clipboard',
        position: {
          my: "bottom center",
          at: "bottom center",
          of: "#textarea",
          offset: '0 -20',
        },
        width: 'fit-content',
        maxWidth: 'fit-content',
        minWidth: 'fit-content',
      }, 'info', 15000);
    }
  });

  addEventListener("keypress", (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'V') {
      form.smartPaste();
    }
  })
});
