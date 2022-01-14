/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { HttpClient, HttpHandler } from '@angular/common/http';
import CustomStore from '../../../js/data/custom_store';

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
    load: (): JQueryXHR => $.ajax({
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
