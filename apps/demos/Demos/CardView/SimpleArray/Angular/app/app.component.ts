import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxCardViewModule } from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [Service],
  imports: [
    DxCardViewModule,
  ],
})
export class AppComponent {
  readonly customers = inject(Service).getCustomers();

  readonly columns = ['Company', 'Address', 'City', 'State', 'Zipcode', 'Phone'];
}

bootstrapApplication(AppComponent);
