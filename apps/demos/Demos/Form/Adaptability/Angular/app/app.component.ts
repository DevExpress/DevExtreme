import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxFormModule } from 'devextreme-angular';
import { DxCheckBoxModule, type DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
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
    DxCheckBoxModule,
    DxFormModule,
  ],
})
export class AppComponent {
  readonly employee = inject(Service).getEmployee();

  readonly colCountByScreen = signal({
    md: 4,
    sm: 2,
  });

  readonly screen = (width: number) => (width < 720 ? 'sm' : 'md');

  valueChanged(e: DxCheckBoxTypes.ValueChangedEvent) {
    if (e.value) {
      this.colCountByScreen.set(null);
    } else {
      this.colCountByScreen.set({
        md: 4,
        sm: 2,
      });
    }
  }
}

bootstrapApplication(AppComponent);
