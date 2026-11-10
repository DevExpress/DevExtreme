import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, viewChild,
} from '@angular/core';
import { DxButtonModule } from 'devextreme-angular';
import { DxChartComponent, DxChartModule, DxChartTypes } from 'devextreme-angular/ui/chart';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [
    DxChartModule,
    DxButtonModule,
  ],
})
export class AppComponent {
  private readonly chart = viewChild.required(DxChartComponent);

  readonly mountains = inject(Service).getMountains();

  readonly customizeTooltip = ({ argumentText, valueText, point: { data: { system } } }) => (
    {
      text: `<span class='title'>${argumentText}</span><br />&nbsp;<br />System: ${
        system}<br />Height: ${valueText} m`,
    }
  );

  readonly customizeLabel: DxChartTypes.ValueAxisLabel['customizeText'] = ({ value }) => `${value} m`;

  print() {
    this.chart().instance.print();
  }

  export() {
    this.chart().instance.exportTo('Example', 'png');
  }
}

bootstrapApplication(AppComponent);
