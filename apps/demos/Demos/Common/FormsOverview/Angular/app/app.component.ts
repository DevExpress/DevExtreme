import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import {
  DxFormModule,
} from 'devextreme-angular';
import 'devextreme/ui/select_box';
import 'devextreme/ui/text_area';
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
  private readonly service = inject(Service);

  readonly employee = this.service.getEmployee();

  readonly positions = this.service.getPositions();

  readonly states = this.service.getStates();
}

bootstrapApplication(AppComponent);
