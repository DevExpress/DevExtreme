import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, OnInit, OnDestroy, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AsyncPipe } from "@angular/common";
import { DxLoadPanelModule } from 'devextreme-angular';
import { Observable, Subscription } from 'rxjs';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service, Order, Change } from './app.service';

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
    AsyncPipe,
    DxDataGridModule,
    DxLoadPanelModule,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  ordersSubscription: Subscription;

  orders$: Observable<Order[]>;

  changes: Change<Order>[] = [];

  editRowKey?: number = null;

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

  get changesText(): string {
    return JSON.stringify(this.changes.map((change) => ({
      type: change.type,
      key: change.type !== 'insert' ? change.key : undefined,
      data: change.data,
    })), null, ' ');
  }

  onSaving(e: DxDataGridTypes.SavingEvent) {
    const change = e.changes[0];

    if (change) {
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

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideHttpClient(withFetch()),
  ],
});
