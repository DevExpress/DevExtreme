import { NgModule, Injector, createNgModuleRef } from '@angular/core';
import * as angularCommonHttp from '@angular/common/http';
import devextremeAjax from 'devextreme/core/utils/ajax';
import { sendRequestFactory } from './ajax';

@NgModule({
  exports: [],
  imports: [],
  providers: [],
})
export class DxHttpModule {
  constructor(injector: Injector) {
    let httpClient: angularCommonHttp.HttpClient = injector.get(angularCommonHttp.HttpClient, null);

    if (!httpClient) {
      const moduleRef = createNgModuleRef(angularCommonHttp.HttpClientModule, injector);

      httpClient = moduleRef.injector.get(angularCommonHttp.HttpClient);
    }

    devextremeAjax.inject({ sendRequest: sendRequestFactory(httpClient) });
  }
}
