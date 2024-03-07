import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import devextremeAjax from 'devextreme/core/utils/ajax';
// eslint-disable-next-line import/named
import { sendRequestFactory } from './ajax';

@NgModule({
  exports: [],
  imports: [],
  providers: [],
})
export class DxAjaxModule {
  constructor(httpClient: HttpClient) {
    devextremeAjax.inject({ sendRequest: sendRequestFactory(httpClient) });
  }
}
