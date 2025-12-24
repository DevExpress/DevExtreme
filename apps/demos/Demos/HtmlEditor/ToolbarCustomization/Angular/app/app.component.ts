import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxHtmlEditorModule, DxPopupModule } from 'devextreme-angular';
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import { Service } from './app.service';

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
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  imports: [
    DxHtmlEditorModule,
    DxPopupModule,
  ],
})

export class AppComponent {
  editorValue: string;

  popupVisible: boolean;

  toolbarButtonOptions: DxButtonTypes.Properties = {
    text: 'Show markup',
    stylingMode: 'text',
    onClick: () => { this.popupVisible = true; },
  };

  constructor(service: Service) {
    this.editorValue = service.getMarkup();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
