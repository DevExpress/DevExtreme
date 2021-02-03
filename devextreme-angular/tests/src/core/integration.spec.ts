import { NgModule, NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import * as domAdapter from 'devextreme/core/dom_adapter';
import { DxIntegrationModule } from 'devextreme-angular/core';

@NgModule({
    imports: [
        DxIntegrationModule
    ]
})
class SingletonModule {
    constructor(ngZone: NgZone) {
        new DxIntegrationModule({}, ngZone, null);
    }
}

describe('Integration module', () => {
    it('domAdapter should be injected once', () => {
        const spy = spyOn(domAdapter, 'inject').and.callThrough();

        TestBed.configureTestingModule({
            imports: [ SingletonModule ]
        });
        TestBed.get(SingletonModule);

        expect(spy.calls.count()).toBe(1);
    });
});
