"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AgendaResourceProcessor = void 0;
var _array = require("../../../core/utils/array");
var _deferred = require("../../../core/utils/deferred");
var _m_utils = require("./m_utils");
/* eslint-disable max-classes-per-file */

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class PromiseItem {
  constructor(rawAppointment, promise) {
    this.rawAppointment = rawAppointment;
    this.promise = promise;
  }
}
class AgendaResourceProcessor {
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
  constructor() {
    let resourceDeclarations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    this._resourceDeclarations = resourceDeclarations;
    this.isLoaded = false;
    this.isLoading = false;
    this.resourceMap = new Map();
    this.appointmentPromiseQueue = [];
  }
  _pushAllResources() {
    this.appointmentPromiseQueue.forEach(_ref => {
      let {
        promise,
        rawAppointment
      } = _ref;
      const result = [];
      this.resourceMap.forEach((resource, fieldName) => {
        const item = {
          label: resource.label,
          values: []
        };
        if (fieldName in rawAppointment) {
          (0, _array.wrapToArray)(rawAppointment[fieldName]).forEach(value => item.values.push(resource.map.get(value)));
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
    items.forEach(item => map.set(item[valueName], item[displayName]));
    this.resourceMap.set(fieldName, {
      label,
      map
    });
  }
  _hasResourceDeclarations(resources) {
    if (resources.length === 0) {
      this.appointmentPromiseQueue.forEach(_ref2 => {
        let {
          promise
        } = _ref2;
        return promise.resolve([]);
      });
      this.appointmentPromiseQueue = [];
      return false;
    }
    return true;
  }
  _tryPullResources(resources, resultAsync) {
    if (!this.isLoading) {
      this.isLoading = true;
      const promises = [];
      resources.forEach(resource => {
        // @ts-expect-error
        const promise = new _deferred.Deferred().done(items => this._onPullResource((0, _m_utils.getFieldExpr)(resource), (0, _m_utils.getValueExpr)(resource), (0, _m_utils.getDisplayExpr)(resource), resource.label, items));
        promises.push(promise);
        const dataSource = (0, _m_utils.getWrappedDataSource)(resource.dataSource);
        if (dataSource.isLoaded()) {
          promise.resolve(dataSource.items());
        } else {
          dataSource.load().done(list => promise.resolve(list)).fail(() => promise.reject());
        }
      });
      _deferred.when.apply(null, promises).done(() => {
        this.isLoaded = true;
        this.isLoading = false;
        this._pushAllResources();
      }).fail(() => resultAsync.reject());
    }
  }
  initializeState() {
    let resourceDeclarations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    this.resourceDeclarations = resourceDeclarations;
  }
  createListAsync(rawAppointment) {
    // @ts-expect-error
    const resultAsync = new _deferred.Deferred();
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
exports.AgendaResourceProcessor = AgendaResourceProcessor;