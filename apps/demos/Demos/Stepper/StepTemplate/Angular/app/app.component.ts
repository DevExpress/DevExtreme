import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
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
  readonly steps: DxStepperTypes.Item[] = inject(AppService).getSteps();
}

bootstrapApplication(AppComponent, {
  providers: [
    AppService,
  ],
});
