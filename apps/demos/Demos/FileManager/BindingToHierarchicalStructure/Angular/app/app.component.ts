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
}

bootstrapApplication(AppComponent);
