import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPivotGridModule } from 'devextreme-angular';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { DxPivotGridTypes } from 'devextreme-angular/ui/pivot-grid';
import { Service, Sale } from './app.service';

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
        expanded: true,
      }, {
        caption: 'Relative Sales',
        dataField: 'amount',
        dataType: 'number',
        summaryType: 'sum',
        area: 'data',
        summaryDisplayMode: 'percentOfColumnGrandTotal',
      }],
      store: service.getSales(),
    });
  }

  prepareContextMenu(e: DxPivotGridTypes.ContextMenuPreparingEvent) {
    type SourceField = (typeof e.field) & { index: number };

    if (e.field && e.field.dataField === 'amount') {
      this.summaryDisplayModes.forEach((mode) => {
        e.items.push({
          text: mode.text,
          selected: e.field.summaryDisplayMode === mode.value,
          onItemClick: () => {
            let format: string;
            const caption = mode.value === 'none' ? 'Total Sales' : 'Relative Sales';

            if (mode.value === 'none'
                            || mode.value === 'absoluteVariation') {
              format = 'currency';
            }
            this.pivotGridDataSource.field((e.field as SourceField).index, {
              summaryDisplayMode: mode.value,
              format,
              caption,
            });

            this.pivotGridDataSource.load();
          },
        });
      });
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxPivotGridModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
