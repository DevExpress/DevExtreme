import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxFormModule } from 'devextreme-angular';

import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxFormModule,
  ],
})
export class AppComponent {
  readonly employee = inject(Service).getEmployee();

  readonly groupCaptionTemplates: { name: string; icon: string }[] = [
    { name: 'user', icon: 'dx-icon-user' },
    { name: 'info', icon: 'dx-icon-info' },
    { name: 'personal', icon: 'dx-icon-card' },
    { name: 'address', icon: 'dx-icon-home' },
    { name: 'contact', icon: 'dx-icon-tel' },
  ];
}

bootstrapApplication(AppComponent);
