import { NgModule, Injector, createNgModuleRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import devextremeAjax from 'devextreme/core/utils/ajax';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { fromPromise } from 'devextreme/core/utils/deferred';
// eslint-disable-next-line import/named
import { Options, sendRequestFactory } from './ajax';

@NgModule({
  exports: [],
  imports: [],
  providers: [],
})
export class DxHttpModule {
  constructor(injector: Injector) {
    const httpClient: HttpClient = injector.get(HttpClient, null);

    const importHttpClientModule = new Promise((resolve, reject) => {
      import('@angular/common/http')
        .then(({ HttpClientModule }) => {
          const moduleRef = createNgModuleRef(HttpClientModule, injector);

          const injectedHttpClient = moduleRef.injector.get(HttpClient);

          resolve(injectedHttpClient);
        }).catch((err) => reject(err));
    });

    const sendRequest = !httpClient
      ? (options: Options) => fromPromise(importHttpClientModule).then(
        (injectedHttpClient: HttpClient) => sendRequestFactory(injectedHttpClient)(options),
      )
      : sendRequestFactory(httpClient);

    devextremeAjax.inject({ sendRequest });
  }
}
