import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';
import { DxChartModule, DxChartComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [DecimalPipe, CurrencyPipe]
})
export class AppComponent {
    @ViewChild(DxChartComponent, { static: false }) component: DxChartComponent;
    dataSource: any;
    connectionStarted: boolean;

    constructor(private decimalPipe: DecimalPipe, private currencyPipe: CurrencyPipe) {
        this.connectionStarted = false;

        var hubConnection = new HubConnectionBuilder()
            .withUrl("https://js.devexpress.com/Demos/NetCore/stockTickDataHub", {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .build();

        var store = new CustomStore({
            load: () => hubConnection.invoke("getAllData"),
            key: "date"
        });

        hubConnection
            .start()
            .then(() => {
                hubConnection.on("updateStockPrice", (data: any) => {
                    store.push([{ type: "insert", key: data.date, data: data }]);
                });
                this.dataSource = store;
                this.connectionStarted = true;
            });
    }

    calculateCandle(e) { 
        const prices = e.data.map(d => d.price);
        if (prices.length) {
            return {
                date: new Date((e.intervalStart.valueOf() + e.intervalEnd.valueOf()) / 2),
                open: prices[0],
                high: Math.max.apply(null, prices),
                low: Math.min.apply(null, prices),
                close: prices[prices.length - 1]
            };
        }
    }
    
    customizePoint = (arg: any) => {
        if(arg.seriesName === "Volume") {
            const point = this.component.instance.getAllSeries()[0].getPointsByArg(arg.argument)[0].data;
            if(point.close >= point.open) {
                return { color: "#1db2f5" };
            } 
        }
    }

    formatPrice = (points: any, field: any) => {
        const pricePoint = points.filter(point => point.seriesName !== "Volume")[0];
        return this.currencyPipe.transform(pricePoint[field], "USD", "symbol", "1.0-0");
    }

    formatVolume = (points: any) => {
        const volPoint = points.filter(point => point.seriesName === "Volume")[0];
        return this.decimalPipe.transform(volPoint.value, "3.0-0");
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxChartModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
