import {
  NgModule, Component, Pipe, PipeTransform, enableProdMode, ViewChild,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxListModule, DxTemplateModule, DxCheckBoxModule } from 'devextreme-angular';
import { DxTreeViewModule, DxTreeViewComponent, DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import { DxSelectBoxModule, DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { Service, Employee } from './app.service';

@Pipe({ name: 'title' })
export class TitlePipe implements PipeTransform {
  transform(item: Record<string, unknown>): string {
    return item.text + (item.price ? ` ($${item.price})` : '');
  }
}

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
})
export class AppComponent {
  @ViewChild(DxTreeViewComponent, { static: false }) treeView: DxTreeViewComponent;

  employees: Employee[];

  selectedEmployees: Employee[] = [];

  showCheckBoxesModes: DxTreeViewTypes.TreeViewCheckBoxMode[] = ['normal', 'selectAll', 'none'];

  showCheckBoxesMode = this.showCheckBoxesModes[0];

  selectionModes: DxTreeViewTypes.SingleOrMultiple[] = ['multiple', 'single'];

  selectionMode = this.selectionModes[0];

  selectNodesRecursive = true;

  selectByClick = false;

  isRecursiveDisabled = false;

  isSelectionModeDisabled = false;

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }

  treeViewSelectionChanged(e: DxTreeViewTypes.SelectionChangedEvent) {
    this.syncSelection(e.component);
  }

  treeViewContentReady(e: DxTreeViewTypes.ContentReadyEvent) {
    this.syncSelection(e.component);
  }

  syncSelection(treeView: DxTreeViewComponent['instance']) {
    const selectedEmployees = treeView.getSelectedNodes()
      .map((node) => node.itemData);

    this.selectedEmployees = selectedEmployees as Employee[];
  }

  showCheckBoxesModeValueChanged(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.showCheckBoxesMode = e.value;
    this.isSelectionModeDisabled = e.value === 'selectAll';
    if (e.value === 'selectAll') {
      this.selectionMode = 'multiple';
      this.isRecursiveDisabled = false;
    }
  }

  selectionModeValueChanged(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.selectionMode = e.value;
    this.isRecursiveDisabled = e.value === 'single';
    if (e.value === 'single') {
      this.selectNodesRecursive = false;
      this.treeView.instance.unselectAll();
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTreeViewModule,
    DxListModule,
    DxTemplateModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent, TitlePipe],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
