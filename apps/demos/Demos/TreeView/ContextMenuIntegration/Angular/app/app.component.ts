import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal, viewChild,
} from '@angular/core';
import { DxListModule } from 'devextreme-angular';
import { DxTreeViewComponent, DxTreeViewModule, type DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import { DxContextMenuModule, DxContextMenuComponent, type DxContextMenuTypes } from 'devextreme-angular/ui/context-menu';

import { Service, type Product, type MenuItem } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxListModule,
    DxTreeViewModule,
    DxContextMenuModule,
  ],
})
export class AppComponent {
  private readonly treeView = viewChild.required<DxTreeViewComponent<Product>>(DxTreeViewComponent);

  private readonly contextMenu = viewChild.required<DxContextMenuComponent<Product>>(DxContextMenuComponent);

  private readonly service = inject(Service);

  readonly products: Product[] = this.service.getProducts();

  private selectedTreeItem: Product;

  readonly logItems = signal<string[]>([]);

  readonly menuItems: MenuItem[] = this.service.getMenuItems();

  treeViewItemContextMenu(e: DxTreeViewTypes.ItemContextMenuEvent<Product>) {
    this.selectedTreeItem = e.itemData;

    const isProductItem = !e.itemData.items;
    const contextMenu = this.contextMenu().instance;

    contextMenu.option('items[0].visible', !isProductItem);
    contextMenu.option('items[1].visible', !isProductItem);
    contextMenu.option('items[2].visible', isProductItem);
    contextMenu.option('items[3].visible', isProductItem);
    contextMenu.option('items[0].disabled', e.node.expanded);
    contextMenu.option('items[1].disabled', !e.node.expanded);
  }

  contextMenuItemClick(e: DxContextMenuTypes.ItemClickEvent<Product>) {
    let logEntry = '';
    const treeView = this.treeView().instance;
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
    this.logItems.update((items) => [...items, logEntry]);
  }
}

bootstrapApplication(AppComponent);
