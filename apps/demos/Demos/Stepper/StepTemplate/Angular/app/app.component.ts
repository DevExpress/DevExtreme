import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxStepperModule } from 'devextreme-angular';
import { type DxStepperTypes } from 'devextreme-angular/ui/stepper';
import { AppService } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxStepperModule,
  ],
})
export class AppComponent {
  steps: DxStepperTypes.Item[];

  constructor(private readonly appService: AppService) {
    this.steps = this.appService.getSteps();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    AppService,
  ],
});
