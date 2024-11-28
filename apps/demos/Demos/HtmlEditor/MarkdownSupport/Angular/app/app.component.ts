import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import rehypeStringify from "rehype-stringify";
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
        const result = unified()
          .use(remarkParse)
          .use(remarkRehype)
          .use(rehypeStringify)
          .processSync(value)
          .toString();

        return result;
      },
      fromHtml(value) {
        const result = unified()
          .use(rehypeParse)
          .use(rehypeRemark)
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
