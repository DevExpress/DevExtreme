import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DxSlideToggleTextViewComponent} from '@devexpress/angular';

@Component({
  selector: 'app-custom-text',
  template: `
    <div class="custom-text">
      {{ viewModel.config.text }}
    </div>
  `,
  styles: [`
    .custom-text {
      padding: 0 75px;
      font-size: 16px;
      transition: all .2s ease-in-out;
    }

    .custom-text:hover {
      transform: scale(2);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTextComponent extends DxSlideToggleTextViewComponent {
}
