import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode } from '@angular/core';
import { DxFileManagerModule } from 'devextreme-angular';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  preserveWhitespaces: true,
  imports: [
    DxFileManagerModule,
  ],
})
export class AppComponent {
  readonly allowedFileExtensions: string[] = ['.js', '.json', '.css'];

  readonly remoteProvider = new RemoteFileSystemProvider({
    endpointUrl: 'https://js.devexpress.com/Demos/NetCore/api/file-manager-file-system',
  });
}

bootstrapApplication(AppComponent);
