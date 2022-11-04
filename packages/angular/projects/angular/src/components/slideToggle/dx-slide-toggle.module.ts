import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DxLetModule, DxDynamicTemplateModule} from '../../internal/index';
import {DxSlideToggleContainerComponent} from './containers/dx-slide-toggle-container.component';
import {DxSlideToggleComponent} from './dx-slide-toggle.component';
import {
  DxSlideToggleIndicatorViewComponent,
  DxSlideToggleTextViewComponent
} from './views/index';


@NgModule({
  declarations: [
    DxSlideToggleComponent,
    DxSlideToggleContainerComponent,
    // views.
    DxSlideToggleIndicatorViewComponent,
    DxSlideToggleTextViewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DxLetModule,
    DxDynamicTemplateModule,
  ],
  exports: [
    DxSlideToggleComponent,
    DxSlideToggleIndicatorViewComponent,
    DxSlideToggleTextViewComponent,
  ],
})
export class DxSlideToggleModule {
}
