import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxChatModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { User, Message, MessageEnteredEvent } from 'devextreme/ui/chat';
import { AppService } from './app.service';
import { Observable } from 'rxjs';

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
  currentUser: User;
  supportAgent: User;
  messages$: Observable<Message[]>;
  dayHeaderFormat = ['dd/MM/yyyy', 'dd.MM.yyyy', 'MMMM dd, yyyy', 'EEEE, MMMM dd'];
  messageTimestampFormat = ['hh:mm a', 'hh:mm:ss a', 'HH:mm', 'HH:mm:ss'];

  constructor(private appService: AppService) {
    [this.currentUser, this.supportAgent] = this.appService.getUsers();
    this.messages$ = this.appService.messages$;
  }

  onMessageEntered(event: MessageEnteredEvent) {
    this.appService.onMessageEntered(event);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxChatModule,
    DxCheckBoxModule,
    DxSelectBoxModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [AppService],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
