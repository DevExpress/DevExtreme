import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import devextremeAjax from 'devextreme/core/utils/ajax';
// eslint-disable-next-line import/named
import { sendRequestFactory } from './ajax';

@NgModule({
  exports: [],
  imports: [HttpClientModule],
  providers: [],
})
export class DxHttpModule {
  constructor(httpClient: HttpClient) {
    devextremeAjax.inject({ sendRequest: sendRequestFactory(httpClient) });
  }
}
