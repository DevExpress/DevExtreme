import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { DxChatModule } from 'devextreme-angular';
import type { DxChatTypes } from 'devextreme-angular/ui/chat';
import { Observable, map } from 'rxjs';
import { loadMessages } from 'devextreme-angular/common/core/localization';
import { DataSource } from 'devextreme-angular/common/data';
import { AppService, suggestionCards } from './app.service';
import { AiService } from './ai/ai.service';

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
  imports: [
    DxChatModule,
    AsyncPipe,
  ],
})
export class AppComponent {
  dataSource: DataSource;

  user: DxChatTypes.User;

  typingUsers$: Observable<DxChatTypes.User[]>;

  alerts$: Observable<DxChatTypes.Alert[]>;

  sendButtonOptions$: Observable<DxChatTypes.SendButtonProperties>;

  readonly suggestionCards = suggestionCards;

  constructor(private readonly appService: AppService) {
    loadMessages(this.appService.getDictionary());

    this.dataSource = this.appService.dataSource;
    this.user = this.appService.user;
    this.alerts$ = this.appService.alerts$;
    this.typingUsers$ = this.appService.typingUsers$;

    this.sendButtonOptions$ = this.appService.isStreaming$.pipe(
      map((isStreaming) => (isStreaming ? {
        action: 'custom' as const,
        icon: 'stopfilled',
        onClick: () => this.appService.stopStreaming(),
      } : {
        action: 'send' as const,
        icon: 'arrowright',
        onClick: () => {},
      })),
    );
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
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    AppService,
    AiService,
  ],
});
