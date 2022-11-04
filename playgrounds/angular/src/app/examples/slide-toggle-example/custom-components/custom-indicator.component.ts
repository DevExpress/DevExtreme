import { Component } from '@angular/core';
import { DxSlideToggleIndicatorViewComponent } from '@devexpress/angular';

@Component({
  selector: 'app-custom-indicator',
  template: `
    <div class="custom-indicator">
      <img class="custom-indicator__image" *ngIf="viewModel.model.value" src="/assets/cat.jpeg" alt="cat"/>
      <img class="custom-indicator__image" *ngIf="!viewModel.model.value" src="/assets/dog.webp" alt="dog"/>
  </div>`,
  styles: [`
    .custom-indicator {
      width: 100px;
      height: 100px;
      margin: 10px;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    }

    .custom-indicator__image {
      width: 100%;
      height: 100%;
    }
  `]
})
export class CustomIndicatorComponent extends DxSlideToggleIndicatorViewComponent {
}
