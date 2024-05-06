import {
  PLATFORM_ID,
  Inject,
  NgModule,
  TransferState,
  makeStateKey,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import ajax from 'devextreme/core/utils/ajax';
import { Deferred } from 'devextreme/core/utils/deferred';

@NgModule({})

export class DxServerTransferStateModule {
  constructor(private readonly state: TransferState, @Inject(PLATFORM_ID) private readonly platformId: any) {
    const that = this;

    ajax.inject({
      sendRequest(...args) {
        const key = makeStateKey(that.generateKey(args));
        const cachedData = that.state.get(key, null as any);

        if (isPlatformServer(that.platformId)) {
          const result = this.callBase.apply(this, args);
          result.always((data, status) => {
            const dataForCache = {
              data,
              status,
            };
            that.state.set(key, dataForCache as any);
          });
          return result;
        }
        if (cachedData) {
          const d = (Deferred as any)();
          d.resolve(cachedData.data, cachedData.status);
          that.state.set(key, null as any);

          return d.promise();
        }
        return this.callBase.apply(this, args);
      },
    });
  }

  generateKey(args) {
    let keyValue = '';
    for (const key in args) {
      if (typeof args[key] === 'object') {
        const objKey = this.generateKey(args[key]);
        keyValue += key + objKey;
      } else {
        keyValue += key + args[key];
      }
    }

    return keyValue;
  }
}
