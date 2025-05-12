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

    return aiService.chat.completions.create(params, { signal });
  }

  const aiIntegration = new DevExpress.aiIntegration({
    sendRequest({ prompt }) {
      const controller = new AbortController();
      const signal = controller.signal;

      const aiPrompt = [
        { role: 'system', content: prompt.system, },
        { role: 'user', content: prompt.user, },
      ];

      const promise = new Promise(async (resolve, reject) => {
        try {
          const response = await getAIResponse(aiPrompt, signal);
          const result = response.choices[0].message?.content;
  
          resolve(result);
        } catch {
          reject();
        }
      });

      const result = {
        promise,
        abort: () => {
          controller.abort();
        },
      };

      return result;
    },
  });
  
  $('.html-editor').dxHtmlEditor({
    height: 725,
    value: markup,
    aiIntegration,
    toolbar: {
      items: [{
        name: 'ai',
        commands: [
            'summarize',
            'proofread',
            'expand',
            'shorten',
            'changeStyle',
            'changeTone',
            'translate',
            'askAI',
            {
                name: 'custom',
                text: 'Extract Keywords',
                prompt: () => {
                    return 'Extract a list of keywords from the text and return them as a comma-separated string';
                },
            },
        ],
      }, 'separator', 'undo', 'redo'
    ],
    }
  });
});
