import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { DxFileUploaderModule, DxLoadPanelModule } from 'devextreme-angular';
import { AzureGateway } from './app.service';

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
  requests: any[];

  wrapperClassName: string;

  loadPanelVisible: boolean;

  constructor(http: HttpClient) {
    const endpointUrl = 'https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-access';
    gateway = new AzureGateway(endpointUrl, this.onRequestExecuted.bind(this));

    this.requests = [];
    this.wrapperClassName = '';
    this.loadPanelVisible = true;

    this.checkAzureStatus(http);
  }

  uploadChunk(file, uploadInfo) {
    let promise = null;

    if (uploadInfo.chunkIndex === 0) {
      promise = gateway.getUploadAccessUrl(file.name).then((accessUrls) => {
        uploadInfo.customData.accessUrl = accessUrls.url1;
      });
    } else {
      promise = Promise.resolve();
    }

    promise = promise.then(() => gateway.putBlock(uploadInfo.customData.accessUrl, uploadInfo.chunkIndex, uploadInfo.chunkBlob));

    if (uploadInfo.chunkIndex === uploadInfo.chunkCount - 1) {
      promise = promise.then(() => gateway.putBlockList(uploadInfo.customData.accessUrl, uploadInfo.chunkCount));
    }

    return promise;
  }

  onRequestExecuted({ method, urlPath, queryString }) {
    const request = { method, urlPath, queryString };
    this.requests.unshift(request);
  }

  checkAzureStatus(http: HttpClient) {
    lastValueFrom(http.get<{ active: boolean }>('https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-status?widgetType=fileManager'))
      .then((result) => {
        this.wrapperClassName = result.active ? 'show-widget' : 'show-message';
        this.loadPanelVisible = false;
      });
  }
}

let gateway = null;

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxFileUploaderModule,
    DxLoadPanelModule,
    HttpClientModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
