import { NgModule, Component, enableProdMode, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxTreeViewModule, DxTreeViewComponent, DxSortableModule } from 'devextreme-angular';
import { Service, FileSystemItem } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service]
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

    onDragChange(e) {
        if(e.fromComponent === e.toComponent) {
            const fromNode = this.findNode(this.getTreeView(e.fromData), e.fromIndex);
            const toNode = this.findNode(this.getTreeView(e.toData), this.calculateToIndex(e));
            if (toNode !== null && this.isChildNode(fromNode, toNode)) {
                e.cancel = true;
            }
        }        
    }

    onDragEnd(e) {
        if(e.fromComponent === e.toComponent && e.fromIndex === e.toIndex) {
            return;
        }

        const fromTreeView = this.getTreeView(e.fromData);
        const toTreeView = this.getTreeView(e.toData);

        const fromNode = this.findNode(fromTreeView, e.fromIndex);
        const toNode = this.findNode(toTreeView, this.calculateToIndex(e));

        if(e.dropInsideItem && toNode !== null && !toNode.itemData.isDirectory) {
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

    getTreeView(driveName) {
        return driveName === 'driveC'
            ? this.treeviewDriveC.instance
            : this.treeviewDriveD.instance;
    }

    calculateToIndex(e) {
        if(e.fromComponent != e.toComponent || e.dropInsideItem) {
            return e.toIndex;
        }
    
        return e.fromIndex >= e.toIndex
            ? e.toIndex
            : e.toIndex + 1;
    }

    findNode(treeView, index) {
        const nodeElement = treeView.element().querySelectorAll('.dx-treeview-node')[index];
        if(nodeElement) {
            return this.findNodeById(treeView.getNodes(), nodeElement.getAttribute('data-item-id'));
        }
        return null;
    }

    findNodeById(nodes, id) {
        for(var i = 0; i < nodes.length; i++) {
            if(nodes[i].itemData.id == id) {
                return nodes[i];
            }
            if(nodes[i].children) {
                const node = this.findNodeById(nodes[i].children, id);
                if(node != null) {
                    return node;
                }
            }
        }
        return null;
    }

    moveNode(fromNode, toNode, fromItems, toItems, isDropInsideItem) {
        const fromIndex = fromItems.findIndex(item => item.id == fromNode.itemData.id);
        fromItems.splice(fromIndex, 1);
    
        const toIndex = toNode === null || isDropInsideItem
            ? toItems.length
            : toItems.findIndex(item => item.id == toNode.itemData.id);
        toItems.splice(toIndex, 0, fromNode.itemData);

        this.moveChildren(fromNode, fromItems, toItems);    
        if(isDropInsideItem) {
            fromNode.itemData.parentId = toNode.itemData.id;
        } else {
            fromNode.itemData.parentId = toNode != null
                ? toNode.itemData.parentId
                : undefined;
        }
    }
    
    moveChildren(node, fromDataSource, toDataSource) {
        if(!node.itemData.isDirectory) {
            return;
        }
    
        node.children.forEach(child => {
            if(child.itemData.isDirectory) {
                this.moveChildren(child, fromDataSource, toDataSource);    
            }
    
            const fromIndex = fromDataSource.findIndex(item => item.id == child.itemData.id);
            fromDataSource.splice(fromIndex, 1);
            toDataSource.splice(toDataSource.length, 0, child.itemData);
        });
    }

    isChildNode(parentNode, childNode) {
        let parent = childNode.parent;
        while(parent !== null) {
            if(parent.itemData.id === parentNode.itemData.id) {
                return true;
            }
            parent = parent.parent;
        }
        return false;
    }

    getTopVisibleNode(component) {
        const treeViewElement = component.element();
        const treeViewTopPosition = treeViewElement.getBoundingClientRect().top;
        const nodes = treeViewElement.querySelectorAll(".dx-treeview-node");
        for(let i = 0; i < nodes.length; i++) {
            const nodeTopPosition = nodes[i].getBoundingClientRect().top;
            if(nodeTopPosition >= treeViewTopPosition) {
                return nodes[i];
            }
        }

        return null;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxTreeViewModule,
        DxSortableModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);