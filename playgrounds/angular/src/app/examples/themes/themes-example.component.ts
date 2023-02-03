import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dx-themes-example',
  template: `
    <dx-themes-scoped-example></dx-themes-scoped-example>
    <dx-themes-dynamic-example></dx-themes-dynamic-example>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemesExampleComponent {
}
