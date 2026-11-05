import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, signal } from '@angular/core';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';
import { DxPopupModule } from 'devextreme-angular';
import { DxFileManagerModule } from 'devextreme-angular/ui/file-manager';
import type { DxFileManagerTypes } from 'devextreme-angular/ui/file-manager';

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
  readonly remoteProvider = new RemoteFileSystemProvider({
    endpointUrl: 'https://js.devexpress.com/Demos/NetCore/api/file-manager-file-system-images',
  });

  readonly imageItemToDisplay = signal({} as DxFileManagerTypes.SelectedFileOpenedEvent['file']);

  readonly popupVisible = signal(false);

  displayImagePopup(e: DxFileManagerTypes.SelectedFileOpenedEvent) {
    this.imageItemToDisplay.set(e.file);
    this.popupVisible.set(true);
  }
}

bootstrapApplication(AppComponent);
