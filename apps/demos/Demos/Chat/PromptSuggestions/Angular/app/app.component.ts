import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, signal, WritableSignal,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { DxChatModule, DxSwitchModule, DxToolbarModule } from 'devextreme-angular';
import type { DxChatTypes } from 'devextreme-angular/ui/chat';
import type { DxSwitchTypes } from 'devextreme-angular/ui/switch';
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
    DxSwitchModule,
    DxToolbarModule,
    AsyncPipe,
  ],
})
export class AppComponent {
  dataSource: DataSource;

  user: DxChatTypes.User;

  typingUsers$: Observable<DxChatTypes.User[]>;

  alerts$: Observable<DxChatTypes.Alert[]>;

  isDisabled = signal(false);

  inputFieldText = signal('');

  sendImmediately = false;

  hideAfterUse = false;

  suggestions: WritableSignal<DxChatTypes.Properties['suggestions']>;

  readonly defaultSuggestions: DxChatTypes.Properties['suggestions'];

  clearButtonOptions: WritableSignal<DxButtonTypes.Properties>;

  constructor(private readonly appService: AppService) {
    loadMessages(this.appService.getDictionary());

    this.dataSource = this.appService.dataSource;
    this.user = this.appService.user;
    this.alerts$ = this.appService.alerts$;
    this.typingUsers$ = this.appService.typingUsers$;
    this.defaultSuggestions = {
      items: this.appService.suggestionItems,
      onItemClick: this.onSuggestionItemClick.bind(this),
    };
    this.suggestions = signal(this.defaultSuggestions);
    this.clearButtonOptions = signal({
      icon: 'clearhistory',
      stylingMode: 'text',
      hint: 'Clear chat',
      onClick: () => this.onClearButtonClick(),
    });
  }

  convertToHtml(message: DxChatTypes.Message): string {
    return this.appService.convertToHtml(message.text);
  }

  toggleDisabledState(disabled: boolean, event = undefined) {
    this.isDisabled.set(disabled);
    this.suggestions.update((suggestions) => ({ ...suggestions, disabled }));
    this.clearButtonOptions.update((options) => ({ ...options, disabled }));

    if (disabled) {
      event?.target.blur();
    } else {
      event?.target.focus();
    }
  }

  async onMessageEntered(e: DxChatTypes.MessageEnteredEvent): Promise<void> {
    if (this.isDisabled()) return;

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
      const currentItems = (this.suggestions()?.items ?? []) as { text: string; prompt: string }[];
      this.suggestions.set({
        ...this.defaultSuggestions,
        items: currentItems.filter((item) => item.text !== text),
      });
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
      this.inputFieldText.set(prompt);
    }
  }

  onClearButtonClick(): void {
    this.appService.clearMessages();
    this.suggestions.set(this.defaultSuggestions);
  }

  onInputFieldTextChanged(e: DxChatTypes.InputFieldTextChangedEvent): void {
    this.inputFieldText.set(e.value ?? '');
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
    AppService,
    AiService,
  ],
});
