import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxChatModule } from 'devextreme-angular';
import { type DxChatTypes } from 'devextreme-angular/ui/chat';
import { type DxFileUploaderTypes } from 'devextreme-angular/ui/file-uploader';
import { AppService } from './app.service';

if (!document.location.host.includes('localhost')) {
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

  readonly dataSource = this.appService.dataSource;

  readonly user = this.appService.currentUser;

  onMessageEntered(e: DxChatTypes.MessageEnteredEvent): void {
    this.appService.onMessageEntered(e);
  }

  onAttachmentDownloadClick(e: DxChatTypes.AttachmentDownloadClickEvent): void {
    if (e.attachment) {
      this.appService.onAttachmentDownloadClick(e.attachment);
    }
  }

  readonly onUploaded = (e: DxFileUploaderTypes.UploadedEvent): void => {
    this.appService.onUploaded(e.file);
  };

  readonly uploadFile = () => {};
}

bootstrapApplication(AppComponent, {
  providers: [
    AppService,
  ],
});
