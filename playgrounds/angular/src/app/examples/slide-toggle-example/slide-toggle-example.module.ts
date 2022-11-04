import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {DxSlideToggleModule} from '@devexpress/angular';
import {CustomIndicatorComponent, CustomTextComponent} from './custom-components';
import {
  SlideToggleSimpleExampleComponent
} from './slide-toggle-simple-example/slide-toggle-simple-example.component';
import {
  SlideToggleCustomizationExampleComponent
} from './slide-toggle-customization-example/slide-toggle-customization-example.component';
import {SlideToggleExampleComponent} from './slide-toggle-example.component';
import {SlideToggleFormExampleComponent} from './slide-toggle-form-example/slide-toggle-form-example.component';


@NgModule({
  declarations: [
    SlideToggleExampleComponent,
    SlideToggleSimpleExampleComponent,
    SlideToggleFormExampleComponent,
    SlideToggleCustomizationExampleComponent,
    // customization
    CustomIndicatorComponent,
    CustomTextComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DxSlideToggleModule,
    DxSlideToggleModule,
  ],
  exports: [
    SlideToggleExampleComponent,
    SlideToggleSimpleExampleComponent,
    SlideToggleFormExampleComponent,
    SlideToggleCustomizationExampleComponent,
  ],
})
export class SlideToggleExampleModule {
}
