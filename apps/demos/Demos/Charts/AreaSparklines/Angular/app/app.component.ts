import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxSparklineModule } from 'devextreme-angular';
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
    DxSparklineModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly copperCosts = this.service.getCopperCosts();

  readonly nickelCosts = this.service.getNickelCosts();

  readonly palladiumCosts = this.service.getPalladiumCosts();

  readonly years = [2021, 2022, 2023];
}

bootstrapApplication(AppComponent);
