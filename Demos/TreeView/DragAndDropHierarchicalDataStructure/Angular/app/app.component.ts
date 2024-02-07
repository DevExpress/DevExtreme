import {
  NgModule, Component, enableProdMode, ViewChild,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSortableModule, DxSortableTypes } from 'devextreme-angular/ui/sortable';
import { DxTreeViewModule, DxTreeViewComponent, DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import { Service, FileSystemItem } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

type TreeView = ReturnType<AppComponent['getTreeView']>;
type Node = DxTreeViewTypes.Node;
type Item = DxTreeViewTypes.Item;

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})
export class AppComponent {
  @ViewChild('treeviewDriveC') treeviewDriveC: DxTreeViewComponent;

  @ViewChild('treeviewDriveD') treeviewDriveD: DxTreeViewComponent;

  itemsDriveC: FileSystemItem[];

  itemsDriveD: FileSystemItem[];

  constructor(service: Service) {
    this.itemsDriveC = service.getItemsDriveC();
    this.itemsDriveD = service.getItemsDriveD();
  }

  onDragChange(e: DxSortableTypes.DragChangeEvent) {
    if (e.fromComponent === e.toComponent) {
      const fromNode = this.findNode(this.getTreeView(e.fromData), e.fromIndex);
      const toNode = this.findNode(this.getTreeView(e.toData), this.calculateToIndex(e));
      if (toNode !== null && this.isChildNode(fromNode, toNode)) {
        e.cancel = true;
      }
    }
  }

  onDragEnd(e: DxSortableTypes.DragEndEvent) {
    if (e.fromComponent === e.toComponent && e.fromIndex === e.toIndex) {
      return;
    }

    const fromTreeView = this.getTreeView(e.fromData);
    const toTreeView = this.getTreeView(e.toData);
    const fromNode = this.findNode(fromTreeView, e.fromIndex);
    const toNode = this.findNode(toTreeView, this.calculateToIndex(e));

    if (e.dropInsideItem && toNode !== null && !toNode.itemData.isDirectory) {
      return;
    }

    const fromTopVisibleNode = this.getTopVisibleNode(e.fromComponent);
    const toTopVisibleNode = this.getTopVisibleNode(e.toComponent);
    const fromItems = fromTreeView.option('items');
    const toItems = toTreeView.option('items');
    this.moveNode(fromNode, toNode, fromItems, toItems, e.dropInsideItem);

    fromTreeView.option('items', fromItems);
    toTreeView.option('items', toItems);
    fromTreeView.scrollToItem(fromTopVisibleNode);
    toTreeView.scrollToItem(toTopVisibleNode);
  }

  getTreeView(driveName: string) {
    return driveName === 'driveC'
      ? this.treeviewDriveC.instance
      : this.treeviewDriveD.instance;
  }

  calculateToIndex(e: DxSortableTypes.DragEndEvent | DxSortableTypes.DragChangeEvent) {
    if (e.fromComponent != e.toComponent || e.dropInsideItem) {
      return e.toIndex;
    }

    return e.fromIndex >= e.toIndex
      ? e.toIndex
      : e.toIndex + 1;
  }

  findNode(treeView: TreeView, index: number) {
    const nodeElement = treeView.element().querySelectorAll('.dx-treeview-node')[index];
    if (nodeElement) {
      return this.findNodeById(treeView.getNodes(), nodeElement.getAttribute('data-item-id'));
    }
    return null;
  }

  findNodeById(nodes: Node[], id: string) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].itemData.id == id) {
        return nodes[i];
      }
      if (nodes[i].children) {
        const node = this.findNodeById(nodes[i].children, id);
        if (node != null) {
          return node;
        }
      }
    }
    return null;
  }

  moveNode(fromNode: Node, toNode: Node, fromItems: Item[], toItems: Item[], isDropInsideItem: boolean) {
    const fromNodeContainingArray = this.getNodeContainingArray(fromNode, fromItems);
    const fromIndex = fromNodeContainingArray.findIndex((item) => item.id == fromNode.itemData.id);
    fromNodeContainingArray.splice(fromIndex, 1);

    if (isDropInsideItem) {
      toNode.itemData.items.splice(toNode.itemData.items.length, 0, fromNode.itemData);
    } else {
      const toNodeContainingArray = this.getNodeContainingArray(toNode, toItems);
      const toIndex = toNode === null
        ? toNodeContainingArray.length
        : toNodeContainingArray.findIndex((item) => item.id == toNode.itemData.id);
      toNodeContainingArray.splice(toIndex, 0, fromNode.itemData);
    }
  }

  getNodeContainingArray(node: Node, rootArray: Item[]) {
    return node === null || node.parent === null
      ? rootArray
      : node.parent.itemData.items;
  }

  isChildNode(parentNode: Node, childNode: Node) {
    let parent = childNode.parent;
    while (parent !== null) {
      if (parent.itemData.id === parentNode.itemData.id) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }

  getTopVisibleNode(component: DxSortableTypes.DragEndEvent['fromComponent']) {
    const treeViewElement = component.element();
    const treeViewTopPosition = treeViewElement.getBoundingClientRect().top;
    const nodes = treeViewElement.querySelectorAll('.dx-treeview-node');
    for (let i = 0; i < nodes.length; i++) {
      const nodeTopPosition = nodes[i].getBoundingClientRect().top;
      if (nodeTopPosition >= treeViewTopPosition) {
        return nodes[i];
      }
    }

    return null;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTreeViewModule,
    DxSortableModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
