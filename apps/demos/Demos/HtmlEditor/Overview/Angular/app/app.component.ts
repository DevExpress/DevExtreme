import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxHtmlEditorModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';

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
    DxSelectBoxModule,
  ],
})

export class AppComponent {
  private readonly service = inject(Service);

  readonly isMultiline = signal(true);

  readonly valueContent = this.service.getMarkup();

  readonly tabs = this.service.getTabsData();

  readonly currentTab = signal(this.tabs[2].value);
}

bootstrapApplication(AppComponent);
