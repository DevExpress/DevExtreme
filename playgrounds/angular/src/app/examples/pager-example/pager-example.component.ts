import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-pager-example',
    template: `
    <app-pager-simple-example></app-pager-simple-example>
    <app-pager-customization-component-example></app-pager-customization-component-example>
    <app-pager-customization-template-example></app-pager-customization-template-example>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagerExampleComponent {}
