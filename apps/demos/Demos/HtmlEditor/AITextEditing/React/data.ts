import { type HtmlEditorTypes } from 'devextreme-react/html-editor';
import {
  AIIntegration,
  RequestParams,
  Response,
} from 'devextreme-react/common/ai-integration';
import { AzureOpenAI, OpenAI } from 'openai';

type AIMessage = (OpenAI.ChatCompletionUserMessageParam | OpenAI.ChatCompletionSystemMessageParam) & {
  content: string;
};

const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: 'gpt-4o-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
};

const aiService = new AzureOpenAI(AzureOpenAIConfig);

async function getAIResponse(messages: AIMessage[], signal: AbortSignal) {
  const params = {
    messages,
    model: AzureOpenAIConfig.deployment,
    max_tokens: 1000,
    temperature: 0.7,
  };

  const response = await aiService.chat.completions.create(params, { signal });
  const result = response.choices[0].message?.content;

  return result;
}

export const aiIntegration = new AIIntegration({
  sendRequest({ prompt }: RequestParams): Response {
    const controller = new AbortController();
    const signal = controller.signal;

    const aiPrompt: AIMessage[] = [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ];

    const promise = getAIResponse(aiPrompt, signal);

    const result: Response = {
      promise,
      abort: () => {
        controller.abort();
      },
    };

    return result;
  },
});

export const markup = `
    <h2>
        <img src="../../../../images/widgets/HtmlEditor.svg" alt="HtmlEditor">
        Formatted Text Editor (HTML Editor)
    </h2>
    <br>
    <p>DevExtreme JavaScript HTML Editor is a client-side WYSIWYG text editor that allows its users to format textual and visual content and store it as HTML.</p>
    <p>Supported features:</p>
    <ul>
        <li>Inline formats:
            <ul>
                <li>Bold, italic, strikethrough text formatting</li>
                <li>Font, size, color changes (HTML only)</li>
            </ul>
        </li>
        <li>Block formats:
            <ul>
                <li>Headers</li>
                <li>Text alignment</li>
                <li>Lists (ordered and unordered)</li>
                <li>Code blocks</li>
                <li>Quotes</li>
            </ul>
        </li>
        <li>Custom formats</li>
        <li>Mail-merge placeholders (for example, %username%)</li>
        <li>Adaptive toolbar for working images, links, and color formats</li>
        <li>Image upload: drag-and-drop images onto the form, select files from the file system, or specify a URL.</li>
        <li>Copy-paste rich content (unsupported formats are removed)</li>
        <li>Tables support</li>
    </ul>
`;

export const extractKeywordsPrompt: HtmlEditorTypes.AICustomCommand['prompt'] = () => 
  'Extract a list of keywords from the text and return it as a comma-separated string';
