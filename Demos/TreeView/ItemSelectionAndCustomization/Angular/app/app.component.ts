import { NgModule, Component, Pipe, PipeTransform, enableProdMode, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxTreeViewModule, dxTreeViewNode, DxListModule, DxTemplateModule, DxCheckBoxModule, DxSelectBoxModule, DxTreeViewComponent } from 'devextreme-angular';

import { Service, Employee } from './app.service';

@Pipe({ name: 'title' })
export class TitlePipe implements PipeTransform {
    transform(item: any): string {
        return item.text + (item.price ? ' ($' + item.price + ')' : '');
    }
}

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
    @ViewChild(DxTreeViewComponent, { static: false }) treeView: DxTreeViewComponent;

    employees: Employee[];
    selectedEmployees: dxTreeViewNode[] = [];

    showCheckBoxesModes: string[] = ["normal", "selectAll", "none"];
    showCheckBoxesMode: string = this.showCheckBoxesModes[0];
    selectionModes: string[] = ["multiple", "single"];    
    selectionMode: string = this.selectionModes[0];    

    selectNodesRecursive: boolean = true;
    selectByClick: boolean = false;

    isRecursiveDisabled: boolean = false;
    isSelectionModeDisabled: boolean = false;

    constructor(service: Service) {
        this.employees = service.getEmployees();
    }

    treeViewSelectionChanged(e) {
        this.syncSelection(e.component);
    }

    treeViewContentReady(e) {
        this.syncSelection(e.component);
    }

    syncSelection(treeView) {
        const selectedEmployees = treeView.getSelectedNodes()
            .map((node: dxTreeViewNode) => { return { 
                fullName: node.itemData.fullName,
                prefix: node.itemData.prefix,
                position: node.itemData.position
            } });
        
        this.selectedEmployees = selectedEmployees;
    }

    showCheckBoxesModeValueChanged(e) {
        this.showCheckBoxesMode = e.value;
        this.isSelectionModeDisabled = e.value === 'selectAll';     
        if(e.value === 'selectAll') {
            this.selectionMode = "multiple";
            this.isRecursiveDisabled = false;            
        }   
    }

    selectionModeValueChanged(e) {
        this.selectionMode = e.value;
        this.isRecursiveDisabled = e.value === 'single';        
        if(e.value === 'single') {
            this.selectNodesRecursive = false;
            this.treeView.instance.unselectAll();
        }
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxTreeViewModule,
        DxListModule,
        DxTemplateModule,
        DxCheckBoxModule,
        DxSelectBoxModule
    ],
    declarations: [AppComponent, TitlePipe],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);