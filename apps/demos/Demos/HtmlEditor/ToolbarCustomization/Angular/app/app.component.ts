import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxHtmlEditorModule, DxPopupModule } from 'devextreme-angular';
import type { DxButtonTypes } from 'devextreme-angular/ui/button';
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
    DxPopupModule,
  ],
})

export class AppComponent {
  readonly editorValue = signal(inject(Service).getMarkup());

  readonly popupVisible = signal(false);

  readonly toolbarButtonOptions: DxButtonTypes.Properties = {
    text: 'Show markup',
    stylingMode: 'text',
    onClick: () => {
      this.popupVisible.set(true);
    },
  };
}

bootstrapApplication(AppComponent);
