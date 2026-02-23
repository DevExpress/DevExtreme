import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import {
  DxPivotGridFieldChooserModule,
  DxRadioGroupModule,
  DxButtonModule,
  DxSelectBoxModule,
} from 'devextreme-angular';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { DxPivotGridModule, DxPivotGridTypes } from 'devextreme-angular/ui/pivot-grid';
import { Service, Layout, Sale } from './app.service';

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
    DxPivotGridModule,
    DxRadioGroupModule,
    DxPivotGridFieldChooserModule,
    DxSelectBoxModule,
    DxButtonModule,
  ],
})
export class AppComponent {
  pivotGridDataSource: PivotGridDataSource;

  layouts: Layout[];

  layout = 0;

  applyChangesModes: DxPivotGridTypes.ApplyChangesMode[] = ['instantly', 'onDemand'];

  applyChangesMode = this.applyChangesModes[0];

  state: Record<string, unknown>;

  constructor(service: Service) {
    this.pivotGridDataSource = new PivotGridDataSource({
      fields: [{
        caption: 'Region',
        width: 120,
        dataField: 'region',
        area: 'row',
        headerFilter: {
          search: {
            enabled: true,
          },
        },
      }, {
        caption: 'City',
        dataField: 'city',
        width: 150,
        area: 'row',
        headerFilter: {
          search: {
            enabled: true,
          },
        },
        selector(data: Sale) {
          return `${data.city} (${data.country})`;
        },
      }, {
        dataField: 'date',
        dataType: 'date',
        area: 'column',
      }, {
        caption: 'Sales',
        dataField: 'amount',
        dataType: 'number',
        summaryType: 'sum',
        format: 'currency',
        area: 'data',
      }],
      store: service.getSales(),
    });

    this.state = this.pivotGridDataSource.state();

    this.layouts = service.getLayouts();
  }

  applyClick() {
    this.pivotGridDataSource.state(this.state);
  }

  cancelClick() {
    this.state = this.pivotGridDataSource.state();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
