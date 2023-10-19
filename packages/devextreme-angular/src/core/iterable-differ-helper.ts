import {
  Injectable,
  SimpleChanges,
  IterableDiffers,
} from '@angular/core';

import {
  DxComponent,
} from './component';

@Injectable()
export class IterableDifferHelper {
  private _host: DxComponent;

  private _propertyDiffers: { [id: string]: any } = {};

  constructor(private readonly _differs: IterableDiffers) { }

  setHost(host: DxComponent) {
    this._host = host;
  }

  setup(prop: string, changes: SimpleChanges) {
    if (prop in changes) {
      const value = changes[prop].currentValue;
      this.setupSingle(prop, value);
    }
  }

  setupSingle(prop: string, value: any) {
    if (value && Array.isArray(value)) {
      if (!this._propertyDiffers[prop]) {
        try {
          this._propertyDiffers[prop] = this._differs.find(value).create(null);
          return true;
        } catch (e) { }
      }
    } else {
      delete this._propertyDiffers[prop];
    }

    return false;
  }

  getChanges(prop: string, value: any) {
    if (this._propertyDiffers[prop]) {
      return this._propertyDiffers[prop].diff(value);
    }
  }

  checkChangedOptions(propName: string, hostValue: any) {
    return this._host.changedOptions[propName] === hostValue;
  }

  doCheck(prop: string) {
    const hostValue = this._host.instance && this._host[prop];
    const typeOfValueOrFalse = hostValue && typeof hostValue;

    if (typeOfValueOrFalse && (typeOfValueOrFalse === 'function' || typeOfValueOrFalse === 'object') && this._propertyDiffers[prop]) {
      const changes = this.getChanges(prop, hostValue);

      if (changes && !this.checkChangedOptions(prop, hostValue)) {
        this._host.lockWidgetUpdate();
        this._host.instance.option(prop, hostValue);
      }
    }
  }
}
