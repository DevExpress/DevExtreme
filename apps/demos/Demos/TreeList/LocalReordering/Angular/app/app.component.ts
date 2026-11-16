import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxCheckBoxModule } from 'devextreme-angular';
import { DxTreeListModule, type DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxTreeListModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  readonly employees = signal(inject(Service).getEmployees());

  readonly allowDropInsideItem = signal(true);

  readonly allowReordering = signal(true);

  readonly showDragIcons = signal(true);

  readonly expandedRowKeys = [1];

  onDragChange(e: DxTreeListTypes.RowDraggingChangeEvent) {
    const visibleRows = e.component.getVisibleRows();
    const sourceNode = e.component.getNodeByKey(e.itemData.ID);
    let targetNode = visibleRows[e.toIndex].node;

    while (targetNode?.data) {
      if (targetNode.data.ID === sourceNode.data.ID) {
        e.cancel = true;
        break;
      }
      targetNode = targetNode.parent;
    }
  }

  readonly onReorder = (e: DxTreeListTypes.RowDraggingReorderEvent) => {
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

      this.employees.update((employees) => {
        const result = employees.filter((employee) => employee !== sourceData);
        const targetIndex = result.indexOf(targetData) + 1;

        result.splice(targetIndex, 0, sourceData);

        return result;
      });
    }
  };
}

bootstrapApplication(AppComponent);
