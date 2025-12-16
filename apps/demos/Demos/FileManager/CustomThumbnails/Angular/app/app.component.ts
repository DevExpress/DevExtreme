import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxFileManagerModule } from 'devextreme-angular';

import { Service, FileItem } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxFileManagerModule,
  ],
})

export class AppComponent {
  fileItems: FileItem[];

  constructor(service: Service) {
    this.fileItems = service.getFileItems();
  }

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

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
