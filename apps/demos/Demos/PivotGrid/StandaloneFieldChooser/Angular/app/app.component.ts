import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import {
  DxRadioGroupComponent,
  DxButtonComponent,
  DxSelectBoxComponent,
} from 'devextreme-angular';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import {
  DxPivotGridComponent,
  DxoPivotGridFieldChooserComponent,
  DxPivotGridTypes,
} from 'devextreme-angular/ui/pivot-grid';
import {
  DxPivotGridFieldChooserComponent,
  DxoPivotGridFieldChooserTextsComponent,
} from 'devextreme-angular/ui/pivot-grid-field-chooser';
import { Service, Sale } from './app.service';

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
    DxPivotGridComponent,
    DxoPivotGridFieldChooserComponent,
    DxRadioGroupComponent,
    DxPivotGridFieldChooserComponent,
    DxoPivotGridFieldChooserTextsComponent,
    DxSelectBoxComponent,
    DxButtonComponent,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly pivotGridDataSource = new PivotGridDataSource({
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
    store: this.service.getSales(),
  });

  readonly layouts = this.service.getLayouts();

  readonly layout = signal(0);

  readonly applyChangesModes: DxPivotGridTypes.ApplyChangesMode[] = ['instantly', 'onDemand'];

  readonly applyChangesMode = signal(this.applyChangesModes[0]);

  readonly state = signal<Record<string, unknown>>(this.pivotGridDataSource.state());

  applyClick() {
    this.pivotGridDataSource.state(this.state());
  }

  cancelClick() {
    this.state.set(this.pivotGridDataSource.state());
  }
}

bootstrapApplication(AppComponent);
