import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DxDataGridModule, DxTextBoxModule } from 'devextreme-angular';
import { CollaborativeEditingService } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  providers: [CollaborativeEditingService],
  imports: [
    DxDataGridModule,
    DxTextBoxModule,
  ],
})
export class AppComponent {
  private readonly service = inject(CollaborativeEditingService);

  readonly dataSources = [this.service.createStore(), this.service.createStore()];

  readonly stateDataSource = this.service.createStatesStore();

  readonly maxDate = new Date(3000, 0);

  constructor() {
    this.service.getStoreChangedObservable()
      .pipe(takeUntilDestroyed())
      .subscribe((events) => {
        this.dataSources.forEach((store) => store.push(events));
      });
  }
}

bootstrapApplication(AppComponent);
