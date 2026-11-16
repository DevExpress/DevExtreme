import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxTreeListModule } from 'devextreme-angular';
import { DxTextBoxTypes } from 'devextreme-angular/ui/text-box';
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
    DxTreeListModule,
  ],
})
export class AppComponent {
  readonly employees = inject(Service).getEmployees();

  readonly editorOptions: DxTextBoxTypes.Properties = { placeholder: 'Search city or state' };

  readonly searchExpr = ['City', 'State'];
}

bootstrapApplication(AppComponent);
