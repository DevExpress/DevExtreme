import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicTemplateModule } from '../../internal';
import { RadioButtonComponent } from './radio-button.component';
import { LabelViewComponent } from './views/label-view.component';
import { RadioViewComponent } from './views/radio-view.component';

@NgModule({
  declarations: [
    RadioButtonComponent,
    LabelViewComponent,
    RadioViewComponent,
  ],
  imports: [
    CommonModule,
    DynamicTemplateModule,
  ],
  exports: [
    RadioButtonComponent,
    LabelViewComponent,
    RadioViewComponent,
  ],
})
export class RadioButtonModule {
}
