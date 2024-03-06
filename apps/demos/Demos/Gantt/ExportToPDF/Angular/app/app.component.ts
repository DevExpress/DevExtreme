import {
  NgModule, Component, enableProdMode, ViewChild, ChangeDetectorRef,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxGanttComponent,
  DxGanttModule,
  DxCheckBoxModule,
  DxNumberBoxModule,
  DxDateBoxModule,
} from 'devextreme-angular';
import { exportGantt as exportGanttToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { DxSelectBoxModule, DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import {
  Service, Task, Dependency, Resource, ResourceAssignment,
} from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

type ExportMode = Parameters<typeof exportGanttToPdf>[0]['exportMode'];
type DateRange = Parameters<typeof exportGanttToPdf>[0]['dateRange'];

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
})
export class AppComponent {
  @ViewChild(DxGanttComponent, { static: false }) gantt: DxGanttComponent;

  startDate: Date;

  endDate: Date;

  tasks: Task[];

  dependencies: Dependency[];

  resources: Resource[];

  resourceAssignments: ResourceAssignment[];

  startTaskIndex = 0;

  endTaskIndex = 3;

  customRangeDisabled = true;

  formats = ['A0', 'A1', 'A2', 'A3', 'A4', 'Auto'];

  exportModes = ['All', 'Chart', 'Tree List'];

  dateRanges = ['all', 'visible', 'custom'];

  formatBoxValue = this.formats[0];

  landscapeCheckBoxValue = true;

  exportModeBoxValue = this.exportModes[0];

  dateRangeBoxValue = this.dateRanges[1];

  exportButtonOptions: DxButtonTypes.Properties = {
    hint: 'Export to PDF',
    icon: 'exportpdf',
    stylingMode: 'text',
    onClick: () => this.exportButtonClick(),
  };

  constructor(service: Service, private ref: ChangeDetectorRef) {
    this.tasks = service.getTasks();
    this.dependencies = service.getDependencies();
    this.resources = service.getResources();
    this.resourceAssignments = service.getResourceAssignments();
    this.startDate = this.tasks[0].start;
    this.endDate = this.tasks[0].end;
  }

  exportButtonClick() {
    const gantt = this.gantt.instance;
    const format = this.formatBoxValue.toLowerCase();
    const isLandscape = this.landscapeCheckBoxValue;
    const exportMode = this.getExportMode();
    const dataRangeMode = this.dateRangeBoxValue;
    let dateRange: DateRange;

    if (dataRangeMode === 'custom') {
      dateRange = {
        startIndex: this.startTaskIndex,
        endIndex: this.endTaskIndex,
        startDate: this.startDate,
        endDate: this.endDate,
      };
    } else {
      dateRange = dataRangeMode as Exclude<DateRange, 'custom'>;
    }

    exportGanttToPdf(
      {
        component: gantt,
        createDocumentMethod: (args?: unknown) => new jsPDF(args),
        format,
        landscape: isLandscape,
        exportMode,
        dateRange,
      },
    ).then((doc) => doc.save('gantt.pdf'));
  }

  capitalize = ([firstLetter, ...restLetters]: string) => firstLetter.toUpperCase() + restLetters;

  getExportMode: () => ExportMode = () => {
    const modes: Record<string, ExportMode> = {
      'Tree List': 'treeList',
      Chart: 'chart',
    };
    return modes[this.exportModeBoxValue] || 'all';
  };

  onDateRangeBoxSelectionChanged(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.customRangeDisabled = e.value !== 'custom';
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
