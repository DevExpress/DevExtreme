import DataSource from '../../../js/data/data_source';
import { ANY } from '../consts';

export function promiseResolveAcceptsMultipleArguments() {
  const callback: (a: any, b: any) => void = ANY;
  const dataSource: DataSource = ANY;
  dataSource.load().then(callback);
  dataSource.reload().then(callback);
}
