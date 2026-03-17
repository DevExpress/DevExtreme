import { NgModule, Injector, createNgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import devextremeAjax from 'devextreme/core/utils/ajax';
import { sendRequestFactory } from './ajax';

@NgModule({
  exports: [],
  imports: [],
  providers: [],
})
export class DxHttpModule {
  constructor(injector: Injector) {
    let httpClient: HttpClient = injector.get(HttpClient, null);

    if (!httpClient) {
      const moduleRef = createNgModule(HttpClientModule, injector);

      httpClient = moduleRef.injector.get(HttpClient);
    }

    devextremeAjax.inject({ sendRequest: sendRequestFactory(httpClient) });
  }
}
