import {
  NgModule, Component, enableProdMode,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClientModule } from '@angular/common/http';

import { DxDiagramModule } from 'devextreme-angular';
import { ArrayStore } from 'devextreme-angular/common/data';
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
  preserveWhitespaces: true,
})
export class AppComponent {
  orgItemsDataSource: ArrayStore;

  orgLinksDataSource: ArrayStore;

  constructor(service: Service) {
    this.orgItemsDataSource = new ArrayStore({
      key: 'ID',
      data: service.getOrgItems(),
    });
    this.orgLinksDataSource = new ArrayStore({
      key: 'ID',
      data: service.getOrgLinks(),
    });
  }

  // eslint-disable-next-line consistent-return
  itemTypeExpr(obj, value) {
    if (value) { obj.Type = (value === 'rectangle') ? undefined : 'group'; } else { return obj.Type === 'group' ? 'ellipse' : 'rectangle'; }
  }

  // eslint-disable-next-line consistent-return
  itemWidthExpr(obj, value) {
    if (value) { obj.Width = value; } else { return obj.Width || (obj.Type === 'group' && 1.5) || 1; }
  }

  // eslint-disable-next-line consistent-return
  itemHeightExpr(obj, value) {
    if (value) { obj.Height = value; } else { return obj.Height || (obj.Type === 'group' && 1) || 0.75; }
  }

  itemTextStyleExpr(obj) {
    if (obj.Level === 'senior') { return { 'font-weight': 'bold', 'text-decoration': 'underline' }; }
    return {};
  }

  itemStyleExpr(obj) {
    const style: Record<string, string> = { stroke: '#444444' };
    if (obj.Type === 'group') { style.fill = '#f3f3f3'; }
    return style;
  }

  linkStyleExpr() {
    return { stroke: '#444444' };
  }

  linkFromLineEndExpr() {
    return 'none';
  }

  linkToLineEndExpr() {
    return 'none';
  }
}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    DxDiagramModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
