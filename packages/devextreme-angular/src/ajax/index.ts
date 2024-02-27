import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import httpRequest from 'devextreme/core/http_request';
// eslint-disable-next-line import/named
import { sendRequestFactory } from './dx-ajax';

@NgModule({
  exports: [],
  imports: [],
  providers: [],
})
export class DxAjaxModule {
  constructor(httpClient: HttpClient) {
    httpRequest.inject({ sendRequest: sendRequestFactory(httpClient) });
  }
}
