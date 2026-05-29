import { bootstrapApplication } from '@angular/platform-browser';
import { Component, ViewChild, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { AzureOpenAI, type OpenAI } from 'openai';
import { DxTextAreaModule } from 'devextreme-angular';
import {
  AIIntegration,
  RequestParams,
  Response,
} from 'devextreme-angular/common/ai-integration';
import { DxButtonModule, type DxButtonTypes } from 'devextreme-angular/ui/button';
import { DxFormModule, DxFormComponent } from 'devextreme-angular/ui/form';
import notify from 'devextreme/ui/notify';

import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

const stylingMode = 'filled';

type AIMessage = (OpenAI.ChatCompletionUserMessageParam | OpenAI.ChatCompletionSystemMessageParam) & {
  content: string;
};

const showNotification = (message: string, of: string, isError?: boolean, offset?: string) => {
  notify({
    message,
    position: {
      my: 'bottom center',
      at: 'bottom center',
      of,
      offset: offset ?? '0 -50',
    },
    width: 'fit-content',
    maxWidth: 'fit-content',
    minWidth: 'fit-content',
  }, isError ? 'error' : 'info', 1500);
};

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  imports: [
    DxButtonModule,
    DxFormModule,
    DxTextAreaModule,
  ],
})
export class AppComponent {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;

  colCountByScreen = {
    xs: 2,
    sm: 2,
    md: 2,
    lg: 2,
  };

  amountDueEditorOptions = { placeholder: '$0.00', stylingMode };

  amountDueAIOptions = { instruction: 'Format as the following: $0.00' };

  statementDueEditorOptions = { placeholder: 'MM/DD/YYYY', stylingMode };

  statementDueAIOptions = { instruction: 'Format as the following: MM/DD/YYYY' };

  textEditorOptions = { stylingMode };

  phoneEditorOptions = { placeholder: '(000) 000-0000', stylingMode };

  phoneAIOptions = { instruction: 'Format as the following: (000) 000-0000' };

  emailAIOptions = { instruction: 'Do not fill this field if the text contains an invalid email address. A valid email is in the following format: email@example.com' };

  zipEditorOptions = { stylingMode, mode: 'text', value: null };

  zipAIOptions = { instruction: 'If the text does not contain a ZIP, determine the ZIP code from the provided address.' };

  resetButtonOptions: DxButtonTypes.Properties = {
    stylingMode: 'outlined',
    type: 'normal',
  };

  smartPasteButtonOptions: DxButtonTypes.Properties = {
    stylingMode: 'contained',
    type: 'default',
  };

  azureOpenAIConfig: any;

  aiService: AzureOpenAI;

  aiIntegration: AIIntegration;

  valueContent: string;

  text: string;

  constructor(service: Service) {
    this.azureOpenAIConfig = service.getAzureOpenAIConfig();

    this.aiService = new AzureOpenAI(this.azureOpenAIConfig);
    this.aiIntegration = new AIIntegration({
      sendRequest: this.sendRequest.bind(this),
    });

    this.text = service.getDefaultText();
  }

  ngAfterViewInit() {
    const form = this.form.instance;

    form.registerKeyHandler('V', (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey) {
        navigator.clipboard.readText()
          .then((clipboardText) => {
            if (clipboardText) {
              form.smartPaste(clipboardText);
            } else {
              showNotification('Clipboard is empty. Copy text before pasting', '#form');
            }
          })
          .catch(() => {
            showNotification('Could not access the clipboard', '#form');
          });
      }
    });
  }

  sendRequest({ prompt }: RequestParams): Response {
    const controller = new AbortController();
    const signal = controller.signal;

    const aiPrompt: AIMessage[] = [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ];
    const promise = this.getAIResponse(aiPrompt, signal);

    promise.catch(() => {
      showNotification('Something went wrong. Please try again.', '#form', true);
    });

    const result: Response = {
      promise,
      abort: () => {
        controller.abort();
      },
    };

    return result;
  }

  async getAIResponse(messages: AIMessage[], signal: AbortSignal) {
    const params = {
      messages,
      model: this.azureOpenAIConfig.deployment,
      max_completion_tokens: 1000,
      temperature: 0.7,
    };

    const response = await this.aiService.chat.completions.create(params, { signal });
    const result = response.choices[0].message?.content;

    return result;
  }

  onCopy() {
    navigator.clipboard.writeText(this.text);
    showNotification('Text copied to clipboard', '#textarea', false, '0 -20');
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
