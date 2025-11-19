import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

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
  standalone: false,
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
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

@NgModule({
  imports: [
    BrowserModule,
    DxChatModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [AppService],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
