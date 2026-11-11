import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { DxMultiViewModule, DxCheckBoxModule } from 'devextreme-angular';

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
    DxMultiViewModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  readonly companies = inject(Service).getCompanies();

  readonly itemCount = this.companies.length;

  readonly selectedIndex = signal(0);

  readonly loop = signal(false);

  readonly animationEnabled = signal(true);
}

bootstrapApplication(AppComponent);
