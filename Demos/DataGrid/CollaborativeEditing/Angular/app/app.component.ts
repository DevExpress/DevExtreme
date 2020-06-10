import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule, DxTextBoxModule } from 'devextreme-angular';
import { CollaborativeEditingService } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    preserveWhitespaces: true,
    providers: [CollaborativeEditingService]
})
export class AppComponent {
    dataSources: Array<Object>;
    stateDataSource: Object;
    maxDate: Date = new Date(3000, 0);

    constructor(private service: CollaborativeEditingService) {
        this.dataSources = [this.service.createStore(), this.service.createStore()];
        this.stateDataSource = this.service.createStatesStore();

        this.service.getStoreChangedObservable().subscribe(events => {
            this.dataSources.forEach(store => store.push(events));
        });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDataGridModule,
        DxTextBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
