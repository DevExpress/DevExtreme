import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import 'devextreme/ui/text_area';
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
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly dataSource = this.service.getEmployees();

  readonly states = this.service.getStates();
}

bootstrapApplication(AppComponent);
