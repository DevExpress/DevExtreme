import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxCircularGaugeModule, DxSelectBoxModule } from 'devextreme-angular';
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
    DxCircularGaugeModule,
    DxSelectBoxModule,
  ],
})

export class AppComponent {
  readonly dataSource = inject(Service).getData();

  readonly value = signal(this.dataSource[0]);

  customizeText(arg) {
    return `${arg.valueText} °C`;
  }
}

bootstrapApplication(AppComponent);
