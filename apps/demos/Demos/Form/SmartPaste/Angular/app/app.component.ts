import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, viewChild,
} from '@angular/core';
import { AzureOpenAI, type OpenAI } from 'openai';
import { DxTextAreaModule } from 'devextreme-angular';
import {
  AIIntegration,
  type RequestParams,
  type Response,
} from 'devextreme-angular/common/ai-integration';
import { DxButtonModule, type DxButtonTypes } from 'devextreme-angular/ui/button';
import { DxFormModule, DxFormComponent } from 'devextreme-angular/ui/form';
import notify from 'devextreme/ui/notify';

import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxButtonModule,
    DxFormModule,
    DxTextAreaModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  private readonly form = viewChild.required(DxFormComponent);

  readonly colCountByScreen = {
    xs: 2,
    sm: 2,
    md: 2,
    lg: 2,
  };

  readonly amountDueEditorOptions = { placeholder: '$0.00', stylingMode };

  readonly amountDueAIOptions = { instruction: 'Format as the following: $0.00' };

  readonly statementDueEditorOptions = { placeholder: 'MM/DD/YYYY', stylingMode };

  readonly statementDueAIOptions = { instruction: 'Format as the following: MM/DD/YYYY' };

  readonly textEditorOptions = { stylingMode };

  readonly phoneEditorOptions = { placeholder: '(000) 000-0000', stylingMode };

  readonly phoneAIOptions = { instruction: 'Format as the following: (000) 000-0000' };

  readonly emailAIOptions = { instruction: 'Do not fill this field if the text contains an invalid email address. A valid email is in the following format: email@example.com' };

  readonly zipEditorOptions = { stylingMode, mode: 'text' };

  readonly zipAIOptions = { instruction: 'If the text does not contain a ZIP, determine the ZIP code from the provided address.' };

  readonly resetButtonOptions: DxButtonTypes.Properties = {
    stylingMode: 'outlined',
    type: 'normal',
  };

  readonly smartPasteButtonOptions: DxButtonTypes.Properties = {
    stylingMode: 'contained',
    type: 'default',
  };

  private readonly azureOpenAIConfig = this.service.getAzureOpenAIConfig();

  private readonly aiService = new AzureOpenAI(this.azureOpenAIConfig);

  readonly aiIntegration = new AIIntegration({
    sendRequest: this.sendRequest.bind(this),
  });

  text = this.service.getDefaultText();

  ngAfterViewInit() {
    const form = this.form().instance;

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

  private sendRequest({ prompt }: RequestParams): Response {
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

  private async getAIResponse(messages: AIMessage[], signal: AbortSignal) {
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

bootstrapApplication(AppComponent);
