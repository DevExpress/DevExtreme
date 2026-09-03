function createAiIntegration() {
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
      temperature: 0,
    };

    const response = await aiService.chat.completions.create(params, {
      signal,
    });

    return response.choices[0].message?.content;
  }

  async function getAIResponseRecursive(messages, signal) {
    return getAIResponse(messages, signal).catch(async (error) => {
      if (!error.message.includes('Connection error')) {
        throw error;
      }

      DevExpress.ui.notify({
        message:
          'Our demo AI service reached a temporary request limit. Retrying in 30 seconds.',
        width: 'auto',
        type: 'error',
        displayTime: 5000,
      });

      await new Promise((resolve) => setTimeout(resolve, 30000));

      return getAIResponseRecursive(messages, signal);
    });
  }

  return new DevExpress.aiIntegration.AIIntegration({
    sendRequest({ prompt, data }) {
      const isValidRequest = JSON.stringify(prompt.user).length < 20000;
      if (!isValidRequest) {
        return {
          promise: Promise.reject(
            new ChatCommandError(
              '❌ This message is too long for me to process. Please shorten it and try again.',
            ),
          ),
          abort: () => {},
        };
      }
      const controller = new AbortController();
      const signal = controller.signal;

      const isSmartPasteRequest = Array.isArray(data?.fields);
      const system = isSmartPasteRequest
        ? `${prompt.system ?? ''} IMPORTANT: reply on a SINGLE line with no line breaks of any kind - use ';;;' as the only separator between fields.`
        : (prompt.system ?? '');

      const aiPrompt = [
        { role: "system", content: system },
        { role: "user", content: prompt.user },
      ];
      const promise = getAIResponseRecursive(aiPrompt, signal);

      return {
        promise,
        abort: () => {
          controller.abort();
        },
      };
    },
  });
}
