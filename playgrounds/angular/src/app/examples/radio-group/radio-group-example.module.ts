import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RadioButtonModule, RadioGroupModule } from '@devextreme/angular';
import { CustomLabelViewComponent } from './custom-components/custom-label-view.component';
import { CustomRadioViewComponent } from './custom-components/custom-radio-view.component';
import { RadioGroupCustomizationComponentsComponent } from './radio-group-customization-components.component';
import { RadioGroupCustomizationTemplatesComponent } from './radio-group-customization-templates.component';
import { RadioGroupExampleComponent } from './radio-group-example.component';
import { RadioGroupGenericComponent } from './radio-group-generic.component';
import { RadioGroupSimpleComponent } from './radio-group-simple.component';

const routes = [{
  path: '',
  component: RadioGroupExampleComponent,
}];

@NgModule({
  declarations: [
    RadioGroupExampleComponent,
    RadioGroupSimpleComponent,
    RadioGroupCustomizationComponentsComponent,
    RadioGroupCustomizationTemplatesComponent,
    RadioGroupGenericComponent,
    // custom components
    CustomLabelViewComponent,
    CustomRadioViewComponent,

  ],
  imports: [
    CommonModule,
    RadioButtonModule,
    RadioGroupModule,
    RouterModule.forChild(routes),
  ],
})
export class RadioGroupExampleModule {
}
