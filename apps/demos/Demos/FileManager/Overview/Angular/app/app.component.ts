import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';
import { DxPopupModule } from 'devextreme-angular';
import { DxFileManagerModule, DxFileManagerTypes } from 'devextreme-angular/ui/file-manager';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [
    DxFileManagerModule,
    DxPopupModule,
  ],
})
export class AppComponent {
  remoteProvider: RemoteFileSystemProvider;

  imageItemToDisplay = {} as DxFileManagerTypes.SelectedFileOpenedEvent['file'];

  popupVisible = false;

  constructor() {
    this.remoteProvider = new RemoteFileSystemProvider({
      endpointUrl: 'https://js.devexpress.com/Demos/NetCore/api/file-manager-file-system-images',
    });
  }

  displayImagePopup(e: DxFileManagerTypes.SelectedFileOpenedEvent) {
    this.imageItemToDisplay = e.file;
    this.popupVisible = true;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
