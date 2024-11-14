import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxHtmlEditorModule } from 'devextreme-angular/ui/html-editor';
import { Service } from './app.service';

interface Converter {
  toHtml: (value: string) => string;
  fromHtml: (value: string) => string;
}

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
})

export class AppComponent {
  valueContent: string;

  converter: Converter;

  constructor(service: Service) {
    this.valueContent = service.getMarkup();

    this.converter = {
      toHtml(value) {
        // @ts-expect-error
        const result = unified()
          // @ts-expect-error
          .use(remarkParse)
          // @ts-expect-error
          .use(remarkRehype)
          // @ts-expect-error
          .use(rehypeStringify)
          .processSync(value)
          .toString();
    
        return result;
      },
      fromHtml(value) {
        // @ts-expect-error
        const result = unified()
          // @ts-expect-error
          .use(rehypeParse)
          // @ts-expect-error
          .use(rehypeRemark)
          // @ts-expect-error
          .use(remarkStringify)
          .processSync(value)
          .toString();
    
        return result;
      },
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxHtmlEditorModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
