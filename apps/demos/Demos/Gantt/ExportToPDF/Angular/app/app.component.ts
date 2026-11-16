import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, computed, enableProdMode, inject, signal, viewChild,
} from '@angular/core';
import {
  DxGanttComponent,
  DxGanttModule,
  DxCheckBoxModule,
  DxNumberBoxModule,
  DxDateBoxModule,
} from 'devextreme-angular';
import { exportGantt as exportGanttToPdf } from 'devextreme-angular/common/export/pdf';
import { jsPDF } from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import type { DxButtonTypes } from 'devextreme-angular/ui/button';
import { Service } from './app.service';

applyPlugin(jsPDF);

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

type ExportMode = Parameters<typeof exportGanttToPdf>[0]['exportMode'];
type DateRange = Parameters<typeof exportGanttToPdf>[0]['dateRange'];

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxGanttModule,
    DxCheckBoxModule,
    DxNumberBoxModule,
    DxDateBoxModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  private readonly gantt = viewChild.required(DxGanttComponent);

  private readonly service = inject(Service);

  readonly tasks = this.service.getTasks();

  readonly dependencies = this.service.getDependencies();

  readonly resources = this.service.getResources();

  readonly resourceAssignments = this.service.getResourceAssignments();

  readonly startDate = signal(this.tasks[0].start);

  readonly endDate = signal(this.tasks[0].end);

  readonly startTaskIndex = signal(0);

  readonly endTaskIndex = signal(3);

  readonly formats = ['A0', 'A1', 'A2', 'A3', 'A4', 'Auto'];

  readonly exportModes = ['All', 'Chart', 'Tree List'];

  readonly dateRanges = ['all', 'visible', 'custom'];

  readonly formatBoxValue = signal(this.formats[0]);

  readonly landscapeCheckBoxValue = signal(true);

  readonly exportModeBoxValue = signal(this.exportModes[0]);

  readonly dateRangeBoxValue = signal(this.dateRanges[1]);

  readonly customRangeDisabled = computed(() => this.dateRangeBoxValue() !== 'custom');

  readonly exportButtonOptions: DxButtonTypes.Properties = {
    hint: 'Export to PDF',
    icon: 'exportpdf',
    stylingMode: 'text',
    onClick: () => this.exportButtonClick(),
  };

  private exportButtonClick() {
    const gantt = this.gantt().instance;
    const format = this.formatBoxValue().toLowerCase();
    const isLandscape = this.landscapeCheckBoxValue();
    const exportMode = this.getExportMode();
    const dataRangeMode = this.dateRangeBoxValue();
    let dateRange: DateRange;

    if (dataRangeMode === 'custom') {
      dateRange = {
        startIndex: this.startTaskIndex(),
        endIndex: this.endTaskIndex(),
        startDate: this.startDate(),
        endDate: this.endDate(),
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

  readonly capitalize = ([firstLetter, ...restLetters]: string) => firstLetter.toUpperCase() + restLetters;

  private readonly getExportMode: () => ExportMode = () => {
    const modes: Record<string, ExportMode> = {
      'Tree List': 'treeList',
      Chart: 'chart',
    };
    return modes[this.exportModeBoxValue()] || 'all';
  };
}

bootstrapApplication(AppComponent);
