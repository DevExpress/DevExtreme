/* eslint-disable import/named */
/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Store,
  DataSource,
  CustomStore,
  ArrayStore,
  ODataStore,
  LocalStore,
} from 'devextreme/common/data';

import {
  DataSourceOptionsStub,
  DataSourceLike,
} from 'devextreme/data/data_source';

import {
  AnotherType,
  ANY,
  toAssertion,
  assertType,
  notAny,
  notNever,
  SomeType,
} from '../consts';

export function promiseResolveAcceptsMultipleArguments() {
  const callback: (a: any, b: any) => void = ANY;
  const dataSource: DataSource = ANY;
  dataSource.load().then(callback);
  dataSource.reload().then(callback);
}

export function DataSourceLikeIsNarrowed() {
  type Item = SomeType;
  type Key = AnotherType;
  type PublicStore<TItem, TKey> =
  | CustomStore<TItem, TKey>
  | LocalStore<TItem, TKey>
  | ArrayStore<TItem, TKey>
  | ODataStore<TItem, TKey>;

  function isString(x: any): x is string { return ANY; }
  function isArray(x: any): x is Item[] { return ANY; }
  function isDataSource(x: any): x is DataSource<Item, Key> { return ANY; }
  function isDataSourceOptionsStub(x: any): x is DataSourceOptionsStub<any, any, Item> {
    return ANY;
  }
  function isStore(x: any): x is PublicStore<Item, Key> {
    return ANY;
  }

  const actual: DataSourceLike<Item, Key> = ANY;

  if (!isString(actual) && !isArray(actual) && !isStore(actual) && !isDataSource(actual)) {
    notNever(actual);
    notAny(actual);
    assertType<DataSourceOptionsStub<any, any, Item>>(toAssertion(actual));
  }

  if (!isString(actual)
    && !isArray(actual)
    && !isStore(actual)
    && !isDataSourceOptionsStub(actual)
  ) {
    notNever(actual);
    notAny(actual);
    assertType<DataSource<Item, Key>>(toAssertion(actual));
  }

  if (!isString(actual)
    && !isArray(actual)
    && !isDataSource(actual)
    && !isDataSourceOptionsStub(actual)
  ) {
    notNever(actual);
    notAny(actual);
    assertType<Store<Item, Key>>(toAssertion(actual));
  }

  if (!isArray(actual)
    && !isStore(actual)
    && !isDataSource(actual)
    && !isDataSourceOptionsStub(actual)
  ) {
    notNever(actual);
    notAny(actual);
    assertType<string>(toAssertion(actual));
  }

  if (!isString(actual)
    && !isStore(actual)
    && !isDataSource(actual)
    && !isDataSourceOptionsStub(actual)
  ) {
    notNever(actual);
    notAny(actual);
    assertType<Item[]>(toAssertion(actual));
  }
}
