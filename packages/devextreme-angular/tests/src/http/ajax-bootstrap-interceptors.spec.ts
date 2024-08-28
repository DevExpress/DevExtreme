import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  provideHttpClient,
  withInterceptors,
  HttpInterceptorFn,
  HttpClient,
} from '@angular/common/http';
import { ApplicationRef, Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DxHttpModule } from 'devextreme-angular/http';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { throwError } from 'rxjs';

const TEST_URL = '';
const interceptors: Record<string, () => void> = {};

interceptors.interceptorFn = () => {};

const testInterceptorFn: HttpInterceptorFn = () => {
  interceptors.interceptorFn();
  return throwError(() => ({
    status: 403,
    statusText: 'Request intercepted. Access Denied',
  }));
};

@Component({
  standalone: true,
  selector: 'test-app',
  imports: [DxHttpModule],
  template: '---',
})
class TestAppComponent {
  constructor(private readonly httpClient: HttpClient) {}

  fetchData() {
    return this.httpClient.get(TEST_URL).toPromise();
  }

  loadDataSource() {
    const dataSource = new DataSource({
      store: new ODataStore({
        version: 2,
        url: TEST_URL,
      }),
    });

    return dataSource.load() as Promise<unknown>;
  }
}

describe('Using DxHttpModule in application with interceptors provided in bootstrapApplication() ', () => {
  let httpTestingControllerMock: HttpTestingController;
  let component: TestAppComponent;

  beforeEach(async () => {
    const testApp = document.createElement('test-app');

    document.body.appendChild(testApp);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    const appRef = await bootstrapApplication(TestAppComponent, {
      providers: [
        provideHttpClient(withInterceptors([testInterceptorFn])),
        { provide: HttpClientTestingModule },
      ],
    });

    const applicationRef = appRef.injector.get(ApplicationRef);

    component = applicationRef.components[0].instance as TestAppComponent;

    httpTestingControllerMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingControllerMock?.verify();
  });

  it('should call interceptors while calling httpClient directly ', (done) => {
    const interceptorFnSpy = spyOn(interceptors, 'interceptorFn');

    component
      .fetchData()
      .catch(() => {
        expect(interceptorFnSpy).toHaveBeenCalledTimes(1);
        done();
      }).finally(() => {});
  });

  it('dataSource load() should be intercepted', (done) => {
    const interceptorFnSpy = spyOn(interceptors, 'interceptorFn');

    // eslint-disable-next-line no-void
    void component.loadDataSource()
      .catch(() => {
        expect(interceptorFnSpy).toHaveBeenCalledTimes(1);
        done();
      });
  });
});
