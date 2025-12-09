import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { DxChatModule } from 'devextreme-angular';
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
    AsyncPipe,
  ],
})
export class AppComponent {
  currentUser: DxChatTypes.User;

  supportAgent: DxChatTypes.User;

  messages$: Observable<DxChatTypes.Message[]>;

  userChatTypingUsers$: Observable<DxChatTypes.User[]>;

  supportChatTypingUsers$: Observable<DxChatTypes.User[]>;

  constructor(private readonly appService: AppService) {
    [this.currentUser, this.supportAgent] = this.appService.getUsers();
    this.messages$ = this.appService.messages$;
    this.userChatTypingUsers$ = this.appService.userChatTypingUsers$;
    this.supportChatTypingUsers$ = this.appService.supportChatTypingUsers$;
  }

  onMessageEntered(event: DxChatTypes.MessageEnteredEvent) {
    this.appService.onMessageEntered(event);
  }

  userChatOnTypingStart() {
    this.appService.userChatOnTypingStart();
  }

  userChatOnTypingEnd() {
    this.appService.userChatOnTypingEnd();
  }

  supportChatOnTypingStart() {
    this.appService.supportChatOnTypingStart();
  }

  supportChatOnTypingEnd() {
    this.appService.supportChatOnTypingEnd();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    AppService,
  ],
});
