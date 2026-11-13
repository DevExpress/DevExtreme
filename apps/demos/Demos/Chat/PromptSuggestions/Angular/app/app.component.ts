import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxChatModule, DxSwitchModule, DxToolbarModule } from 'devextreme-angular';
import type { DxChatTypes } from 'devextreme-angular/ui/chat';
import type { DxSwitchTypes } from 'devextreme-angular/ui/switch';
import type { DxButtonTypes } from 'devextreme-angular/ui/button';
import { loadMessages } from 'devextreme-angular/common/core/localization';
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
  ],
})
export class AppComponent {
  private readonly appService = inject(AppService);

  readonly dataSource = this.appService.dataSource;

  readonly user = this.appService.user;

  readonly typingUsers = this.appService.typingUsers;

  readonly alerts = this.appService.alerts;

  readonly isDisabled = signal(false);

  readonly inputFieldText = signal('');

  readonly sendImmediately = signal(false);

  readonly hideAfterUse = signal(false);

  private readonly defaultSuggestions: DxChatTypes.Properties['suggestions'] = {
    items: this.appService.suggestionItems,
    onItemClick: (e) => this.onSuggestionItemClick(e),
  };

  readonly suggestions = signal(this.defaultSuggestions);

  readonly clearButtonOptions = signal<DxButtonTypes.Properties>({
    icon: 'clearhistory',
    stylingMode: 'text',
    hint: 'Clear chat',
    onClick: () => this.onClearButtonClick(),
  });

  constructor() {
    loadMessages(this.appService.getDictionary());
  }

  convertToHtml(message: DxChatTypes.Message): string {
    return this.appService.convertToHtml(message.text);
  }

  private toggleDisabledState(disabled: boolean, event = undefined) {
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

    if (!this.appService.alerts().length) {
      this.toggleDisabledState(true, e.event);
    }

    try {
      await this.appService.onMessageEntered(e);
    } finally {
      this.toggleDisabledState(false, e.event);
    }
  }

  private async onSuggestionItemClick(e: { itemData?: { text: string; prompt: string } }): Promise<void> {
    const { text = '', prompt = '' } = e.itemData ?? {};

    if (this.hideAfterUse()) {
      const currentItems = (this.suggestions()?.items ?? []) as { text: string; prompt: string }[];
      this.suggestions.set({
        ...this.defaultSuggestions,
        items: currentItems.filter((item) => item.text !== text),
      });
    }

    if (this.sendImmediately()) {
      const message: DxChatTypes.Message = {
        id: Date.now(),
        timestamp: new Date(),
        author: this.user,
        text: prompt,
      };

      this.appService.insertMessage(message);

      if (!this.appService.alerts().length) {
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

  private onClearButtonClick(): void {
    this.appService.clearMessages();
    this.suggestions.set(this.defaultSuggestions);
  }

  onInputFieldTextChanged(e: DxChatTypes.InputFieldTextChangedEvent): void {
    this.inputFieldText.set(e.value ?? '');
  }

  onSendImmediatelyChanged(e: DxSwitchTypes.ValueChangedEvent): void {
    this.sendImmediately.set(e.value);
  }

  onHideAfterUseChanged(e: DxSwitchTypes.ValueChangedEvent): void {
    this.hideAfterUse.set(e.value);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    AppService,
    AiService,
  ],
});
