import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { DxChartComponent, DxChartModule } from 'devextreme-angular';
import { VisualRange } from 'devextreme-angular/common/charts';
import DataSource from 'devextreme/data/data_source';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})
export class AppComponent {
  @ViewChild(DxChartComponent, { static: false }) component: DxChartComponent;

  private _visualRange: VisualRange = {
    startValue: new Date(2017, 3, 1),
    length: {
      weeks: 2,
    },
  };

  HALFDAY = 43200000;

  packetsLock = 0;

  chartDataSource = new DataSource({
    store: [],
    sort: 'date',
    paginate: false,
  });

  bounds = {
    startValue: new Date(2017, 0, 1),
    endValue: new Date(2017, 11, 31),
  };

  constructor(private httpClient: HttpClient) {}

  get currentVisualRange(): VisualRange {
    return this._visualRange;
  }

  set currentVisualRange(range: VisualRange) {
    this._visualRange.startValue = range.startValue;
    this._visualRange.endValue = range.endValue;
    this.onVisualRangeChanged();
  }

  onVisualRangeChanged() {
    const items = this.component.instance.getDataSource().items();
    const itemsFirstDate = items?.[0]?.date as number;
    const itemsLastDate = items?.[items.length - 1]?.date as number;
    const startDate = this._visualRange.startValue as number;
    const endDate = this._visualRange.endValue as number;

    if (!items.length
            || itemsFirstDate - startDate >= this.HALFDAY
            || endDate - itemsLastDate >= this.HALFDAY) {
      this.uploadDataByVisualRange();
    }
  }

  uploadDataByVisualRange() {
    const dataSource = this.component.instance.getDataSource();
    const storage = dataSource.items();
    const bounded = !!storage.length;
    const ajaxArgs = {
      startVisible: this.getDateString(this._visualRange.startValue as Date),
      endVisible: this.getDateString(this._visualRange.endValue as Date),
      startBound: this.getDateString(bounded ? storage[0].date : null),
      endBound: this.getDateString(bounded ? storage[storage.length - 1].date : null),
    };

    if (ajaxArgs.startVisible !== ajaxArgs.startBound
            && ajaxArgs.endVisible !== ajaxArgs.endBound && !this.packetsLock) {
      this.packetsLock++;
      this.component.instance.showLoadingIndicator();

      this.getDataFrame(ajaxArgs)
        .then((dataFrame: Record<string, number | Date>[]) => {
          this.packetsLock--;
          dataFrame = dataFrame.map((i) => ({
            date: new Date(i.Date),
            minTemp: i.MinTemp,
            maxTemp: i.MaxTemp,
          }));

          const componentStorage = dataSource.store();

          dataFrame.forEach((item) => componentStorage.insert(item));
          dataSource.reload();

          this.onVisualRangeChanged();
        })
        .catch((error) => {
          this.packetsLock--;
          dataSource.reload();
        });
    }
  }

  getDataFrame(args: Record<string, string>) {
    const params = `startVisible=${args.startVisible}`
        + `&endVisible=${args.endVisible}`
        + `&startBound=${args.startBound}`
        + `&endBound=${args.endBound}`;

    return lastValueFrom(
      this.httpClient.get(`https://js.devexpress.com/Demos/WidgetsGallery/data/temperatureData?${params}`),
    );
  }

  getDateString(dateTime: Date) {
    return dateTime ? dateTime.toLocaleDateString('en-US') : '';
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxChartModule,
    HttpClientModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
