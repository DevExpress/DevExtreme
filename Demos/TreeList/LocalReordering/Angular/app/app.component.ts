import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxTreeListModule, DxCheckBoxModule } from 'devextreme-angular';

import { Service, Employee } from './app.service';

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
  employees: Array<Employee>;

  allowDropInsideItem = true;

  allowReordering = true;

  showDragIcons = true;

  expandedRowKeys: Array<number> = [1];

  constructor(service: Service) {
    this.employees = service.getEmployees();
    this.onReorder = this.onReorder.bind(this);
  }

  onDragChange(e) {
    const visibleRows = e.component.getVisibleRows();
    const sourceNode = e.component.getNodeByKey(e.itemData.ID);
    let targetNode = visibleRows[e.toIndex].node;

    while (targetNode && targetNode.data) {
      if (targetNode.data.ID === sourceNode.data.ID) {
        e.cancel = true;
        break;
      }
      targetNode = targetNode.parent;
    }
  }

  onReorder(e) {
    const visibleRows = e.component.getVisibleRows();

    if (e.dropInsideItem) {
      e.itemData.Head_ID = visibleRows[e.toIndex].key;

      e.component.refresh();
    } else {
      const sourceData = e.itemData;
      const toIndex = e.fromIndex > e.toIndex ? e.toIndex - 1 : e.toIndex;
      let targetData = toIndex >= 0 ? visibleRows[toIndex].node.data : null;

      if (targetData && e.component.isRowExpanded(targetData.ID)) {
        sourceData.Head_ID = targetData.ID;
        targetData = null;
      } else {
        sourceData.Head_ID = targetData ? targetData.Head_ID : -1;
      }

      const sourceIndex = this.employees.indexOf(sourceData);
      this.employees.splice(sourceIndex, 1);

      const targetIndex = this.employees.indexOf(targetData) + 1;
      this.employees.splice(targetIndex, 0, sourceData);
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTreeListModule,
    DxCheckBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
