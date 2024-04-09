import {
  NgModule, Component, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxHtmlEditorModule, DxPopupModule } from 'devextreme-angular';
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})

export class AppComponent {
  editorValue: string;

  popupVisible: boolean;

  toolbarButtonOptions: DxButtonTypes.Properties = {
    text: 'Show markup',
    stylingMode: 'text',
    onClick: () => this.popupVisible = true,
  };

  constructor(service: Service) {
    this.editorValue = service.getMarkup();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxHtmlEditorModule,
    DxPopupModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
