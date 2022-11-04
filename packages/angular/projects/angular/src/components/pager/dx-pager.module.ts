import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DxDynamicTemplateModule} from '../../internal/index';
import {DxPagerContainerComponent} from './containers/dx-pager-container.component';
import {DxPagerComponent} from './dx-pager.component';
import {
  DxPagerPageNumberItemViewComponent,
  DxPagerPageNumberViewComponent,
  DxPagerPageSizeItemViewComponent,
  DxPagerPageSizeViewComponent,
  DxPagerViewComponent
} from './views/index';



@NgModule({
  declarations: [
    DxPagerComponent,
    DxPagerContainerComponent,
    // views
    DxPagerViewComponent,
    DxPagerPageSizeViewComponent,
    DxPagerPageSizeItemViewComponent,
    DxPagerPageNumberViewComponent,
    DxPagerPageNumberItemViewComponent,
  ],
  exports: [
    DxPagerComponent,
    // views
    DxPagerViewComponent,
    DxPagerPageSizeViewComponent,
    DxPagerPageSizeItemViewComponent,
    DxPagerPageNumberViewComponent,
    DxPagerPageNumberItemViewComponent,
  ],
  imports: [
    CommonModule,
    DxDynamicTemplateModule
  ]
})
export class DxPagerModule {
}
