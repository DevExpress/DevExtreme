import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    dataSource: any;
    connectionStarted: boolean;

    constructor() {
        this.connectionStarted = false;

        var hubConnection = new HubConnectionBuilder()
            .withUrl("https://js.devexpress.com/Demos/NetCore/liveUpdateSignalRHub")
            .build();

        var store = new CustomStore({
            load: () => hubConnection.invoke("getAllStocks"),
            key: "symbol"
        });

        hubConnection
            .start()
            .then(() => {
                hubConnection.on("updateStockPrice", (data: any) => {
                    store.push([{ type: "update", key: data.symbol, data: data }]);
                });
                this.dataSource = store;
                this.connectionStarted = true;
            });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDataGridModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
