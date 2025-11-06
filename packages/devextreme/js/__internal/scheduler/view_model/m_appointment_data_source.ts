import { Deferred } from '@js/core/utils/deferred';

const STORE_EVENTS = {
  updating: 'updating',
  push: 'push',
};

export class AppointmentDataSource {
  protected updatedAppointmentKeys: any[];

  protected dataSource: any;

  protected updatedAppointment: any;

  constructor(dataSource) {
    this.setDataSource(dataSource);
    this.updatedAppointmentKeys = [];
  }

  get keyName() {
    const store = this.dataSource.store();
    return store.key();
  }

  get isDataSourceInit() {
    return Boolean(this.dataSource);
  }

  _getStoreKey(target) {
    const store = this.dataSource.store();

    return store.keyOf(target);
  }

  setDataSource(dataSource) {
    this.dataSource = dataSource;

    this.cleanState();
    this._initStoreChangeHandlers();
  }

  _initStoreChangeHandlers() {
    const { dataSource } = this;
    const store = dataSource?.store();

    if (store) {
      store.on(STORE_EVENTS.updating, (key) => {
        const keyName = store.key();
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
        const keyName = store.key();

        pushItems.forEach((pushItem) => {
          const itemExists = items.filter((item) => item[keyName] === pushItem.key).length !== 0;

          if (itemExists) {
            this.updatedAppointmentKeys.push({
              key: keyName,
              value: pushItem.key,
            });
          } else {
            const { data } = pushItem;
            data && items.push(data);
          }
        });

        dataSource.load();
      });
    }
  }

  getUpdatedAppointment() {
    return this.updatedAppointment;
  }

  getUpdatedAppointmentKeys() {
    return this.updatedAppointmentKeys;
  }

  cleanState() {
    this.updatedAppointment = null;
    this.updatedAppointmentKeys = [];
  }

  add(rawAppointment) {
    return this.dataSource.store().insert(rawAppointment).done(() => this.dataSource.load());
  }

  update(target, data) {
    const key = this._getStoreKey(target);
    // @ts-expect-error
    const d = new Deferred();

    this.dataSource.store().update(key, data)
      .done((result) => this.dataSource.load()
        .done(() => d.resolve(result))
        .fail(d.reject))
      .fail(d.reject);

    return d.promise();
  }

  remove(rawAppointment) {
    const key = this._getStoreKey(rawAppointment);
    return this.dataSource.store().remove(key).done(() => this.dataSource.load());
  }

  destroy() {
    const store = this.dataSource?.store();

    if (store) {
      store.off(STORE_EVENTS.updating);
      store.off(STORE_EVENTS.push);
    }
  }
}
