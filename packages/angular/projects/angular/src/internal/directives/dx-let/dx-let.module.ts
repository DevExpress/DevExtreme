import {NgModule} from '@angular/core';
import {DxLetDirective} from './dx-let.directive';


@NgModule({
  declarations: [
    DxLetDirective
  ],
  exports: [
    DxLetDirective,
  ]
})
export class DxLetModule {
}
