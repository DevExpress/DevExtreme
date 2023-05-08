import {
  NgModule, ViewChild, Component, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxButtonGroupModule,
  DxHtmlEditorModule,
} from 'devextreme-angular';

import 'devextreme/ui/html_editor/converters/markdown';

import prettier from 'prettier/standalone';
import parserHtml from 'prettier/parser-html';
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
  valueContent: string;

  editorValueType = 'html';

  constructor(service: Service) {
    this.valueContent = service.getMarkup();
  }

  onValueTypeChanged({ addedItems }) {
    this.editorValueType = addedItems[0].text.toLowerCase();
  }

  prettierFormat(markup: string) {
    if (this.editorValueType === 'html') {
      return prettier.format(markup, {
        parser: 'html',
        plugins: [parserHtml],
      });
    }
    return markup;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxHtmlEditorModule,
    DxButtonGroupModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
