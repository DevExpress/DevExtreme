import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-slide-toggle-example',
  template: `
    <app-slide-toggle-control-example></app-slide-toggle-control-example>
    <app-slide-toggle-form-example></app-slide-toggle-form-example>
    <app-slide-toggle-customization-example></app-slide-toggle-customization-example>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideToggleExampleComponent {}
