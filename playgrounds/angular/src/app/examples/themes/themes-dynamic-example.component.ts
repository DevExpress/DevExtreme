import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dx-themes-dynamic-example',
  template: `
    <div class="example"
         [class.dx-material-blue-light]="value === 'blue'"
         [class.dx-material-purple-light]="value === 'purple'">
      <div class="example__title title--themed">
        Dynamic theme change example:
      </div>
      <div class="example__control">
        <dx-radio-group [(value)]="value">
          <dx-radio-button
            *ngFor="let theme of themes"
            [label]="'Theme ' + theme"
            [value]="theme"
          ></dx-radio-button>
        </dx-radio-group>
      </div>
    </div>`,
  styles: [`
    .title--themed {
      color: var(--primary-900);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemesDynamicExampleComponent {
  themes = ['blue', 'purple'];

  value? = this.themes[0];
}
