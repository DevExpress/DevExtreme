import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import type { AIIntegration } from 'devextreme-angular/common/ai-integration';
import type { DxChatTypes } from 'devextreme-angular/ui/chat';
import type { DxButtonGroupTypes } from 'devextreme-angular/ui/button-group';
import { Service, type Sale } from './app.service';
import { AiService } from './ai/ai.service';

interface SuggestionItem extends DxButtonGroupTypes.Item {
  prompt: string;
}

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
  imports: [DxDataGridModule],
})
export class AppComponent {
  sales: Sale[];

  aiIntegration: AIIntegration;

  chatConfig: DxChatTypes.Properties;

  private chatInstance: DxChatTypes.InitializedEvent['component'] | null = null;

  constructor(service: Service, aiService: AiService) {
    this.sales = service.getSales();
    this.aiIntegration = aiService.getAiIntegration();

    this.chatConfig = {
      onInitialized: (e: DxChatTypes.InitializedEvent) => {
        this.chatInstance = e.component;
      },
      user: { id: 'user' },
      suggestions: {
        items: [
          {
            text: '💡 Help',
            prompt: `💡 The DataGrid AI Assistant allows you to control the component using natural language. You can execute commands such as the following:
• Sort records
• Apply a filter
• Search for a specific value
• Group records by a field
• Focus and select rows
• Modify paging settings
• Pin, resize, and reorder columns
• Configure data summaries
• Pick a suggestion or enter a custom request to get started.`,
          },
          {
            text: '🔍 Filter Sector by Health',
            prompt: 'Filter Sector by Health',
          },
          {
            text: '↕️ Sort by Region',
            prompt: 'Sort by Region',
          },
          {
            text: '🧩 Group by Product',
            prompt: 'Group by Product',
            width: 170,
          },
        ] as SuggestionItem[],
        onItemClick: (e: DxButtonGroupTypes.ItemClickEvent) => {
          this.onSuggestionItemClick(e);
        },
      },
    };
  }

  onSuggestionItemClick(e: DxButtonGroupTypes.ItemClickEvent) {
    const { prompt, text } = e.itemData as SuggestionItem;
    const userId = text === '💡 Help' ? 'help' : 'user';

    const message = {
      id: Date.now(),
      timestamp: new Date(),
      author: { id: userId },
      text: prompt,
    };

    this.chatInstance.getDataSource().store().push([{
      type: 'insert',
      data: message,
    }]);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
