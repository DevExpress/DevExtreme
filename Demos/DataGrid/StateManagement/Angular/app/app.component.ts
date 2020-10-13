import { NgModule, Component, OnInit, OnDestroy, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClientModule } from '@angular/common/http';

import { DxDataGridModule, DxLoadPanelModule } from 'devextreme-angular';
import { Service, Order, Change } from './app.service';
import { Observable, Subscription } from 'rxjs';

if (!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service],
    preserveWhitespaces: true
})
export class AppComponent implements OnInit, OnDestroy {
    ordersSubscription: Subscription;
    orders$: Observable<Order[]>;
    changes: Change<Order>[] = [];
    editRowKey?: number = null;
    changesText = '';
    isLoading = false;
    loadPanelPosition = { of: '#gridContainer' };

    constructor(private service: Service) { }

    ngOnInit() {
        this.orders$ = this.service.getOrders();

        this.isLoading = true;
        this.ordersSubscription = this.orders$.subscribe(() => {
            this.isLoading = false;
        });
    }

    onChangesChange(changes: Change<Order>[]) {
        this.changesText = JSON.stringify(changes.map((change) => ({
            type: change.type,
            key: change.type !== 'insert' ? change.key : undefined,
            data: change.data
        })), null, ' ');
    }

    onSaving(e: any) {
        const change = e.changes[0];

        if(change) {
            e.cancel = true;
            e.promise = this.processSaving(change);
        }
    }

    async processSaving(change: Change<Order>) {
        this.isLoading = true;

        try {
            await this.service.saveChange(change);
            this.editRowKey = null;
            this.changes = [];
        } finally {
            this.isLoading = false;
        }
    }

    ngOnDestroy() {
        this.ordersSubscription.unsubscribe();
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDataGridModule,
        DxLoadPanelModule,
        HttpClientModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);