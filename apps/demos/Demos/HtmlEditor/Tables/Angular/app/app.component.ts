import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxHtmlEditorModule, DxCheckBoxModule } from 'devextreme-angular';

import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxHtmlEditorModule,
    DxCheckBoxModule,
  ],
})

export class AppComponent {
  readonly valueContent = inject(Service).getMarkup();

  readonly allowResizing = signal(true);

  readonly contextMenuEnabled = signal(true);
}

bootstrapApplication(AppComponent);
