import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxHtmlEditorModule } from 'devextreme-angular';
import {
    AIIntegration,
    RequestParams,
    Response,
} from 'devextreme/common/ai-integration';
import { AzureOpenAI } from 'openai';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

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

  commands: any[];

  valueContent: string;

  constructor(service: Service) {
    this.azureOpenAIConfig = service.getAzureOpenAIConfig();
    this.commands = service.getCommands();
    this.valueContent = service.getMarkup();

    this.aiService = new AzureOpenAI(this.azureOpenAIConfig);
    this.aiIntegration = new AIIntegration({
      sendRequest: this.sendRequest.bind(this),
    });
  }

  sendRequest ({ prompt }: RequestParams): Response {
    const controller = new AbortController();
    const signal = controller.signal;

    const aiPrompt = [
      { role: 'system', content: prompt.system, },
      { role: 'user', content: prompt.user, },
    ];
    const promise = new Promise<string>(async (resolve, reject) => {
      try {
        debugger
        const response = await this.getAIResponse(aiPrompt, signal);
        const result = response.choices[0].message?.content;

        resolve(result);
      } catch {
        reject();
      }
    });

    const result: Response = {
      promise,
      abort: () => {
        controller.abort();
      },
    };

    return result;
  }

  async getAIResponse(messages, signal: AbortSignal) {
    const params = {
      messages,
      model: this.azureOpenAIConfig.deployment,
      max_tokens: 1000,
      temperature: 0.7,
    };
    debugger
    return this.aiService.chat.completions.create(params, { signal });
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
