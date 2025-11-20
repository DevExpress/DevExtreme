const deployment = 'gpt-4o-mini';
const apiVersion = '2024-02-01';
const endpoint = 'https://public-api.devexpress.com/demo-openai';
const apiKey = 'DEMO';
const AzureOpenAI = window.AzureOpenAI;

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
        message: 'You have reached the AI rate limits of this demo. Retrying in 30 seconds...',
        width: 'auto',
        type: 'error',
        displayTime: 5000,
      });

      await new Promise((resolve) => setTimeout(resolve, 30000));

      return getAIResponseRecursive(messages, signal);
    });
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

window.aiIntegration = aiIntegration;
