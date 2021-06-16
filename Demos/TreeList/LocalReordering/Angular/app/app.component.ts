import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxTreeListModule, DxCheckBoxModule } from 'devextreme-angular';

import { Service, Employee } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service],
    preserveWhitespaces: true
})
export class AppComponent {
    employees: Array<Employee>;
    allowDropInsideItem: boolean = true;
    allowReordering: boolean = true;
    showDragIcons: boolean = true;
    expandedRowKeys: Array<number> = [1];

    constructor(service: Service) {
        this.employees = service.getEmployees();
        this.onReorder = this.onReorder.bind(this);
    }

    onDragChange(e) {
        let visibleRows = e.component.getVisibleRows(),
            sourceNode = e.component.getNodeByKey(e.itemData.ID),
            targetNode = visibleRows[e.toIndex].node;

        while(targetNode && targetNode.data) {
            if (targetNode.data.ID === sourceNode.data.ID) {
                e.cancel = true;
                break;
            }
            targetNode = targetNode.parent;
        }
    }

    onReorder(e) {
        let visibleRows =  e.component.getVisibleRows(),
            sourceData = e.itemData,
            targetData = visibleRows[e.toIndex].node.data;

        if (e.dropInsideItem) {
            e.itemData.Head_ID = targetData.ID;
            e.component.refresh();
        } else {
            let sourceIndex = this.employees.indexOf(sourceData),
                targetIndex = this.employees.indexOf(targetData);

            if (sourceData.Head_ID !== targetData.Head_ID) {
                sourceData.Head_ID = targetData.Head_ID;
                if (e.toIndex > e.fromIndex) {
                    targetIndex++;
                }
            }

            this.employees.splice(sourceIndex, 1);
            this.employees.splice(targetIndex, 0, sourceData);
        }
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxTreeListModule,
        DxCheckBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);