import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { DxFileManagerModule, DxLoadPanelModule } from 'devextreme-angular';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  preserveWhitespaces: true,
})
export class AppComponent {
  allowedFileExtensions: string[];

  fileSystemProvider: RemoteFileSystemProvider;

  wrapperClassName: string;

  loadPanelVisible: boolean;

  constructor(http: HttpClient) {
    this.allowedFileExtensions = [];
    this.fileSystemProvider = new RemoteFileSystemProvider({
      endpointUrl: 'https://js.devexpress.com/Demos/Mvc/api/file-manager-azure',
    });

    this.wrapperClassName = '';
    this.loadPanelVisible = true;

    this.checkAzureStatus(http);
  }

  checkAzureStatus(http: HttpClient) {
    lastValueFrom(http.get<{ active: boolean }>('https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-status?widgetType=fileManager'))
      .then((result) => {
        this.wrapperClassName = result.active ? 'show-widget' : 'show-message';
        this.loadPanelVisible = false;
      });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxFileManagerModule,
    DxLoadPanelModule,
    HttpClientModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
