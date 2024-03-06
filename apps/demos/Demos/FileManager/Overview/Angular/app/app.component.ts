import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';
import { DxPopupModule } from 'devextreme-angular';
import { DxFileManagerModule, DxFileManagerTypes } from 'devextreme-angular/ui/file-manager';

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
  remoteProvider: RemoteFileSystemProvider;

  imageItemToDisplay = {} as DxFileManagerTypes.SelectedFileOpenedEvent['file'];

  popupVisible = false;

  constructor() {
    this.remoteProvider = new RemoteFileSystemProvider({
      endpointUrl: 'https://js.devexpress.com/Demos/Mvc/api/file-manager-file-system-images',
    });
  }

  displayImagePopup(e: DxFileManagerTypes.SelectedFileOpenedEvent) {
    this.imageItemToDisplay = e.file;
    this.popupVisible = true;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxFileManagerModule,
    DxPopupModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
