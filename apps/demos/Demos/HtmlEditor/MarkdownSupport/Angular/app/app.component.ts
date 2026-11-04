import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkStringify from 'remark-stringify';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import rehypeStringify from 'rehype-stringify';
import { DxHtmlEditorModule } from 'devextreme-angular/ui/html-editor';
import { Service } from './app.service';

interface Converter {
  toHtml: (value: string) => string;
  fromHtml: (value: string) => string;
}

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
  ],
})

export class AppComponent {
  readonly valueContent = signal(inject(Service).getMarkup());

  readonly converter: Converter = {
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
  };
}

bootstrapApplication(AppComponent);
