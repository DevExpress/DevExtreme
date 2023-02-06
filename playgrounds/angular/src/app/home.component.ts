import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppRoutes } from './routing/app.routes';

@Component({
  selector: 'app-home',
  template: `
    <a [routerLink]="'/' + appRoutes.radioButton">RadioButton examples</a>
    <a [routerLink]="'/' + appRoutes.radioGroup">RadioGroup examples</a>
    <a [routerLink]="'/' + appRoutes.radioGroupCompat">RadioGroupCompat examples</a>
    <a [routerLink]="'/' + appRoutes.themes">Theme examples</a>
  `,
  styles: [`
    :host {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    a {
      display: block;
      margin: 10px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  appRoutes = AppRoutes;
}
