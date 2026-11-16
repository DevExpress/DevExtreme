import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxFileManagerModule } from 'devextreme-angular';

import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxFileManagerModule,
  ],
})

export class AppComponent {
  readonly fileItems = inject(Service).getFileItems();

  customizeIcon(fileSystemItem) {
    if (fileSystemItem.isDirectory) { return '../../../../images/thumbnails/folder.svg'; }

    const fileExtension = fileSystemItem.getFileExtension();
    switch (fileExtension) {
      case '.txt':
        return '../../../../images/thumbnails/doc-txt.svg';
      case '.rtf':
        return '../../../../images/thumbnails/doc-rtf.svg';
      case '.xml':
        return '../../../../images/thumbnails/doc-xml.svg';
      default:
        return '../../../../images/thumbnails/doc-txt.svg';
    }
  }
}

bootstrapApplication(AppComponent);
