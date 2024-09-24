import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  HttpRequest, HttpInterceptor, HTTP_INTERCEPTORS, HttpHandler, HttpEvent,
} from '@angular/common/http';
import { Component, Injectable, ViewChild } from '@angular/core';

import domAdapter from 'devextreme/core/dom_adapter';
import { DxHttpModule } from 'devextreme-angular/http';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import ajax from 'devextreme/core/utils/ajax';
import { DxFileUploaderComponent, DxFileUploaderModule } from 'devextreme-angular';
import { Observable } from 'rxjs';
import createSpy = jasmine.createSpy;
import RemoteFileSystemProvider from "devextreme/file_management/remote_provider";
import FileSystemItem from "devextreme/file_management/file_system_item";

const interceptors: Record<string, () => void> = {};

interceptors.interceptorFn = () => {};

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

@Injectable()
export class TestInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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

const createFileObject = (fileName, content) => {
  const result: any = new window.Blob([content], { type: 'application/octet-stream' });
  result.name = fileName;
  result.lastModified = (new Date()).getTime();
  result._dxContent = content;
  return result;
};

const generateString = (size: number, content?) => {
  if(!size) {
    return '';
  }

  let result = content;

  if(result === undefined) {
    result = 'A';
  }

  if(result.length < size) {
    const count = Math.ceil(size / result.length);
    result = new Array(count + 1).join(result);
  }

  if(result.length > size) {
    result = result.substr(0, size);
  }

  return result;
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

describe('Ajax request using DxHttpModule', () => {
  let httpTestingControllerMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestFileUploaderComponent],
      imports: [HttpClientTestingModule, DxHttpModule, DxFileUploaderModule],
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: TestInterceptor, multi: true }],
    });

    httpTestingControllerMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingControllerMock?.verify();
  });

  it('request should be correctly timeouted', (done) => {
    const url = 'http://somefakedomain1221.com/json-url';

    ajax.sendRequest({
      url,
      timeout: 1,
    }).fail((error) => {
      expect(error?.statusText).toEqual('timeout');
      done();
    });

    httpTestingControllerMock.expectOne(url);
  });

  it('remote provider should upload a file', (done) => {
   const url = 'http://somefakedomain1221.com/json-url';

   const remoteProvider = new RemoteFileSystemProvider({
     endpointUrl: url,
   });

   const directory = new FileSystemItem('root', true,[]);
   const fileData = createFileObject('New File 1.txt', generateString(100));
   const chunkBlob = new window.Blob([generateString(20)], { type: 'application/octet-stream' });
   const uploadInfo = {
     bytesUploaded: 0,
     chunkCount: 5,
     customData: { },
     chunkBlob,
     chunkIndex: 0
   };

   let isUploadSuccess = false;

   remoteProvider.uploadFileChunk(fileData, uploadInfo, directory)
   .then(() => {
     isUploadSuccess = true;
   })
   // @ts-ignore
   .always(() => {
     expect(isUploadSuccess).toEqual(true);
     done();
   });

   const req = httpTestingControllerMock.expectOne(url);

   req.flush({success: true});
  });

  it('should be aborted with correct status', (done) => {
    const url = '/heavy-url';
    const failCallback = createSpy();

    const request = ajax.sendRequest({
      url,
      method: 'GET',
    });

    request.fail((error) => {
      failCallback(error);
      expect(error?.statusText).toEqual('aborted');
      done();
    });

    request.abort();

    expect(failCallback).toHaveBeenCalledTimes(1);
    httpTestingControllerMock.expectOne(url);
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

    const fixture = TestBed.createComponent(TestFileUploaderComponent);
    fixture.detectChanges();

    const { instance } = fixture.componentInstance.fileUploader;

    Object.keys(callbacks).forEach((cb) => instance.option(cb, callbacks[cb] = createSpy()));

    instance.upload();

    expect(interceptorFnSpy).toHaveBeenCalledTimes(1);
    expect(callbacks.onBeforeSend).toHaveBeenCalledTimes(1);
    expect(callbacks.onUploadStarted).toHaveBeenCalledTimes(1);

    const req = httpTestingControllerMock.expectOne('https://js.devexpress.com/Demos/NetCore/FileUploader/Upload');

    req.flush([]);

    setTimeout(() => {
      const resultText = instance.element().querySelector('.dx-fileuploader-file-status-message')?.textContent;

      expect(callbacks.onProgress).toHaveBeenCalledTimes(1);
      expect(callbacks.onUploaded).toHaveBeenCalledTimes(1);
      expect(resultText).toEqual('Uploaded');
      done();
    }, 500);
  });

  it('fileUploader should be aborted and callbacks are called correctly', (done) => {
    const callbacks = {
      onUploadAborted() {},
      onUploaded() {},
      onUploadStarted() {},
    };

    const fixture = TestBed.createComponent(TestFileUploaderComponent);
    fixture.detectChanges();

    const { instance } = fixture.componentInstance.fileUploader;

    Object.keys(callbacks).forEach((cb) => instance.option(cb, callbacks[cb] = createSpy()));

    instance.upload();

    expect(callbacks.onUploadStarted).toHaveBeenCalledTimes(1);

    httpTestingControllerMock.expectOne('https://js.devexpress.com/Demos/NetCore/FileUploader/Upload');

    instance.abortUpload();

    setTimeout(() => {
      expect(callbacks.onUploadAborted).toHaveBeenCalledTimes(1);
      expect(callbacks.onUploaded).toHaveBeenCalledTimes(0);
      done();
    }, 0);
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
    const { request } = reqs[0];

    const callbackName = /callback=([^&]+)/.exec(request.urlWithParams)?.[1];

    reqs[0].flush([{ id: 0, text: 'TEST' }]);

    expect(request.method).toBe('JSONP');
    expect(callbackName).toBe('JSONP_CALLBACK');
    expect(dataSource.items()).toEqual([{ id: 0, text: 'TEST' }]);
  });

  it('script cross domain request (not interceptable) should create script element with src = url', (done) => {
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

  it('should request jsonp (same domain) create callback and call it, interceptor is called ', (done) => {
    const url = '/same-domain';
    const interceptorFnSpy = spyOn(interceptors, 'interceptorFn');

    ajax.sendRequest({
      url,
      dataType: 'jsonp',
      jsonp: 'callback1',
      jsonpCallback: 'callbackName',
    }).done((data) => {
      expect(interceptorFnSpy).toHaveBeenCalledTimes(1);
      expect(data.ok).toEqual(1);
      done();
    });

    const [req] = httpTestingControllerMock.match(() => true);

    expect(req.request.urlWithParams).toContain(`${url}?callback1=callbackName&`);

    req.flush('callbackName({ok: 1})');
  });

  it('should request script (same domain) and evaluate it, interceptor is called', (done) => {
    const url = '/same-domain/script';
    const interceptorFnSpy = spyOn(interceptors, 'interceptorFn');
    const document = domAdapter.getDocument();
    (document.defaultView as any).callback = () => {};
    const callbackSpy = spyOn(document.defaultView as any, 'callback');

    ajax.sendRequest({
      url,
      dataType: 'script',
    }).done(() => {
      expect(interceptorFnSpy).toHaveBeenCalledTimes(1);
      expect(callbackSpy).toHaveBeenCalledTimes(1);
      done();
    });

    const [req] = httpTestingControllerMock.match(() => true);

    expect(req.request.urlWithParams).toContain(url);

    req.flush('callback()');
  });
});
