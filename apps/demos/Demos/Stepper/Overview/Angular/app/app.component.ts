import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxButtonGroupModule, type DxButtonGroupTypes } from 'devextreme-angular/ui/button-group';
import { DxCheckBoxModule, type DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
import { DxStepperModule, type DxStepperTypes } from 'devextreme-angular/ui/stepper';
import type { Orientation } from 'devextreme/common';

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
    DxButtonGroupModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  private readonly appService = inject(AppService);

  readonly steps: DxStepperTypes.Item[] = this.appService.getSteps();

  readonly orientations: any[] = this.appService.getOrientations();

  readonly navigationModes: any[] = this.appService.getNavigationModes();

  readonly orientation = signal<Orientation>(this.orientations[0].value);

  readonly navigationMode = signal<boolean>(this.navigationModes[0].value);

  readonly selectOnFocus = signal(true);

  readonly rtlMode = signal(false);

  onOrientationClick(e: DxButtonGroupTypes.ItemClickEvent) {
    this.orientation.set(e.itemData.value);
  }

  onNavigationModeClick(e: DxButtonGroupTypes.ItemClickEvent) {
    this.navigationMode.set(e.itemData.value);
  }

  onSelectOnFocusChanged(e: DxCheckBoxTypes.ValueChangedEvent) {
    this.selectOnFocus.set(e.value);
  }

  onRtlModeChanged(e: DxCheckBoxTypes.ValueChangedEvent) {
    this.rtlMode.set(e.value);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    AppService,
  ],
});
