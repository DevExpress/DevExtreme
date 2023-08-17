/* tslint:disable:component-selector */

import { Component, PLATFORM_ID } from '@angular/core';

import { isPlatformServer } from '@angular/common';

import { DxServerTransferStateModule } from 'devextreme-angular';

import { DxServerModule } from 'devextreme-angular/server';

import { Deferred } from 'devextreme/core/utils/deferred';
import ajax from 'devextreme/core/utils/ajax';

import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { BrowserModule, TransferState, makeStateKey, BrowserTransferStateModule } from '@angular/platform-browser';

import {
    TestBed
} from '@angular/core/testing';

let mockSendRequest = {
    callBase: function() {
        let d = (Deferred as any)();
        d.resolve('test', 'success');

        return d.promise();
    }
};

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
}

describe('Universal', () => {
    let sendRequest: any;
    let ajaxInject = ajax.inject;
    beforeEach(() => {
        ajax.inject = function(obj) {
            sendRequest = obj['sendRequest'];

        };
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [
                    DxServerModule,
                    ServerModule,
                    DxServerTransferStateModule,
                    ServerTransferStateModule,
                    BrowserTransferStateModule,
                    BrowserModule.withServerTransition({appId: 'appid'})]
            });
    });

    afterEach(function() {
        ajax.inject = ajaxInject;
    });
    // spec
    it('should set state and remove data from the state when the request is repeated', () => {
        const platformId = TestBed.get(PLATFORM_ID);
        if (isPlatformServer(platformId)) {
            sendRequest.apply(mockSendRequest, [{url: 'someurl'}]);
            const transferState: TransferState = TestBed.get(TransferState);
            let key = makeStateKey('0urlsomeurl');

            expect(transferState.hasKey(key)).toBe(true);
            expect(transferState.get(key, null as any)).toEqual(Object({ data: 'test', status: 'success' }));
        }
    });

    it('should generate complex key', () => {
        const platformId = TestBed.get(PLATFORM_ID);
        if (isPlatformServer(platformId)) {
            sendRequest.apply(mockSendRequest, [{url: 'someurl', data: { filter: { name: 'test'}, select: ['name']}}]);
            let key = makeStateKey('0urlsomeurldatafilternametestselect0name');
            const transferState: TransferState = TestBed.get(TransferState);

            expect(transferState.hasKey(key)).toBe(true);
        }
    });

});
