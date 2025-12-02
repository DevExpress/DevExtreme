import {
  NgModule, Component, enableProdMode, ViewChild,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxListModule } from 'devextreme-angular';
import { DxTreeViewComponent, DxTreeViewModule, type DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import { DxContextMenuModule, DxContextMenuComponent, type DxContextMenuTypes } from 'devextreme-angular/ui/context-menu';

import { Service, type Product, type MenuItem } from './app.service';

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
})
export class AppComponent {
  @ViewChild(DxTreeViewComponent<Product>, { static: false }) treeView: DxTreeViewComponent<Product>;

  @ViewChild(DxContextMenuComponent<Product>, { static: false }) contextMenu: DxContextMenuComponent<Product>;

  products: Product[];

  selectedTreeItem: Product;

  logItems: string[] = [];

  menuItems: MenuItem[];

  constructor(service: Service) {
    this.products = service.getProducts();
    this.menuItems = service.getMenuItems();
  }

  treeViewItemContextMenu(e: DxTreeViewTypes.ItemContextMenuEvent<Product>) {
    this.selectedTreeItem = e.itemData;

    const isProductItem = !e.itemData.items;
    const contextMenu = this.contextMenu.instance;

    contextMenu.option('items[0].visible', !isProductItem);
    contextMenu.option('items[1].visible', !isProductItem);
    contextMenu.option('items[2].visible', isProductItem);
    contextMenu.option('items[3].visible', isProductItem);
    contextMenu.option('items[0].disabled', e.node.expanded);
    contextMenu.option('items[1].disabled', !e.node.expanded);
  }

  contextMenuItemClick(e: DxContextMenuTypes.ItemClickEvent<Product>) {
    let logEntry = '';
    const treeView = this.treeView.instance;
    switch (e.itemData.id) {
      case 'expand': {
        logEntry = `The '${this.selectedTreeItem.text}' group was expanded`;
        treeView.expandItem(this.selectedTreeItem.id);
        break;
      }
      case 'collapse': {
        logEntry = `The '${this.selectedTreeItem.text}' group was collapsed`;
        treeView.collapseItem(this.selectedTreeItem.id);
        break;
      }
      case 'details': {
        logEntry = `Details about '${this.selectedTreeItem.text}' were displayed`;
        break;
      }
      case 'copy': {
        logEntry = `Information about '${this.selectedTreeItem.text}' was copied`;
        break;
      }
    }
    this.logItems.push(logEntry);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxListModule,
    DxTreeViewModule,
    DxContextMenuModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
