import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxHtmlEditorModule } from 'devextreme-angular/ui/html-editor';
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
  private readonly service = inject(Service);

  readonly aiIntegration = inject(AiService).getAiIntegration();

  readonly extractKeywordsPrompt = this.service.getPrompt();

  readonly valueContent = this.service.getMarkup();
}

bootstrapApplication(AppComponent);
