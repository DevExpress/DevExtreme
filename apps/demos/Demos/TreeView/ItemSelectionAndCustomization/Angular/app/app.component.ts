import {
  Component, Pipe, PipeTransform, enableProdMode, ViewChild, provideZoneChangeDetection,
} from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { DxListModule, DxCheckBoxModule } from 'devextreme-angular';
import { DxTreeViewModule, DxTreeViewComponent, DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import { DxSelectBoxModule, DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { Service, Employee } from './app.service';

@Pipe({ name: 'title', standalone: true })
export class TitlePipe implements PipeTransform {
  transform(item: Record<string, unknown>): string {
    return item.text + (item.price ? ` ($${item.price})` : '');
  }
}

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    BrowserModule,
    DxTreeViewModule,
    DxListModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    TitlePipe,
  ],
})
export class AppComponent {
  @ViewChild(DxTreeViewComponent, { static: false }) treeView: DxTreeViewComponent<Employee>;

  employees: Employee[];

  selectedEmployees: Employee[] = [];

  checkboxVisibilityOptions: DxTreeViewTypes.TreeViewCheckBoxMode[] = ['normal', 'selectAll', 'none'];

  checkboxVisibility = this.checkboxVisibilityOptions[0];

  selectionModes: DxTreeViewTypes.SingleOrMultiple[] = ['multiple', 'single'];

  selectionMode = this.selectionModes[0];

  disabledNodeSelectionModes: DxTreeViewTypes.DisabledNodeSelectionMode[] = ['never', 'recursiveAndAll'];

  disabledNodeSelectionMode = this.disabledNodeSelectionModes[0];

  recursiveSelection = true;

  selectOnClick = false;

  isRecursiveDisabled = false;

  isSelectionModeDisabled = false;

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }

  treeViewSelectionChanged(e: DxTreeViewTypes.SelectionChangedEvent<Employee>) {
    this.syncSelection(e.component);
  }

  treeViewContentReady(e: DxTreeViewTypes.ContentReadyEvent<Employee>) {
    this.syncSelection(e.component);
  }

  syncSelection(treeView: DxTreeViewComponent<Employee>['instance']) {
    const selectedEmployees = treeView.getSelectedNodes()
      .map((node) => node.itemData);

    this.selectedEmployees = selectedEmployees;
  }

  checkboxVisibilityValueChanged(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.checkboxVisibility = e.value;
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
      this.recursiveSelection = false;
      this.treeView.instance.unselectAll();
    }
  }

  disabledNodeSelectionModeValueChanged(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.disabledNodeSelectionMode = e.value;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
