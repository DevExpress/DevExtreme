/* tslint:disable:component-selector */

import {
    Component,
    ElementRef,
    ViewChild,
    NgZone,
    PLATFORM_ID,
    Inject
} from '@angular/core';

import { TransferState } from '@angular/platform-browser';
import { BrowserTransferStateModule } from '@angular/platform-browser';

import {
    TestBed
} from '@angular/core/testing';

import {
    DxComponentExtension,
    DxTemplateHost,
    WatcherHelper
} from 'devextreme-angular';

import DxButton from 'devextreme/ui/button';
let DxTestExtension = DxButton;

DxTestExtension.defaultOptions({
    options: {
        elementAttr: { class: 'dx-test-extension' }
    }
});

@Component({
    selector: 'dx-test-extension',
    template: '',
    providers: [DxTemplateHost, WatcherHelper]
})
export class DxTestExtensionComponent extends DxComponentExtension {
    constructor(elementRef: ElementRef,
        ngZone: NgZone,
        templateHost: DxTemplateHost,
        _watcherHelper: WatcherHelper,
        transferState: TransferState,
        @Inject(PLATFORM_ID) platformId: any) {
        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
    }

    protected _createInstance(element, options) {
        return new DxTestExtension(element, options);
    }
}

@Component({
    selector: 'test-container-component',
    template: ''
})
export class TestContainerComponent {
    @ViewChild(DxTestExtensionComponent) innerWidget: DxTestExtensionComponent;
}


describe('DevExtreme Angular component extension', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                imports: [BrowserTransferStateModule],
                declarations: [TestContainerComponent, DxTestExtensionComponent]
            });
    });

    function getWidget(element) {
        return DxTestExtension.getInstance(element);
    }
    // spec
    it('should not create widget instance by itself', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-extension></dx-test-extension>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture.nativeElement);
        expect(instance).toBe(undefined);
    });

    it('should instantiate widget with the createInstance() method', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-test-extension></dx-test-extension>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let outerComponent = fixture.componentInstance,
            innerComponent = outerComponent.innerWidget,
            targetElement = document.createElement('div');

        innerComponent.createInstance(targetElement);
        let instance = getWidget(targetElement);
        expect(instance).not.toBe(undefined);
        expect(innerComponent.instance).not.toBe(undefined);
    });

});
