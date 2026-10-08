import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxHtmlEditorModule, type DxHtmlEditorTypes } from 'devextreme-angular/ui/html-editor';
import type { AIIntegration } from 'devextreme-angular/common/ai-integration';
import { Service } from './app.service';
import { AiService } from './ai/ai.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
