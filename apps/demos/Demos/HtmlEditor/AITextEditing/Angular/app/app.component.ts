import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxHtmlEditorModule, type DxHtmlEditorTypes } from 'devextreme-angular/ui/html-editor';
import {
  AIIntegration,
  RequestParams,
  Response,
} from 'devextreme-angular/common/ai-integration';
import { AzureOpenAI, OpenAI } from 'openai';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

type AIMessage = (OpenAI.ChatCompletionUserMessageParam | OpenAI.ChatCompletionSystemMessageParam) & {
  content: string;
};

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
})

export class AppComponent {
  azureOpenAIConfig: any;

  aiService: AzureOpenAI;

  aiIntegration: AIIntegration;

  extractKeywordsPrompt: DxHtmlEditorTypes.AICustomCommand['prompt'];

  valueContent: string;

  constructor(service: Service) {
    this.azureOpenAIConfig = service.getAzureOpenAIConfig();
    this.extractKeywordsPrompt = service.getPrompt();
    this.valueContent = service.getMarkup();

    this.aiService = new AzureOpenAI(this.azureOpenAIConfig);
    this.aiIntegration = new AIIntegration({
      sendRequest: this.sendRequest.bind(this),
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
}

@NgModule({
  imports: [
    BrowserModule,
    DxHtmlEditorModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
