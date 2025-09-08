import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AzureOpenAI, type OpenAI } from 'openai';

import { DxButtonModule, DxTextAreaModule } from 'devextreme-angular';
import type { ButtonStyle } from 'devextreme-angular/common';
import {
  AIIntegration,
  RequestParams,
  Response,
} from 'devextreme-angular/common/ai-integration';
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

const sendNotification = (message: string, of: string, offset?: string) => {
  notify({
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

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
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

  resetButtonOptions = {
    stylingMode: 'outlined' as ButtonStyle,
    type: 'normal'
  };

  smartPasteButtonOptions = {
    stylingMode: 'contained' as ButtonStyle,
    type: 'default',
  }

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
              form.smartPaste(clipboardText);;
            } else {
              sendNotification('Copy the text to paste into the form', '#form');
            }
          })
          .catch(() => {
            sendNotification('Could not access the clipboard', '#form');
          });
      }
    });
  }

  sendRequest({ prompt }: RequestParams): Response {
    const controller = new AbortController();
    const signal = controller.signal;

    const aiPrompt: AIMessage[] = [
      { role: 'system', content: prompt.system, },
      { role: 'user', content: prompt.user, },
    ];
    const promise = this.getAIResponse(aiPrompt, signal);

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
      max_tokens: 1000,
      temperature: 0.7,
    };

    const response = await this.aiService.chat.completions.create(params, { signal });
    const result = response.choices[0].message?.content;

    return result;
  }

  onCopy() {
    navigator.clipboard.writeText(this.text);
    sendNotification('Text copied to clipboard', '#textarea');
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxButtonModule,
    DxFormModule,
    DxTextAreaModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
