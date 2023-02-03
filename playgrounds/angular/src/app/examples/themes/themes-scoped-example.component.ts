import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dx-themes-scoped-example',
  template: `
    <div class="example">
      <div class="example__title">
        Component styled by global theme:
      </div>
      <div class="example__control">
        <dx-radio-group>
          <dx-radio-button
            *ngFor="let option of options"
            [label]="'Option ' + option"
            [value]="option"
          ></dx-radio-button>
        </dx-radio-group>
      </div>
    </div>

    <div class="example">
      <div class="example__title">
        Component styled by scoped purple theme:
      </div>
      <div class="example__control dx-material-purple-light">
        <dx-radio-group
        >
          <dx-radio-button
            *ngFor="let option of options"
            [label]="'Option ' + option"
            [value]="option"
          ></dx-radio-button>
        </dx-radio-group>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemesScopedExampleComponent {
  options = [0, 1, 2];
}
