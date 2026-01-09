import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxHtmlEditorModule, type DxHtmlEditorTypes } from 'devextreme-angular/ui/html-editor';
import type { AIIntegration } from 'devextreme-angular/common/ai-integration';
import { Service } from './app.service';
import { AiService } from './ai.service';

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
  providers: [Service, AiService],
  imports: [
    DxHtmlEditorModule,
  ],
})

export class AppComponent {
  aiIntegration: AIIntegration;

  extractKeywordsPrompt: DxHtmlEditorTypes.AICustomCommand['prompt'];

  valueContent: string;

  constructor(service: Service, aiService: AiService) {
    this.extractKeywordsPrompt = service.getPrompt();
    this.valueContent = service.getMarkup();
    this.aiIntegration = aiService.getAiIntegration();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
