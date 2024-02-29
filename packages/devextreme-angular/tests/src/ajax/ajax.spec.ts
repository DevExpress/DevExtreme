import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HTTP_INTERCEPTORS, HttpHandler,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
// import { DxAjaxModule } from 'devextreme-angular/ajax';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
const mockHandler = {
  handle: (req: HttpRequest<any>): Observable<HttpEvent<any>> => of(new HttpResponse(req)),
};

@Injectable()
export class TestInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req);
  }
}

describe('Ajax request', () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule /*DxAjaxModule*/],
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: TestInterceptor, multi: true }],
    });
    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be intercepted', async () => {
    const dataSource = new DataSource({
      store: new ODataStore({
        version: 2,
        url: 'https://js.devexpress.com/Demos/WidgetsGallery/odata/HierarchicalItems',
      }),
    });

    const spy = spyOn(mockHandler, 'handle');

    await dataSource.load();

    expect(spy).toHaveBeenCalled();
  });
});
