/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import {
  Store,
  StoreOptions,
  CustomStore,
  LoadResult,
} from 'devextreme/common/data';

import {
  ANY,
  assertType,
  notAny,
  notNever,
  toAssertion,
} from '../consts';

export async function infersTItemFromComplexLoadResult() {
  const store = new CustomStore({
    // eslint-disable-next-line @typescript-eslint/require-await
    load: async () => ({
      data: [{ a: 1 }],
    }),
  });

  const result = await store.byKey(ANY);
  notAny(result);
  const value: { a: number } = result;
}

export async function loadReturnTypeInferTypeDefinedInOptions() {
  const dataItem = { id: 1, value: true };
  const store = new CustomStore({
    // eslint-disable-next-line @typescript-eslint/require-await
    load: async () => ({
      data: [dataItem],
      totalCount: 1,
    }),
  });

  const loadResult = await store.load();
  const actualItem: (typeof loadResult) extends LoadResult<infer Item>
    ? Item : never = ANY;

  notAny(actualItem);
  notNever(actualItem);
  assertType<typeof dataItem>(toAssertion(actualItem));

  const byKeyItem = await store.byKey(ANY);
  notAny(byKeyItem);
  notNever(byKeyItem);
  assertType<typeof dataItem>(toAssertion(byKeyItem));
}

export function loadAcceptsAjaxResult() {
  const options: StoreOptions = {
    load: () => $.ajax(ANY),
  };
}

export function loadAcceptsAngularHttpClient() {
  const http: HttpClient = ANY;
  const options: StoreOptions = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    load: () => http.get(ANY).toPromise(),
  };
}

export function loadAcceptsPromiseOfObject() {
  const options: StoreOptions = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    load: () => new Promise<object>(ANY),
  };
}

export function promiseThenAcceptsMultipleArguments() {
  const callback: (a: any, b: any) => void = ANY;

  const store: Store = ANY;
  store.load().then(callback);
  store.load(ANY).then(callback);
  store.insert(ANY).then(callback);
  store.update(ANY, ANY).then(callback);
}
