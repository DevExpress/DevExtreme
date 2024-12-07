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

  isDisabled$: Observable<boolean>;

  typingUsers$: Observable<User[]>;

  alerts$: Observable<Alert[]>;

  regenerationText: string;

  constructor(private readonly appService: AppService) {
    loadMessages(this.appService.getDictionary());

    this.dataSource = this.appService.dataSource;
    this.user = this.appService.user;
    this.typingUsers$ = this.appService.typingUsers$;
    this.alerts$ = this.appService.alerts$;
    this.regenerationText = this.appService.REGENERATION_TEXT;
  }

  convertToHtml(message: Message): string {
    return this.appService.convertToHtml(message.text);
  }

  isDisabled(): boolean {
    return this.appService.isDisabled;
  }

  getCopyButtonIcon(): string {
    return this.appService.copyButtonIcon;
  }

  onMessageEntered(event: MessageEnteredEvent) {
    this.appService.onMessageEntered(event);
  }

  onCopyButtonClick(message: Message) {
   this.appService.onCopyButtonClick(message);
}

  onRegenerateButtonClick() {
    this.appService.onRegenerateButtonClick();
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
