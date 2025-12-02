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

  itemTypeExpr(obj, value) {
    if (value) {
      obj.Type = (value === 'rectangle') ? undefined : 'group';
      return null;
    }
    return obj.Type === 'group' ? 'ellipse' : 'rectangle';
  }

  itemWidthExpr(obj, value) {
    if (value) {
      obj.Width = value;
      return null;
    }
    return obj.Width || (obj.Type === 'group' && 1.5) || 1;
  }

  itemHeightExpr(obj, value) {
    if (value) {
      obj.Height = value;
      return null;
    }
    return obj.Height || (obj.Type === 'group' && 1) || 0.75;
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
