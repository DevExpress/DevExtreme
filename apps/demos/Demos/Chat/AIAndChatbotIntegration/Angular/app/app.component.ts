import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxChatModule, DxButtonModule, DxToolbarModule } from 'devextreme-angular';
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
    DxToolbarModule,
  ],
})
export class AppComponent {
  private readonly appService = inject(AppService);

  readonly dataSource = this.appService.dataSource;

  readonly user = this.appService.user;

  readonly typingUsers = this.appService.typingUsers;

  readonly alerts = this.appService.alerts;

  readonly regenerationText = this.appService.REGENERATION_TEXT;

  readonly copyButtonIcon = signal('copy');

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

  convertToHtml(message: DxChatTypes.Message): string {
    return this.appService.convertToHtml(message.text);
  }

  private toggleDisabledState(disabled: boolean, event = undefined) {
    this.isDisabled.set(disabled);
    this.clearButtonOptions.update((options) => ({ ...options, disabled }));

    if (disabled) {
      event?.target.blur();
    } else {
      event?.target.focus();
    }
  }

  async onMessageEntered(e: DxChatTypes.MessageEnteredEvent) {
    if (!this.appService.alerts().length) {
      this.toggleDisabledState(true, e.event);
    }

    try {
      await this.appService.onMessageEntered(e);
    } finally {
      this.toggleDisabledState(false, e.event);
    }
  }

  onCopyButtonClick(message: DxChatTypes.Message) {
    navigator.clipboard?.writeText(message.text);

    this.copyButtonIcon.set('check');

    setTimeout(() => {
      this.copyButtonIcon.set('copy');
    }, 2500);
  }

  async onRegenerateButtonClick() {
    this.appService.updateLastMessage();
    this.toggleDisabledState(true);

    try {
      await this.appService.regenerate();
    } finally {
      setTimeout(() => {
        this.toggleDisabledState(false);
      });
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    AppService,
    AiService,
  ],
});
