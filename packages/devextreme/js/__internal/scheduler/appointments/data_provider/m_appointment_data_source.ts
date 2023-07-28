import { Deferred } from '../../../../core/utils/deferred';

const STORE_EVENTS = {
  updating: 'updating',
  push: 'push',
};

export class AppointmentDataSource {
  _updatedAppointmentKeys: any[];

  _dataSource: any;

  _updatedAppointment: any;

  constructor(dataSource) {
    this.setDataSource(dataSource);
    this._updatedAppointmentKeys = [];
  }

  get keyName() {
    const store = this._dataSource.store();
    return store.key();
  }

  get isDataSourceInit() {
    return !!this._dataSource;
  }

  _getStoreKey(target) {
    const store = this._dataSource.store();

    return store.keyOf(target);
  }

  setDataSource(dataSource) {
    this._dataSource = dataSource;

    this.cleanState();
    this._initStoreChangeHandlers();
  }

  _initStoreChangeHandlers() {
    const dataSource = this._dataSource;
    const store = dataSource?.store();

    if (store) {
      store.on(STORE_EVENTS.updating, (key) => {
        const keyName = store.key();
        if (keyName) {
          this._updatedAppointmentKeys.push({
            key: keyName,
            value: key,
          });
        } else {
          this._updatedAppointment = key;
        }
      });

      store.on(STORE_EVENTS.push, (pushItems) => {
        const items = dataSource.items();
        const keyName = store.key();

        pushItems.forEach((pushItem) => {
          const itemExists = items.filter((item) => item[keyName] === pushItem.key).length !== 0;

          if (itemExists) {
            this._updatedAppointmentKeys.push({
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
    return this._updatedAppointment;
  }

  getUpdatedAppointmentKeys() {
    return this._updatedAppointmentKeys;
  }

  cleanState() {
    this._updatedAppointment = null;
    this._updatedAppointmentKeys = [];
  }

  add(rawAppointment) {
    return this._dataSource.store().insert(rawAppointment).done(() => this._dataSource.load());
  }

  update(target, data) {
    const key = this._getStoreKey(target);
    // @ts-expect-error
    const d = new Deferred();

    this._dataSource.store().update(key, data)
      .done((result) => this._dataSource.load()
        .done(() => d.resolve(result))
        .fail(d.reject))
      .fail(d.reject);

    return d.promise();
  }

  remove(rawAppointment) {
    const key = this._getStoreKey(rawAppointment);
    return this._dataSource.store().remove(key).done(() => this._dataSource.load());
  }

  destroy() {
    const store = this._dataSource?.store();

    if (store) {
      store.off(STORE_EVENTS.updating);
      store.off(STORE_EVENTS.push);
    }
  }
}
