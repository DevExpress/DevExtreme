import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  HttpRequest, HttpInterceptor, HTTP_INTERCEPTORS, HttpHandler,
} from '@angular/common/http';
import { Component, Injectable, ViewChild } from '@angular/core';
import { DxAjaxModule } from 'devextreme-angular/ajax';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { DxFileUploaderComponent, DxFileUploaderModule } from 'devextreme-angular';

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

const createBlobFile = function (name: string, size: number, type?: string) {
  return {
    name,
    size,
    type: type || 'image/png',
    blob: (function (filesize) {
      let str = '';

      while (str.length < filesize) {
        str += 'a';
      }
      return new Blob([str], { type: 'application/octet-binary' });
    }(size)),
    slice(startPos, endPos) {
      return this.blob.slice(startPos, endPos);
    },
    lastModifiedDate: new Date().getTime(),
  };
};

@Component({
  selector: 'test-container-component',
  template: `<dx-file-uploader
      uploadUrl="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
      [chunkSize]="200000"
      [multiple]="true"
      [(value)]="value"
      accept="*"
      uploadMode="instantly"></dx-file-uploader>
`,
})
class TestFileUploaderComponent {
  @ViewChild(DxFileUploaderComponent) fileUploader: DxFileUploaderComponent;

  value = [createBlobFile('image1.png', 50100)];
}

describe('Ajax request using DxAjaxModule', () => {
  let httpTestingControllerMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestFileUploaderComponent],
      imports: [HttpClientTestingModule, DxAjaxModule, DxFileUploaderModule, BrowserTransferStateModule],
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: TestInterceptor, multi: true }],
    });

    httpTestingControllerMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingControllerMock?.verify();
  });

  it('dataSource load() should be intercepted', (done) => {
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

  it('fileUploader have to upload file and interceptor is called', (done) => {
    const interceptorFnSpy = spyOn(ctx, 'interceptorFn');

    const fixture = TestBed.createComponent(TestFileUploaderComponent);
    fixture.detectChanges();

    const { instance } = fixture.componentInstance.fileUploader;
    instance.upload();

    expect(interceptorFnSpy).toHaveBeenCalledTimes(1);

    const req = httpTestingControllerMock.expectOne('https://js.devexpress.com/Demos/NetCore/FileUploader/Upload');

    req.flush([]);

    setTimeout(() => {
      const resultText = instance.element().querySelector('.dx-fileuploader-file-status-message')?.textContent;
      expect(resultText).toEqual('Uploaded');
      done();
    }, 500);
  });

  xit('Script request (cross domain)', (done) => {
    const interceptorFnSpy = spyOn(ctx, 'interceptorFn');
    const url = 'http://somefakedomain1221.com/json-url';
    const dataSource = new DataSource({
      store: new ODataStore({
        version: 2,
        jsonp: true,
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
  }
});
