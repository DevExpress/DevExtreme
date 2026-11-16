import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, Injector, afterNextRender, enableProdMode, inject, signal,
} from '@angular/core';
import {
  DxChatModule, DxButtonModule, DxCheckBoxModule, DxToolbarModule,
} from 'devextreme-angular';
import type { DxChatTypes } from 'devextreme-angular/ui/chat';
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
    DxButtonModule,
    DxCheckBoxModule,
    DxToolbarModule,
  ],
})
export class AppComponent {
  private readonly appService = inject(AppService);

  private readonly injector = inject(Injector);

  readonly dataSource = this.appService.dataSource;

  readonly user = this.appService.user;

  readonly typingUsers = this.appService.typingUsers;

  readonly alerts = this.appService.alerts;

  readonly suggestionCards = this.appService.suggestionCards;

  readonly expandAll = signal(false);

  readonly isDisabled = signal(false);

  readonly clearButtonOptions = signal<DxButtonTypes.Properties>({
    icon: 'clearhistory',
    stylingMode: 'text',
    hint: 'Clear chat',
    onClick: () => this.appService.clearMessages(),
  });

  constructor() {
    loadMessages(this.appService.getDictionary());
  }

  toggleDisabledState(disabled: boolean, event = undefined) {
    this.isDisabled.set(disabled);
    this.clearButtonOptions.update((options) => ({ ...options, disabled }));

    if (disabled) {
      event?.target.blur();
    } else {
      afterNextRender(() => event?.target.focus(), { injector: this.injector });
    }
  }

  async onMessageEntered(e: DxChatTypes.MessageEnteredEvent) {
    if (this.appService.isProcessing) {
      return;
    }

    if (!this.appService.alerts().length) {
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
    AppService,
    AiService,
  ],
});
