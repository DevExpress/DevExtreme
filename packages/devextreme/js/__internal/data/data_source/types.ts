import type { DataSourceEventName as PublicDataSourceEventName } from '@js/common/data';
import type { DeferredObj } from '@js/core/utils/deferred';
import type { DataSourceOptionsStub } from '@js/data/data_source';
import type PublicDataSource from '@js/data/data_source';
import type { StoreChange } from '@js/data/store';
import type { EventsStrategy } from '@ts/core/m_events_strategy';

export interface StoreLoadOptions extends Pick<
  DataSourceOptionsStub,
    'sort' | 'filter' | 'langParams' | 'select' | 'group'
    | 'requireTotalCount' | 'searchOperation' | 'searchValue' | 'searchExpr'
> {
  skip?: number;
  take?: number;
  userData?: unknown;
}

export interface LoadOperation {
  operationId: number;
  storeLoadOptions: StoreLoadOptions;
  delay?: number;
}

export interface ChangedEvent {
  changes?: StoreChange[];
}

export interface ChangingEvent {
  changes: StoreChange[];
}

type DataSourceEventName = PublicDataSourceEventName
  | 'customizeStoreLoadOptions'
  | 'customizeLoadResult'
  | 'changing';

export interface DataSource extends PublicDataSource {
  _eventsStrategy: EventsStrategy;

  _reshapeOnPush: boolean;

  _scheduleLoadCallbacks: (deferred: DeferredObj<unknown>) => void;

  _createStoreLoadOptions: () => StoreLoadOptions;

  beginLoading: () => void;

  endLoading: () => void;

  loadOptions: () => StoreLoadOptions;

  // eslint-disable-next-line @typescript-eslint/method-signature-style
  on(eventName: DataSourceEventName, eventHandler: Function): this;
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  on(events: { [key in DataSourceEventName]?: Function }): this;
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  off(eventName: DataSourceEventName, eventHandler?: Function): this;
}
