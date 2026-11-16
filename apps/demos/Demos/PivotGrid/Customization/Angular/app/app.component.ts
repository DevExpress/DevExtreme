import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxPivotGridModule, DxCheckBoxModule } from 'devextreme-angular';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
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
    DxPivotGridModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  readonly pivotGridDataSource = new PivotGridDataSource({
    fields: [{
      caption: 'Region',
      dataField: 'region',
      expanded: true,
      area: 'row',
    }, {
      caption: 'Country',
      dataField: 'country',
      expanded: true,
      area: 'row',
    }, {
      caption: 'City',
      dataField: 'city',
      area: 'row',
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
    }, {
      caption: 'Percent',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      summaryDisplayMode: 'percentOfRowGrandTotal',
      area: 'data',
    }],
    store: inject(Service).getSales(),
  });

  readonly showTotalsPrior = signal(false);

  readonly rowsDataFieldArea = signal(false);

  readonly treeHeaderLayout = signal(true);
}

bootstrapApplication(AppComponent);
