import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  HttpRequest, HttpInterceptor, HTTP_INTERCEPTORS, HttpHandler,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DxAjaxModule } from 'devextreme-angular/ajax';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';

const ctx: Record<string, any> = {};

ctx.interceptorFn = () => {};

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

@Injectable()
export class TestInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    ctx.interceptorFn();
    return next.handle(req);
  }
}

describe('Ajax request using DxAjaxModule', () => {
  let injector: TestBed;
  let httpTestingControllerMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule, DxAjaxModule],
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: TestInterceptor, multi: true }],
    });
    injector = getTestBed();
    httpTestingControllerMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingControllerMock.verify();
  });

  it('should be intercepted', (done) => {
    // eslint-disable-next-line no-restricted-globals
    const interceptorFnSpy = spyOn(ctx, 'interceptorFn');
    const url = 'https://js.devexpress.com/Demos/WidgetsGallery/odata/HierarchicalItems';
    const dataSource = new DataSource({
      store: new ODataStore({
        version: 2,
        url,
      }),
    });

    // eslint-disable-next-line no-void
    void dataSource.load().then(() => {
      expect(interceptorFnSpy).toHaveBeenCalledTimes(1);
      done();
    });

    const req = httpTestingControllerMock.expectOne(`${url}?%24top=20`);

    req.flush([{ id: 0, text: 'TEST' }]);

    expect(dataSource.items()).toEqual([{ id: 0, text: 'TEST' }]);
  });
});
