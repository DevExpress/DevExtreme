import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, computed, enableProdMode, inject,
} from '@angular/core';
import { DxChatModule, DxToolbarModule } from 'devextreme-angular';
import type { DxChatTypes } from 'devextreme-angular/ui/chat';
import type { DxButtonTypes } from 'devextreme-angular/ui/button';
import { loadMessages } from 'devextreme-angular/common/core/localization';
import { AppService, suggestionCards } from './app.service';
import { AiService } from './ai/ai.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxChatModule,
    DxToolbarModule,
  ],
})
export class AppComponent {
  private readonly appService = inject(AppService);

  readonly dataSource = this.appService.dataSource;

  readonly user = this.appService.user;

  readonly typingUsers = this.appService.typingUsers;

  readonly alerts = this.appService.alerts;

  readonly sendButtonOptions = computed<DxChatTypes.SendButtonProperties>(() => (
    this.appService.isStreaming() ? {
      action: 'custom',
      icon: 'stopfilled',
      onClick: () => this.appService.stopStreaming(),
    } : {
      action: 'send',
      icon: 'arrowright',
      onClick: () => {},
    }
  ));

  readonly clearButtonOptions = computed<DxButtonTypes.Properties>(() => ({
    icon: 'clearhistory',
    stylingMode: 'text',
    hint: 'Clear chat',
    disabled: this.appService.isStreaming(),
    onClick: () => this.appService.clearMessages(),
  }));

  readonly suggestionCards = suggestionCards;

  constructor() {
    loadMessages(this.appService.getDictionary());
  }

  convertToHtml(message: DxChatTypes.Message): string {
    return this.appService.convertToHtml(message.text);
  }

  onMessageEntered(e: DxChatTypes.MessageEnteredEvent): void {
    this.appService.onMessageEntered(e);
  }

  onSuggestionClick(prompt: string): void {
    this.appService.sendSuggestion(prompt);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    AppService,
    AiService,
  ],
});
