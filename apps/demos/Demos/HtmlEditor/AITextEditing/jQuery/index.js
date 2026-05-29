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
      max_completion_tokens: 1000,
      temperature: 0.7,
    };

    const response = await aiService.chat.completions.create(params, { signal });
    const result = response.choices[0].message?.content;

    return result;
  }

  const aiIntegration = new DevExpress.aiIntegration.AIIntegration({
    sendRequest({ prompt }) {
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

  $('.html-editor').dxHtmlEditor({
    height: 530,
    value: markup,
    aiIntegration,
    toolbar: {
      items: [
        {
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
              prompt: () => 'Extract a list of keywords from the text and return it as a comma-separated string',
            },
          ],
        },
        'separator',
        'undo',
        'redo',
      ],
    },
  });
});
