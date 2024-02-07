import {
  NgModule, Component, enableProdMode, ViewChild,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxListModule } from 'devextreme-angular';
import { DxTreeViewComponent, DxTreeViewModule, DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import { DxContextMenuModule, DxContextMenuComponent, DxContextMenuTypes } from 'devextreme-angular/ui/context-menu';
import { Product, Service, MenuItem } from './app.service';

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
  @ViewChild(DxTreeViewComponent, { static: false }) treeView: DxTreeViewComponent;

  @ViewChild(DxContextMenuComponent, { static: false }) contextMenu: DxContextMenuComponent;

  products: Product[];

  selectedTreeItem: Product;

  logItems: string[] = [];

  menuItems: MenuItem[];

  constructor(service: Service) {
    this.products = service.getProducts();
    this.menuItems = service.getMenuItems();
  }

  treeViewItemContextMenu(e: DxTreeViewTypes.ItemContextMenuEvent) {
    this.selectedTreeItem = e.itemData as Product;

    const isProduct = e.itemData.price !== undefined;
    const contextMenu = this.contextMenu.instance;

    contextMenu.option('items[0].visible', !isProduct);
    contextMenu.option('items[1].visible', !isProduct);
    contextMenu.option('items[2].visible', isProduct);
    contextMenu.option('items[3].visible', isProduct);
    contextMenu.option('items[0].disabled', e.node.expanded);
    contextMenu.option('items[1].disabled', !e.node.expanded);
  }

  contextMenuItemClick(e: DxContextMenuTypes.ItemClickEvent) {
    let logEntry = '';
    const treeView = this.treeView.instance;
    switch ((e.itemData as Product).id) {
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
    BrowserTransferStateModule,
    DxListModule,
    DxTreeViewModule,
    DxContextMenuModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
