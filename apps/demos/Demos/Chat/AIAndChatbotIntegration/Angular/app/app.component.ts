import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxChatModule } from 'devextreme-angular';
import { DxButtonModule } from 'devextreme-angular';
import { 
  User,
  Alert,
  Message,
  MessageEnteredEvent
} from 'devextreme/ui/chat';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { loadMessages } from 'devextreme/localization';
import DataSource from 'devextreme/data/data_source';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
})
export class AppComponent {
  dataSource: DataSource;

  user: User;

  typingUsers$: Observable<User[]>;

  alerts$: Observable<Alert[]>;

  regenerationText: string;

  copyButtonIcon: string;

  isDisabled: boolean;

  constructor(private readonly appService: AppService) {
    loadMessages(this.appService.getDictionary());

    this.dataSource = this.appService.dataSource;
    this.user = this.appService.user;
    this.alerts$ = this.appService.alerts$;
    this.typingUsers$ = this.appService.typingUsers$;
    this.regenerationText = this.appService.REGENERATION_TEXT;
    this.copyButtonIcon = 'copy';
    this.isDisabled = false;
  }

  convertToHtml(message: Message): string {
    return this.appService.convertToHtml(message.text);
  }

  toggleDisabledState(disabled: boolean, event = undefined) {
    this.isDisabled = disabled;

    if (disabled) {
      event?.target.blur();
    } else {
      event?.target.focus();
    }
  };

  async onMessageEntered(e: MessageEnteredEvent) {
    if (!this.appService.alerts.length) {
      this.toggleDisabledState(true, e.event);
    }

    try {
      await this.appService.onMessageEntered(e);
    } finally {
      this.toggleDisabledState(false, e.event);
    }
  }

  onCopyButtonClick(message: Message) {
    navigator.clipboard?.writeText(message.text);

    this.copyButtonIcon = 'check';

    setTimeout(() => {
      this.copyButtonIcon = 'copy';
    }, 2500);
  }

  async onRegenerateButtonClick() {
    this.appService.updateLastMessage();
    this.toggleDisabledState(true);

    try {
      await this.appService.regenerate();
    } finally {
      this.toggleDisabledState(false);
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxChatModule,
    DxButtonModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [AppService],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
