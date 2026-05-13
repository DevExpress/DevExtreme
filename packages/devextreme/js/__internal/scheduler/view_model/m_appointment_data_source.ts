import type { DataSource } from '@js/common/data';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import type { StoreEventName } from '@js/data/store';

import type { SafeAppointment } from '../types';

const STORE_EVENTS: Record<string, StoreEventName> = {
  updating: 'updating',
  push: 'push',
};

interface UpdatedAppointmentKey {
  key: string;
  value: unknown;
}

export class AppointmentDataSource {
  protected updatedAppointmentKeys: UpdatedAppointmentKey[] = [];

  protected dataSource!: DataSource;

  protected updatedAppointment: SafeAppointment | null = null;

  constructor(dataSource: DataSource) {
    this.setDataSource(dataSource);
    this.updatedAppointmentKeys = [];
  }

  get keyName(): string {
    const store = this.dataSource.store();
    return store?.key() as string;
  }

  get isDataSourceInit(): boolean {
    return Boolean(this.dataSource);
  }

  private getStoreKey(target: SafeAppointment): unknown {
    const store = this.dataSource.store();

    return store?.keyOf(target);
  }

  setDataSource(dataSource: DataSource): void {
    this.dataSource = dataSource;

    this.cleanState();
    this.initStoreChangeHandlers();
  }

  private initStoreChangeHandlers(): void {
    const { dataSource } = this;
    const store = dataSource.store();

    if (store) {
      store.on(STORE_EVENTS.updating, (key) => {
        const keyName = store.key() as string;
        if (keyName) {
          this.updatedAppointmentKeys.push({
            key: keyName,
            value: key,
          });
        } else {
          this.updatedAppointment = key;
        }
      });

      store.on(STORE_EVENTS.push, (pushItems) => {
        const items = dataSource.items();
        const keyName = store.key() as string;

        pushItems.forEach((pushItem) => {
          const itemExists = items.filter((item) => item[keyName] === pushItem.key).length !== 0;

          if (itemExists) {
            this.updatedAppointmentKeys.push({
              key: keyName,
              value: pushItem.key,
            });
          } else {
            const { data } = pushItem;
            if (data) {
              items.push(data);
            }
          }
        });

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        dataSource.load();
      });
    }
  }

  getUpdatedAppointment(): SafeAppointment | null {
    return this.updatedAppointment;
  }

  getUpdatedAppointmentKeys(): UpdatedAppointmentKey[] {
    return this.updatedAppointmentKeys;
  }

  cleanState(): void {
    this.updatedAppointment = null;
    this.updatedAppointmentKeys = [];
  }

  add(rawAppointment: SafeAppointment): DeferredObj<SafeAppointment> {
    // @eslint-disable-next-line
    return this.dataSource.store().insert(rawAppointment)
    // @ts-expect-error
      .done(() => this.dataSource.load());
  }

  update(target: SafeAppointment, data: SafeAppointment): DeferredObj<SafeAppointment | undefined> {
    const key = this.getStoreKey(target);
    // @ts-expect-error
    const d = new Deferred();

    this.dataSource.store().update(key, data)
    // @ts-expect-error
      .done((result) => this.dataSource.load()
        // @ts-expect-error
        .done(() => d.resolve(result))
        .fail(d.reject))
      .fail(d.reject);

    return d.promise();
  }

  remove(rawAppointment: SafeAppointment): DeferredObj<SafeAppointment | undefined> {
    const key = this.getStoreKey(rawAppointment);
    return this.dataSource.store().remove(key)
    // @ts-expect-error
      .done(() => this.dataSource.load());
  }

  destroy(): void {
    const store = this.dataSource.store();

    if (store) {
      store.off(STORE_EVENTS.updating);
      store.off(STORE_EVENTS.push);
    }
  }
}
