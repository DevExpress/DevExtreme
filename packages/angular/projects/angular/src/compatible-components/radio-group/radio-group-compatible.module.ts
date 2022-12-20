import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TemplateCompatibleModule } from '../../compatible-directives/template';
import { RadioButtonModule } from '../../components/radio-button';
import { RadioGroupModule } from '../../components/radio-group';
import { ApplyPipeModule } from '../../internal';
import { RadioGroupCompatibleComponent } from './radio-group-compatible.component';

@NgModule({
  declarations: [RadioGroupCompatibleComponent],
  imports: [
    CommonModule,
    RadioGroupModule,
    RadioButtonModule,
    TemplateCompatibleModule,
    ApplyPipeModule,
  ],
  exports: [RadioGroupCompatibleComponent],
})
export class RadioGroupCompatibleModule {
}
