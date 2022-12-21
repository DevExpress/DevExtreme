import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  RadioGroupCompatibleModule,
  TemplateCompatibleModule,
} from '@devextreme/angular';
import { RadioGroupCompatExampleComponent } from './radio-group-compat-example.component';
import { RadioGroupCompatExprExampleComponent } from './radio-group-compat-expr.component';
import { RadioGroupCompatSimpleExampleComponent } from './radio-group-compat-simple.component';
import { RadioGroupCompatTemplateExampleComponent } from './radio-group-compat-template.component';

const routes = [{
  path: '',
  component: RadioGroupCompatExampleComponent,
}];

@NgModule({
  declarations: [
    RadioGroupCompatExampleComponent,
    RadioGroupCompatSimpleExampleComponent,
    RadioGroupCompatExprExampleComponent,
    RadioGroupCompatTemplateExampleComponent,
  ],
  imports: [
    CommonModule,
    RadioGroupCompatibleModule,
    TemplateCompatibleModule,
    RouterModule.forChild(routes),
  ],
})
export class RadioGroupCompatExampleModule {
}
