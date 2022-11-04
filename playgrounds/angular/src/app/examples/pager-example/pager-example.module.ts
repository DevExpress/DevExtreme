import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DxDynamicTemplateModule} from '@devexpress/angular';
import {DxPagerModule} from '@devexpress/angular';
import {
  CustomPageNumberComponent, CustomPageNumberDividerComponent,
  CustomPageNumberItemComponent,
  CustomPagerComponent,
  CustomPageSizeComponent, CustomPageSizeItemComponent
} from './custom-components';
import {
  PagerCustomizationComponentExampleComponent
} from './pager-customization-component-example/pager-customization-component-example.component';
import {
  PagerCustomizationTemplateExampleComponent
} from './pager-customization-template-example/pager-customization-template-example.component';
import {PagerExampleComponent} from './pager-example.component';
import {PagerSimpleExampleComponent} from './pager-simple-example/pager-simple-example.component';


@NgModule({
  declarations: [
    PagerExampleComponent,
    PagerSimpleExampleComponent,
    PagerCustomizationComponentExampleComponent,
    PagerCustomizationTemplateExampleComponent,
    // customization
    CustomPagerComponent,
    CustomPageNumberComponent,
    CustomPageNumberItemComponent,
    CustomPageNumberDividerComponent,
    CustomPageSizeComponent,
    CustomPageSizeItemComponent,
  ],
  imports: [
    CommonModule,
    DxPagerModule,
    DxDynamicTemplateModule,
  ],
  exports: [
    PagerExampleComponent,
    PagerSimpleExampleComponent,
    PagerCustomizationComponentExampleComponent,
    PagerCustomizationTemplateExampleComponent,
  ],
})
export class PagerExampleModule {
}
