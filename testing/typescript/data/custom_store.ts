/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { HttpClient, HttpHandler } from '@angular/common/http';
import CustomStore from '../../../js/data/custom_store';
import DataSource from '../../../js/data/data_source';

export async function infersTItemFromComplexLoadResult() {
  const store = new CustomStore({
    // eslint-disable-next-line @typescript-eslint/require-await
    load: async () => ({
      data: [{ a: 1 }, { a: 2 }, { a: 3 }],
      totalCount: 10,
      summary: [10],
      groupCount: 3,
    }),
  });

  // If TItem inferred incorrectly, the assignment below will result to compilation error.
  // However, if TItem inferred as any, it still will be broken,
  // so we may try adding some logic to avoid it
  const value: { a: number } = await store.byKey('stub');
}

export function loadAcceptsAjaxResult() {
  new CustomStore({
    load: () => $.ajax({
      url: 'url', cache: false, dataType: 'json', data: 'data',
    }),
  });
}

export function loadAcceptsAngularHttpClient() {
  const http: HttpClient = new HttpClient({} as HttpHandler);
  new CustomStore({
    load: () => http.get('url').toPromise(),
  });
}

export function loadAcceptsPromiseOfObject() {
  new CustomStore({
    // eslint-disable-next-line @typescript-eslint/ban-types
    load: () => new Promise<object>(undefined),
  });
}

export function promiseResolveAcceptsMultipleArguments() {
  const store = new CustomStore({
    load: () => new Promise((resolve) => {
      resolve((v1, v2: { totalCount: number; groupCount: number }) => [v1, v2]);
    }),
  });

  const dataSource = new DataSource(store);
  // eslint-disable-next-line max-len
  const promise = dataSource.load().then((v1, v2: { totalCount: number; groupCount: number }) => [v1, v2]);
}
