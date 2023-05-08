import {
  NgModule, Component, enableProdMode, ViewChild, QueryList, ViewChildren, ChangeDetectorRef,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {
  DxGanttComponent, DxGanttModule, DxSelectBoxModule, DxCheckBoxModule, DxNumberBoxModule, DxDateBoxModule,
} from 'devextreme-angular';
import { exportGantt as exportGanttToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import {
  Service, Task, Dependency, Resource, ResourceAssignment,
} from './app.service';

import 'jspdf-autotable';

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
  @ViewChild(DxGanttComponent, { static: false }) gantt: DxGanttComponent;

  formats: string[] = ['A0', 'A1', 'A2', 'A3', 'A4', 'Auto'];

  exportModes: string[] = ['All', 'Chart', 'Tree List'];

  dateRanges: string[] = ['All', 'Visible', 'Custom'];

  formatBoxValue: string;

  exportModeBoxValue: string;

  dateRangeBoxValue: string;

  landscapeCheckBoxValue: boolean;

  startTaskIndex: number;

  endTaskIndex: number;

  startDate: Date;

  endDate: Date;

  customRangeDisabled: boolean;

  tasks: Task[];

  dependencies: Dependency[];

  resources: Resource[];

  resourceAssignments: ResourceAssignment[];

  exportButtonOptions: any;

  constructor(service: Service, private ref: ChangeDetectorRef) {
    this.tasks = service.getTasks();
    this.dependencies = service.getDependencies();
    this.resources = service.getResources();
    this.resourceAssignments = service.getResourceAssignments();

    this.exportButtonOptions = {
      hint: 'Export to PDF',
      icon: 'exportpdf',
      stylingMode: 'text',
      onClick: () => this.exportButtonClick(),
    };

    this.formatBoxValue = this.formats[0];
    this.landscapeCheckBoxValue = true;
    this.exportModeBoxValue = this.exportModes[0];
    this.dateRangeBoxValue = this.dateRanges[1];
    this.startTaskIndex = 0;
    this.endTaskIndex = 3;
    this.startDate = this.tasks[0].start;
    this.endDate = this.tasks[0].end;
    this.customRangeDisabled = true;
  }

  exportButtonClick() {
    const gantt = this.gantt.instance;
    const format = this.formatBoxValue.toLowerCase();
    const isLandscape = this.landscapeCheckBoxValue;
    const exportMode = this.getExportMode();
    const dataRangeMode = this.dateRangeBoxValue.toLowerCase();
    let dataRange;
    if (dataRangeMode === 'custom') {
      dataRange = {
        startIndex: this.startTaskIndex,
        endIndex: this.endTaskIndex,
        startDate: this.startDate,
        endDate: this.endDate,
      };
    } else {
      dataRange = dataRangeMode;
    }
    exportGanttToPdf(
      {
        component: gantt,
        createDocumentMethod: (args?: any) => new jsPDF(args),
        format,
        landscape: isLandscape,
        exportMode,
        dateRange: dataRange,
      },
    ).then((doc) => doc.save('gantt.pdf'));
  }

  getExportMode() {
    if (this.exportModeBoxValue === 'Tree List') { return 'treeList'; }
    if (this.exportModeBoxValue === 'All') { return 'all'; }
    if (this.exportModeBoxValue === 'Chart') { return 'chart'; }
    return 'all';
  }

  onDateRangeBoxSelectionChanged(e) {
    this.customRangeDisabled = e.value !== 'Custom';
    this.ref.detectChanges();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxGanttModule,
    DxCheckBoxModule,
    DxNumberBoxModule,
    DxDateBoxModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
