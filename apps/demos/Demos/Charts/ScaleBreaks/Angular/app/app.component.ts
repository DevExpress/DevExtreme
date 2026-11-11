import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxChartModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { Service } from './app.service';

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
    DxChartModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  readonly data = inject(Service).getData();

  readonly lineStyles = ['waved', 'straight'];

  readonly breaksCount = [1, 2, 3, 4];

  readonly lineStyleValue = signal(this.lineStyles[0]);

  readonly autoBreaksEnabledValue = signal(true);

  readonly breaksCountValue = signal(this.breaksCount[2]);

  readonly title = 'Relative Masses of the Heaviest\n Solar System Objects';
}

bootstrapApplication(AppComponent);
