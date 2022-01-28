import DataSource from '../../../js/data/data_source';

export function promiseResolveAcceptsMultipleArguments() {
  const callback: (a: any, b: any) => void = undefined;
  const dataSource = new DataSource({});
  dataSource.load().then(callback);
  dataSource.reload().then(callback);
}
