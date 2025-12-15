import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChatModule } from 'devextreme-angular';
import { DxChatTypes } from 'devextreme-angular/ui/chat';
import { type DxFileUploaderTypes } from 'devextreme-angular/ui/file-uploader';
import { DataSource } from 'devextreme-angular/common/data';
import { AppService } from './app.service';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-expect-error
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxChatModule,
  ],
})
export class AppComponent {
  dataSource: DataSource;

  user: DxChatTypes.User;

  constructor(private readonly appService: AppService) {
    this.dataSource = this.appService.dataSource;
    this.user = this.appService.currentUser;
  }

  onMessageEntered(e: DxChatTypes.MessageEnteredEvent): void {
    this.appService.onMessageEntered(e);
  }

  onAttachmentDownloadClick(e: DxChatTypes.AttachmentDownloadClickEvent): void {
    if (e.attachment) {
      this.appService.onAttachmentDownloadClick(e.attachment);
    }
  }

  onUploaded = (e: DxFileUploaderTypes.UploadedEvent): void => {
    this.appService.onUploaded(e.file);
  };

  uploadFile = () => {};
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    AppService,
  ],
});
