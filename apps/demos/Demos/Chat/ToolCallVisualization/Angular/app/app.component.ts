import { bootstrapApplication } from '@angular/platform-browser';
import {
  ChangeDetectorRef, Component, enableProdMode, provideZoneChangeDetection,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  DxChatModule, DxButtonModule, DxCheckBoxModule, DxToolbarModule,
} from 'devextreme-angular';
import type { DxChatTypes } from 'devextreme-angular/ui/chat';
import type { DxButtonTypes } from 'devextreme-angular/ui/button';
import { Observable } from 'rxjs';
import { loadMessages } from 'devextreme-angular/common/core/localization';
import { DataSource } from 'devextreme-angular/common/data';
import { AppService } from './app.service';
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
    DxButtonModule,
    DxCheckBoxModule,
    DxToolbarModule,
    AsyncPipe,
  ],
})
export class AppComponent {
  dataSource: DataSource;

  user: DxChatTypes.User;

  typingUsers$: Observable<DxChatTypes.User[]>;

  alerts$: Observable<DxChatTypes.Alert[]>;

  suggestionCards: AppService['suggestionCards'];

  expandAll = false;

  isDisabled = false;

  clearButtonOptions: DxButtonTypes.Properties;

  constructor(
    private readonly appService: AppService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    loadMessages(this.appService.getDictionary());

    this.dataSource = this.appService.dataSource;
    this.user = this.appService.user;
    this.alerts$ = this.appService.alerts$;
    this.typingUsers$ = this.appService.typingUsers$;
    this.suggestionCards = this.appService.suggestionCards;
    this.clearButtonOptions = {
      icon: 'clearhistory',
      stylingMode: 'text',
      hint: 'Clear chat',
      onClick: () => this.appService.clearMessages(),
    };
  }

  toggleDisabledState(disabled: boolean, event = undefined) {
    this.isDisabled = disabled;
    this.clearButtonOptions = { ...this.clearButtonOptions, disabled };

    if (disabled) {
      event?.target.blur();
    } else {
      event?.target.focus();
    }

    this.changeDetectorRef.detectChanges();
  }

  async onMessageEntered(e: DxChatTypes.MessageEnteredEvent) {
    if (this.appService.isProcessing) {
      return;
    }

    if (!this.appService.alerts.length) {
      this.toggleDisabledState(true, e.event);
    }

    try {
      await this.appService.onMessageEntered(e);
    } finally {
      this.toggleDisabledState(false, e.event);
    }
  }

  async onSuggestionClick(prompt: string) {
    if (this.appService.isProcessing) {
      return;
    }

    this.toggleDisabledState(true);

    try {
      await this.appService.sendSuggestion(prompt);
    } finally {
      this.toggleDisabledState(false);
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    AppService,
    AiService,
  ],
});
