import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, OnInit, computed, enableProdMode, inject, signal,
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { DxLoadPanelModule } from 'devextreme-angular';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service, Order, Change } from './app.service';

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
    DxDataGridModule,
    DxLoadPanelModule,
  ],
})
export class AppComponent implements OnInit {
  private readonly service = inject(Service);

  readonly orders = this.service.orders;

  readonly changes = signal<Change<Order>[]>([]);

  readonly editRowKey = signal<number | null>(null);

  readonly isLoading = signal(false);

  readonly changesText = computed(() => JSON.stringify(this.changes().map((change) => ({
    type: change.type,
    key: change.type !== 'insert' ? change.key : undefined,
    data: change.data,
  })), null, ' '));

  readonly loadPanelPosition = { of: '#gridContainer' };

  ngOnInit() {
    this.showLoadPanelWhile(this.service.loadOrders());
  }

  onSaving(e: DxDataGridTypes.SavingEvent) {
    const change = e.changes[0];

    if (change) {
      e.cancel = true;
      e.promise = this.processSaving(change);
    }
  }

  async processSaving(change: Change<Order>) {
    await this.showLoadPanelWhile(this.service.saveChange(change));
    this.editRowKey.set(null);
    this.changes.set([]);
  }

  private async showLoadPanelWhile(task: Promise<unknown>) {
    this.isLoading.set(true);

    try {
      await task;
    } finally {
      this.isLoading.set(false);
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
  ],
});
