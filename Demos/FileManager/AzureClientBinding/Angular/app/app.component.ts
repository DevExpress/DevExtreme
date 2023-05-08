import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { DxFileManagerModule, DxLoadPanelModule } from 'devextreme-angular';
import CustomFileSystemProvider from 'devextreme/file_management/custom_provider';
import { AzureGateway, AzureFileSystem } from './app.service';

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

  fileSystemProvider: CustomFileSystemProvider;

  requests: any[];

  wrapperClassName: string;

  loadPanelVisible: boolean;

  constructor(http: HttpClient) {
    const endpointUrl = 'https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-access';
    gateway = new AzureGateway(endpointUrl, this.onRequestExecuted.bind(this));
    azure = new AzureFileSystem(gateway);

    this.allowedFileExtensions = [];
    this.fileSystemProvider = new CustomFileSystemProvider({
      getItems,
      createDirectory,
      renameItem,
      deleteItem,
      copyItem,
      moveItem,
      uploadFileChunk,
      downloadItems,
    });

    this.requests = [];
    this.wrapperClassName = '';
    this.loadPanelVisible = true;

    this.checkAzureStatus(http);
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

function getItems(parentDirectory) {
  return azure.getItems(parentDirectory.path);
}

function createDirectory(parentDirectory, name) {
  return azure.createDirectory(parentDirectory.path, name);
}

function renameItem(item, name) {
  return item.isDirectory ? azure.renameDirectory(item.path, name) : azure.renameFile(item.path, name);
}

function deleteItem(item) {
  return item.isDirectory ? azure.deleteDirectory(item.path) : azure.deleteFile(item.path);
}

function copyItem(item, destinationDirectory) {
  const destinationPath = destinationDirectory.path ? `${destinationDirectory.path}/${item.name}` : item.name;
  return item.isDirectory ? azure.copyDirectory(item.path, destinationPath) : azure.copyFile(item.path, destinationPath);
}

function moveItem(item, destinationDirectory) {
  const destinationPath = destinationDirectory.path ? `${destinationDirectory.path}/${item.name}` : item.name;
  return item.isDirectory ? azure.moveDirectory(item.path, destinationPath) : azure.moveFile(item.path, destinationPath);
}

function uploadFileChunk(fileData, uploadInfo, destinationDirectory) {
  let promise = null;

  if (uploadInfo.chunkIndex === 0) {
    const filePath = destinationDirectory.path ? `${destinationDirectory.path}/${fileData.name}` : fileData.name;
    promise = gateway.getUploadAccessUrl(filePath).then((accessUrls) => {
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

function downloadItems(items) {
  azure.downloadFile(items[0].path);
}

let gateway = null;
let azure = null;

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
