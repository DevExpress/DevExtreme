import {
  type AfterViewInit, Component, Pipe, type PipeTransform, enableProdMode, inject, signal, viewChild,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DxListModule, DxCheckBoxModule } from 'devextreme-angular';
import { DxTreeViewModule, DxTreeViewComponent, type DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import { DxSelectBoxModule, type DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { Service, type Employee } from './app.service';

@Pipe({ name: 'title', standalone: true })
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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxTreeViewModule,
    DxListModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    TitlePipe,
  ],
})
export class AppComponent implements AfterViewInit {
  private readonly treeView = viewChild.required<DxTreeViewComponent<Employee>>(DxTreeViewComponent);

  readonly employees: Employee[] = inject(Service).getEmployees();

  readonly selectedEmployees = signal<Employee[]>([]);

  readonly checkboxVisibilityOptions: DxTreeViewTypes.TreeViewCheckBoxMode[] = ['normal', 'selectAll', 'none'];

  readonly checkboxVisibility = signal(this.checkboxVisibilityOptions[0]);

  readonly selectionModes: DxTreeViewTypes.SingleOrMultiple[] = ['multiple', 'single'];

  readonly selectionMode = signal(this.selectionModes[0]);

  readonly disabledNodeSelectionModes: DxTreeViewTypes.DisabledNodeSelectionMode[] = ['never', 'recursiveAndAll'];

  readonly disabledNodeSelectionMode = signal(this.disabledNodeSelectionModes[0]);

  readonly recursiveSelection = signal(true);

  readonly selectOnClick = signal(false);

  readonly isRecursiveDisabled = signal(false);

  readonly isSelectionModeDisabled = signal(false);

  ngAfterViewInit() {
    this.syncSelection(this.treeView().instance);
  }

  treeViewSelectionChanged(e: DxTreeViewTypes.SelectionChangedEvent<Employee>) {
    this.syncSelection(e.component);
  }

  treeViewContentReady(e: DxTreeViewTypes.ContentReadyEvent<Employee>) {
    this.syncSelection(e.component);
  }

  private syncSelection(treeView: DxTreeViewComponent<Employee>['instance']) {
    const selectedEmployees = treeView.getSelectedNodes()
      .map((node) => node.itemData);

    this.selectedEmployees.set(selectedEmployees);
  }

  checkboxVisibilityValueChanged(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.checkboxVisibility.set(e.value);
    this.isSelectionModeDisabled.set(e.value === 'selectAll');
    if (e.value === 'selectAll') {
      this.selectionMode.set('multiple');
      this.isRecursiveDisabled.set(false);
    }
  }

  selectionModeValueChanged(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.selectionMode.set(e.value);
    this.isRecursiveDisabled.set(e.value === 'single');
    if (e.value === 'single') {
      this.recursiveSelection.set(false);
      this.treeView().instance.unselectAll();
    }
  }

  disabledNodeSelectionModeValueChanged(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.disabledNodeSelectionMode.set(e.value);
  }
}

bootstrapApplication(AppComponent);
