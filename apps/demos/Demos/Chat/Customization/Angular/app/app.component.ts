import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { DxChatModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { DxChatTypes } from 'devextreme-angular/ui/chat';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

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
    DxCheckBoxModule,
    DxSelectBoxModule,
    AsyncPipe,
  ],
})
export class AppComponent {
  currentUser: DxChatTypes.User;

  supportAgent: DxChatTypes.User;

  messages$: Observable<DxChatTypes.Message[]>;

  dayHeaderFormats = this.appService.dayHeaderFormats;

  messageTimestampFormats = this.appService.messageTimestampFormats;

  dayHeaderLabel = this.appService.dayHeaderLabel;

  messageTimestampLabel = this.appService.messageTimestampLabel;

  constructor(private readonly appService: AppService) {
    [this.currentUser, this.supportAgent] = this.appService.getUsers();
    this.messages$ = this.appService.messages$;
  }

  onMessageEntered(event: DxChatTypes.MessageEnteredEvent) {
    this.appService.onMessageEntered(event);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    AppService,
  ],
});
