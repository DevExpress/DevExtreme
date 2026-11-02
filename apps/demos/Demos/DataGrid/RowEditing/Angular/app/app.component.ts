import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject, signal } from '@angular/core';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxDataGridModule,
    DxButtonModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly dataSource = this.service.getEmployees();

  readonly states = this.service.getStates();

  readonly events = signal<string[]>([]);

  logEvent(eventName) {
    this.events.update((events) => [eventName, ...events]);
  }

  clearEvents() {
    this.events.set([]);
  }
}

bootstrapApplication(AppComponent);
