import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxFileManagerModule } from 'devextreme-angular';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  preserveWhitespaces: true,
})
export class AppComponent {
  allowedFileExtensions: string[];

  remoteProvider: RemoteFileSystemProvider;

  constructor() {
    this.allowedFileExtensions = ['.js', '.json', '.css'];
    this.remoteProvider = new RemoteFileSystemProvider({
      endpointUrl: 'https://js.devexpress.com/Demos/Mvc/api/file-manager-file-system-scripts',
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxFileManagerModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
