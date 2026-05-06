import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { DxChatModule, DxSwitchModule } from 'devextreme-angular';
import type { DxChatTypes } from 'devextreme-angular/ui/chat';
import type { DxSwitchTypes } from 'devextreme-angular/ui/switch';
import { Observable } from 'rxjs';
import { loadMessages } from 'devextreme-angular/common/core/localization';
import { DataSource } from 'devextreme-angular/common/data';
import { AppService } from './app.service';
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
    DxSwitchModule,
    AsyncPipe,
  ],
})
export class AppComponent {
  dataSource: DataSource;

  user: DxChatTypes.User;

  typingUsers$: Observable<DxChatTypes.User[]>;

  alerts$: Observable<DxChatTypes.Alert[]>;

  isDisabled = false;

  inputFieldText = '';

  sendImmediately = false;

  hideAfterUse = false;

  suggestions: DxChatTypes.Properties['suggestions'];

  constructor(private readonly appService: AppService) {
    loadMessages(this.appService.getDictionary());

    this.dataSource = this.appService.dataSource;
    this.user = this.appService.user;
    this.alerts$ = this.appService.alerts$;
    this.typingUsers$ = this.appService.typingUsers$;
    this.suggestions = {
      items: this.appService.suggestionItems,
      onItemClick: this.onSuggestionItemClick.bind(this),
    };
  }

  convertToHtml(message: DxChatTypes.Message): string {
    return this.appService.convertToHtml(message.text);
  }

  toggleDisabledState(disabled: boolean, event = undefined) {
    this.isDisabled = disabled;
    this.suggestions = { ...this.suggestions, disabled };

    if (disabled) {
      event?.target.blur();
    } else {
      event?.target.focus();
    }
  }

  async onMessageEntered(e: DxChatTypes.MessageEnteredEvent): Promise<void> {
    if (this.isDisabled) return;

    if (!this.appService.alerts.length) {
      this.toggleDisabledState(true, e.event);
    }

    try {
      await this.appService.onMessageEntered(e);
    } finally {
      this.toggleDisabledState(false, e.event);
    }
  }

  async onSuggestionItemClick(e: { itemData?: { text: string; prompt: string } }): Promise<void> {
    const { text = '', prompt = '' } = e.itemData ?? {};

    if (this.hideAfterUse) {
      const currentItems = (this.suggestions?.items ?? []) as { text: string; prompt: string }[];
      this.suggestions = {
        items: currentItems.filter((item) => item.text !== text),
        onItemClick: this.onSuggestionItemClick.bind(this),
      };
    }

    if (this.sendImmediately) {
      const message: DxChatTypes.Message = {
        id: Date.now(),
        timestamp: new Date(),
        author: this.user,
        text: prompt,
      };

      this.appService.insertMessage(message);

      if (!this.appService.alerts.length) {
        this.toggleDisabledState(true);

        try {
          await this.appService.processMessageSending(message);
        } finally {
          this.toggleDisabledState(false);
        }
      }
    } else {
      this.inputFieldText = prompt;
    }
  }

  onInputFieldTextChanged(e: DxChatTypes.InputFieldTextChangedEvent): void {
    this.inputFieldText = e.value ?? '';
  }

  onSendImmediatelyChanged(e: DxSwitchTypes.ValueChangedEvent): void {
    this.sendImmediately = e.value;
  }

  onHideAfterUseChanged(e: DxSwitchTypes.ValueChangedEvent): void {
    this.hideAfterUse = e.value;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    AppService,
    AiService,
  ],
});
