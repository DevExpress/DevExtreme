import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxChatModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
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
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  private readonly appService = inject(AppService);

  readonly currentUser = this.appService.currentUser;

  readonly messages = this.appService.messages;

  readonly dayHeaderFormats = this.appService.dayHeaderFormats;

  readonly messageTimestampFormats = this.appService.messageTimestampFormats;

  readonly dayHeaderLabel = this.appService.dayHeaderLabel;

  readonly messageTimestampLabel = this.appService.messageTimestampLabel;

  onMessageEntered(event: DxChatTypes.MessageEnteredEvent) {
    this.appService.onMessageEntered(event);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    AppService,
  ],
});
