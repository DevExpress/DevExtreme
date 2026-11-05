import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxChatModule } from 'devextreme-angular';
import { type DxChatTypes } from 'devextreme-angular/ui/chat';
import { AppService } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxChatModule,
  ],
})
export class AppComponent {
  private readonly appService = inject(AppService);

  readonly currentUser = this.appService.currentUser;

  readonly supportAgent = this.appService.supportAgent;

  readonly messages = this.appService.messages;

  readonly userChatTypingUsers = this.appService.userChatTypingUsers;

  readonly supportChatTypingUsers = this.appService.supportChatTypingUsers;

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
    AppService,
  ],
});
