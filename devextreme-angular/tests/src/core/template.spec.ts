/* tslint:disable:component-selector */

import {
    Component,
    ElementRef,
    EventEmitter,
    ViewChild,
    NgZone,
    Input,
    Output,
    AfterViewInit,
    PLATFORM_ID,
    Inject
} from '@angular/core';

import { TransferState } from '@angular/platform-browser';
import { BrowserTransferStateModule } from '@angular/platform-browser';

import {
    TestBed
} from '@angular/core/testing';

import {
    DxComponent,
    DxTemplateHost,
    DxTemplateModule,
    DxTemplateDirective,
    WatcherHelper
} from 'devextreme-angular';

// TODO: Try to replace dxButton to Widget ('require' required)
import DxButton from 'devextreme/ui/button';
let DxTestWidget = DxButton;
DxTestWidget.defaultOptions({
    options: {
        elementAttr: { class: 'dx-test-widget' }
    }
});

@Component({
    selector: 'dx-test-widget',
    template: '',
    providers: [DxTemplateHost, WatcherHelper]
})
export class DxTestWidgetComponent extends DxComponent {
    @Input()
    get testTemplate(): any {
        return this._getOption('testTemplate');
    }
    set testTemplate(value: any) {
        this._setOption('testTemplate', value);
    };

    @Output() onOptionChanged = new EventEmitter<any>();
    @Output() testTemplateChange = new EventEmitter<any>();

    constructor(elementRef: ElementRef,
        ngZone: NgZone,
        templateHost: DxTemplateHost,
        _watcherHelper: WatcherHelper,
        transferState: TransferState,
        @Inject(PLATFORM_ID) platformId: any) {
        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'initialized', emit: 'onInitialized' }
        ]);
    }

    protected _createInstance(element, options) {
        return new DxTestWidget(element, options);
    }
}

@Component({
    selector: 'dx-test',
    template: '',
    providers: [DxTemplateHost, WatcherHelper]
})
export class DxTestComponent extends DxComponent implements AfterViewInit {
    templates: DxTemplateDirective[];

    constructor(elementRef: ElementRef,
        ngZone: NgZone,
        templateHost: DxTemplateHost,
        _watcherHelper: WatcherHelper,
        transferState: TransferState,
        @Inject(PLATFORM_ID) platformId: any) {
        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
    }

    protected _createInstance(element, options) {
        return new DxTestWidget(element, options);
    }

    renderTemplate(model) {
        const element = this.element.nativeElement;
        element.textContent = '';
        this.templates[0].render({
            model: model,
            container: element,
            index: 5
        });
    }

    ngAfterViewInit() {
        this.renderTemplate({
            value: () => ''
        });
    }
}

@Component({
    selector: 'test-container-component',
    template: '',
    providers: [DxTemplateHost]
})
export class TestContainerComponent {
    @ViewChild(DxTestWidgetComponent) widget: DxTestWidgetComponent;
    @ViewChild(DxTestComponent) testComponent: DxTestComponent;

    @Output() onInnerElementClicked = new EventEmitter<any>();

    testFunction() {
        this.onInnerElementClicked.next();
    }
}


describe('DevExtreme Angular widget\'s template', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent, DxTestWidgetComponent, DxTestComponent],
                imports: [DxTemplateModule, BrowserTransferStateModule]
            });
    });

    // spec
    it('should initialize named templates #17', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
            <dx-test-widget>
                <div *dxTemplate="let d of 'templateName'">Template content</div>
            </dx-test-widget>
           `}
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = fixture.componentInstance.widget.instance,
            templatesHash = instance.option('integrationOptions.templates');

        expect(templatesHash['templateName']).not.toBeUndefined();
        expect(typeof templatesHash['templateName'].render).toBe('function');

    });


    it('should add template wrapper class as template has root container', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
            <dx-test-widget testTemplate="templateName">
                <div *dxTemplate="let d of 'templateName'">Template content: {{d}}</div>
            </dx-test-widget>
           `}
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            innerComponent = testComponent.widget,
            templatesHash = innerComponent.instance.option('integrationOptions.templates'),
            template = innerComponent.testTemplate,
            container = document.createElement('div');

        expect(template).not.toBeUndefined;

        templatesHash[template].render({ container: container });
        fixture.detectChanges();

        expect(container.children[0].classList.contains('dx-template-wrapper')).toBe(true);

    });

    it('should have item index', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
            <dx-test>
                <div *dxTemplate="let d of 'templateName'; let i = index">index: {{i}}</div>
            </dx-test>
           `}
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let element = fixture.nativeElement.querySelector('div');
        expect(element.textContent).toBe('index: 5');
    });

    it('should be created within Angular Zone', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
            <dx-test>
                <div *dxTemplate="let d of 'templateName'">
                    <div class="elem" (click)="d.value()"></div>
                </div>
            </dx-test>
           `}
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        fixture.ngZone.runOutsideAngular(() => {
            fixture.componentInstance.testComponent.renderTemplate({
                value: () => {
                    expect(fixture.ngZone.isStable).toBe(false);
                }
            });
        });

        fixture.nativeElement.querySelector('.elem').click();
    });
});

