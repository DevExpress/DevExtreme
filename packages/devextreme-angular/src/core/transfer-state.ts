import { PLATFORM_ID, Inject, NgModule } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import ajax from 'devextreme/core/utils/ajax';
import { Deferred } from 'devextreme/core/utils/deferred';
import { TransferState, makeStateKey } from '@angular/platform-browser';

@NgModule({})

export class DxServerTransferStateModule {
    constructor(private state: TransferState, @Inject(PLATFORM_ID) private platformId: any) {
        let that = this;

        ajax.inject({
            sendRequest: function(...args) {
                let key = makeStateKey(that.generateKey(args)),
                    cachedData = that.state.get(key, null as any);

                if (isPlatformServer(that.platformId)) {
                    let result = this.callBase.apply(this, args);
                    result.always((data, status) => {
                        let dataForCache = {
                            data: data,
                            status: status
                        };
                        that.state.set(key, dataForCache as any);
                    });
                    return result;
                } else {
                    if (cachedData) {
                        let d = (Deferred as any)();
                        d.resolve(cachedData.data, cachedData.status);
                        that.state.set(key, null as any);

                        return d.promise();
                    }
                    return this.callBase.apply(this, args);
                }
            }
        });
    }

    generateKey(args) {
        let keyValue = '';
        for (let key in args) {
            if (typeof args[key] === 'object') {
                let objKey = this.generateKey(args[key]);
                keyValue += key + objKey;
            } else {
                keyValue += key + args[key];
            }
        }

        return keyValue;
    }
 }
