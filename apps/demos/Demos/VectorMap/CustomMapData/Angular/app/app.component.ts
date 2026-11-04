import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxVectorMapModule } from 'devextreme-angular';
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
    DxVectorMapModule,
  ],
})

export class AppComponent {
  private readonly service = inject(Service);

  readonly pangaeaBorders = this.service.getPangaeaBorders();

  readonly pangaeaContinents = this.service.getPangaeaContinents();

  readonly projection = {
    to(coordinates: number[]) {
      return [coordinates[0] / 100, coordinates[1] / 100];
    },
    from(coordinates: number[]) {
      return [coordinates[0] * 100, coordinates[1] * 100];
    },
  };

  customizeLayer(elements: { attribute: Function, applySettings: Function }[]) {
    elements.forEach((element) => {
      element.applySettings({
        color: element.attribute('color'),
      });
    });
  }
}

bootstrapApplication(AppComponent);
