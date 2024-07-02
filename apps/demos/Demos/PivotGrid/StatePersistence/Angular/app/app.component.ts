import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { DxButtonModule } from 'devextreme-angular';
import { DxPivotGridModule, DxPivotGridTypes } from 'devextreme-angular/ui/pivot-grid';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
})
export class AppComponent {
  pivotGridDataSource: PivotGridDataSource;

  summaryDisplayModes = [
    { text: 'None', value: 'none' },
    { text: 'Absolute Variation', value: 'absoluteVariation' },
    { text: 'Percent Variation', value: 'percentVariation' },
    { text: 'Percent of Column Total', value: 'percentOfColumnTotal' },
    { text: 'Percent of Row Total', value: 'percentOfRowTotal' },
    { text: 'Percent of Column Grand Total', value: 'percentOfColumnGrandTotal' },
    { text: 'Percent of Row Grand Total', value: 'percentOfRowGrandTotal' },
    { text: 'Percent of Grand Total', value: 'percentOfGrandTotal' },
  ];

  constructor(service: Service) {
    this.pivotGridDataSource = new PivotGridDataSource({
      fields: [{
        caption: 'Region',
        width: 120,
        dataField: 'region',
        area: 'row',
        sortBySummaryField: 'sales',
      }, {
        caption: 'City',
        dataField: 'city',
        width: 150,
        area: 'row',
      }, {
        dataField: 'date',
        dataType: 'date',
        area: 'column',
      }, {
        groupName: 'date',
        groupInterval: 'year',
      }, {
        groupName: 'date',
        groupInterval: 'quarter',
      }, {
        dataField: 'sales',
        dataType: 'number',
        summaryType: 'sum',
        format: 'currency',
        area: 'data',
      }],
      store: service.getSales(),
    });
  }

  prepareContextMenu(e: DxPivotGridTypes.ContextMenuPreparingEvent) {
    const dataSource = this.pivotGridDataSource;

    if (e.field !== dataSource.field(4)) { return; }

    for (const summaryDisplayMode of this.summaryDisplayModes) {
      var summaryDisplayModeValue = summaryDisplayMode.value;

      e.items.push({
        text: summaryDisplayMode.text,
        selected: e.field.summaryDisplayMode === summaryDisplayModeValue,
        onItemClick() {
          let format;
          const caption = summaryDisplayModeValue === 'none' ? 'Total Sales' : 'Relative Sales';
          if (summaryDisplayModeValue === 'none' || summaryDisplayModeValue === 'absoluteVariation') {
            format = 'currency';
          }
          dataSource.field(4, {
            summaryDisplayMode: summaryDisplayModeValue,
            format,
            caption,
          });

          dataSource.load();
        },
      });
    }
  }

  onResetButtonClick() {
    this.pivotGridDataSource.state({});
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxPivotGridModule,
    DxButtonModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
