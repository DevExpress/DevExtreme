import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, computed, enableProdMode, inject, signal,
} from '@angular/core';
import { DxBarGaugeModule, DxSelectBoxModule } from 'devextreme-angular';
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
    DxBarGaugeModule,
    DxSelectBoxModule,
  ],
})

export class AppComponent {
  readonly colors = inject(Service).getColors();

  readonly currentColor = signal(this.colors[0].code);

  readonly basicColors = computed(() => {
    const code = Number(`0x${this.currentColor().slice(1)}`);

    return [
      (code >> 16) & 0xff,
      (code >> 8) & 0xff,
      code & 0xff,
    ];
  });
}

bootstrapApplication(AppComponent);
