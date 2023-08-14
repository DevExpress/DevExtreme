/* eslint-disable max-classes-per-file */
import { wrapToArray } from '@js/core/utils/array';
import { Deferred, when } from '@js/core/utils/deferred';

import {
  getDisplayExpr, getFieldExpr, getValueExpr, getWrappedDataSource,
} from './m_utils';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class PromiseItem {
  rawAppointment: any;

  promise: any;

  constructor(rawAppointment, promise) {
    this.rawAppointment = rawAppointment;
    this.promise = promise;
  }
}

export class AgendaResourceProcessor {
  _resourceDeclarations: any;

  isLoaded: boolean;

  isLoading: boolean;

  resourceMap: any;

  appointmentPromiseQueue: any[];

  get resourceDeclarations() {
    return this._resourceDeclarations;
  }

  set resourceDeclarations(value) {
    this._resourceDeclarations = value;

    this.isLoaded = false;
    this.isLoading = false;

    this.resourceMap.clear();
    this.appointmentPromiseQueue = [];
  }

  constructor(resourceDeclarations = []) {
    this._resourceDeclarations = resourceDeclarations;
    this.isLoaded = false;
    this.isLoading = false;

    this.resourceMap = new Map();
    this.appointmentPromiseQueue = [];
  }

  _pushAllResources() {
    this.appointmentPromiseQueue.forEach(({ promise, rawAppointment }) => {
      const result: any = [];

      this.resourceMap.forEach((resource, fieldName) => {
        const item = {
          label: resource.label,
          values: [] as any,
        };

        if (fieldName in rawAppointment) {
          wrapToArray(rawAppointment[fieldName])
            .forEach((value) => item.values.push(resource.map.get(value)));
        }

        if (item.values.length) {
          result.push(item);
        }
      });

      promise.resolve(result);
    });
    this.appointmentPromiseQueue = [];
  }

  _onPullResource(fieldName, valueName, displayName, label, items) {
    const map = new Map();
    items.forEach((item) => map.set(item[valueName], item[displayName]));

    this.resourceMap.set(fieldName, { label, map });
  }

  _hasResourceDeclarations(resources) {
    if (resources.length === 0) {
      this.appointmentPromiseQueue.forEach(({ promise }) => promise.resolve([]));
      this.appointmentPromiseQueue = [];

      return false;
    }

    return true;
  }

  _tryPullResources(resources, resultAsync) {
    if (!this.isLoading) {
      this.isLoading = true;
      const promises: any = [];

      resources.forEach((resource) => {
        // @ts-expect-error
        const promise = new Deferred()
          .done((items) => this._onPullResource(
            getFieldExpr(resource),
            getValueExpr(resource),
            getDisplayExpr(resource),
            resource.label,
            items,
          ));

        promises.push(promise);

        const dataSource: any = getWrappedDataSource(resource.dataSource);
        if (dataSource.isLoaded()) {
          promise.resolve(dataSource.items());
        } else {
          dataSource
            .load()
            .done((list) => promise.resolve(list))
            .fail(() => promise.reject());
        }
      });

      when.apply(null, promises)
        .done(() => {
          this.isLoaded = true;
          this.isLoading = false;

          this._pushAllResources();
        }).fail(() => resultAsync.reject());
    }
  }

  initializeState(resourceDeclarations = []) {
    this.resourceDeclarations = resourceDeclarations;
  }

  createListAsync(rawAppointment) {
    // @ts-expect-error
    const resultAsync = new Deferred();
    this.appointmentPromiseQueue.push(new PromiseItem(rawAppointment, resultAsync));

    if (this._hasResourceDeclarations(this.resourceDeclarations)) {
      if (this.isLoaded) {
        this._pushAllResources();
      } else {
        this._tryPullResources(this.resourceDeclarations, resultAsync);
      }
    }

    return resultAsync.promise();
  }
}
