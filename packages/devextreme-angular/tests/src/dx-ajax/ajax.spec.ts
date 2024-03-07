import { TestBed } from '@angular/core/testing';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  HttpRequest, HttpInterceptor, HTTP_INTERCEPTORS, HttpHandler,
} from '@angular/common/http';
import { Component, Injectable, ViewChild } from '@angular/core';

import domAdapter from 'devextreme/core/dom_adapter';
import { DxAjaxModule } from 'devextreme-angular/ajax';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import ajax from 'devextreme/core/utils/ajax';
import { DxFileUploaderComponent, DxFileUploaderModule } from 'devextreme-angular';

const interceptors: Record<string, () => void> = {};

interceptors.interceptorFn = () => {};

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

@Injectable()
export class TestInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    interceptors.interceptorFn();
    return next.handle(req);
  }
}

const createBlobFile = function (name: string, size: number) {
  return {
    name,
    size,
    type: 'image/png',
    lastModifiedDate: new Date().getTime(),
    blob: new Blob(['0'.repeat(size)], { type: 'application/octet-binary' }),
    slice(startPos: number, endPos: number) {
      return this.blob.slice(startPos, endPos);
    },
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
    const interceptorFnSpy = spyOn(interceptors, 'interceptorFn');
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
    const interceptorFnSpy = spyOn(interceptors, 'interceptorFn');

    const callbacks = {
      onBeforeSend() {},
      onProgress() {},
      onUploadStarted() {},
      onUploaded() {},
    };

    const beforeSendSpy = spyOn(callbacks, 'onBeforeSend');
    const onProgressSpy = spyOn(callbacks, 'onProgress');
    const onUploadStartedSpy = spyOn(callbacks, 'onUploadStarted');
    const onUploadedSpy = spyOn(callbacks, 'onUploaded');

    const fixture = TestBed.createComponent(TestFileUploaderComponent);
    fixture.detectChanges();

    const { instance } = fixture.componentInstance.fileUploader;

    Object.keys(callbacks).forEach((cb) => instance.option(cb, callbacks[cb]));

    instance.upload();

    expect(interceptorFnSpy).toHaveBeenCalledTimes(1);
    expect(beforeSendSpy).toHaveBeenCalledTimes(1);
    expect(onUploadStartedSpy).toHaveBeenCalledTimes(1);

    const req = httpTestingControllerMock.expectOne('https://js.devexpress.com/Demos/NetCore/FileUploader/Upload');

    req.flush([]);

    setTimeout(() => {
      const resultText = instance.element().querySelector('.dx-fileuploader-file-status-message')?.textContent;

      expect(onProgressSpy).toHaveBeenCalledTimes(1);
      expect(onUploadedSpy).toHaveBeenCalledTimes(1);
      expect(resultText).toEqual('Uploaded');
      done();
    }, 500);
  });

  it('JSONP cross domain request should be intercepted', (done) => {
    const interceptorFnSpy = spyOn(interceptors, 'interceptorFn');
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

    const reqs = httpTestingControllerMock.match(() => true);

    const callbackName = /callback=([^&]+)/.exec(reqs[0].request.urlWithParams)?.[1];

    reqs[0].flush([{ id: 0, text: 'TEST' }]);

    expect(reqs[0].request.method).toBe('JSONP');
    expect(callbackName).toBe('JSONP_CALLBACK');
    expect(dataSource.items()).toEqual([{ id: 0, text: 'TEST' }]);
  });

  it('script cross domain request (not interceptable) should create script element with src = url ', (done) => {
    const document = domAdapter.getDocument();
    const createElementOrig = document.createElement.bind(document);

    let scriptEl;

    spyOn(document, 'createElement').and.callFake((...args) => {
      const el = createElementOrig(...args);
      if (args[0] === 'script') {
        scriptEl = el;
      }

      return el;
    });

    const url = 'http://somefakedomain1221.com/json-url/script';

    ajax.sendRequest({
      url,
      dataType: 'script',
    }).fail(() => {
      expect(scriptEl?.src).toContain(url);
      done();
    });
  });
});
