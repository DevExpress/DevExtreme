/* tslint:disable:component-selector */
import {
  Component,
  ElementRef,
  EventEmitter,
  ViewChild,
  NgZone,
  Input,
  Output,
  OnDestroy,
  PLATFORM_ID,
  Inject,
  TransferState,
} from '@angular/core';

import {
  TestBed,
  ComponentFixture,
  ComponentFixtureAutoDetect,
} from '@angular/core/testing';

import {
  DxComponent,
  DxTemplateHost,
  WatcherHelper,
} from 'devextreme-angular';

import config from 'devextreme/core/config';
// TODO: Try to replace dxButton to Widget ('require' required)
import dxButton from 'devextreme/ui/button';

const DxTestWidget = dxButton;

DxTestWidget.defaultOptions({
  options: {
    text: 'test text',
    elementAttr: { class: 'dx-test-widget' },
  },
});

@Component({
  standalone: false,
  selector: 'dx-test-widget',
  template: '',
  providers: [DxTemplateHost, WatcherHelper],
})
export class DxTestWidgetComponent extends DxComponent implements OnDestroy {
  @Input()
  get testOption(): any {
    return this._getOption('testOption');
  }

  set testOption(value: any) {
    this._setOption('testOption', value);
  }

  @Input()
  get text(): any {
    return this._getOption('text');
  }

  set text(value: any) {
    this._setOption('text', value);
  }

  @Output() onOptionChanged = new EventEmitter<any>();

  @Output() onInitialized = new EventEmitter<any>();

  @Output() onDisposing = new EventEmitter<any>();

  @Output() onContentReady = new EventEmitter<any>();

  @Output() testOptionChange = new EventEmitter<any>();

  @Output() textChange = new EventEmitter<any>();

  constructor(
    elementRef: ElementRef,
    ngZone: NgZone,
    templateHost: DxTemplateHost,
    _watcherHelper: WatcherHelper,
    transferState: TransferState,
    @Inject(PLATFORM_ID) platformId: any,
  ) {
    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

    this._createEventEmitters([
      { subscribe: 'optionChanged', emit: 'onOptionChanged' },
      { subscribe: 'initialized', emit: 'onInitialized' },
      { subscribe: 'disposing', emit: 'onDisposing' },
      { subscribe: 'contentReady', emit: 'onContentReady' },
      { emit: 'testOptionChange' },
      { emit: 'textChange' },
    ]);
  }

  protected _createInstance(element, options) {
    return new DxTestWidget(element, options);
  }

  ngOnDestroy() {
    this._destroyWidget();
  }
}

@Component({
  standalone: false,
  selector: 'test-container-component',
  template: '',
})
export class TestContainerComponent {
  visible = true;

  testOption: string;

  onStableCallCount = 0;

  @ViewChild(DxTestWidgetComponent) innerWidget: DxTestWidgetComponent;

  constructor(ngZone: NgZone) {
    ngZone.onStable.subscribe(() => {
      this.onStableCallCount++;
    });
  }

  testMethod() {
  }
}

describe('DevExtreme Angular widget', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        imports: [],
        declarations: [TestContainerComponent, DxTestWidgetComponent],
      },
    );
  });

  function getWidget(fixture: ComponentFixture<TestContainerComponent>) {
    return fixture.componentInstance.innerWidget.instance;
  }

  // spec
  it('should be rendered', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-test-widget [testOption]="\'Test Value\'" > </dx-test-widget>',
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const element = getWidget(fixture).element();

    expect(element.classList).toContain('dx-test-widget');
  });

  it('correctly sets the buy now link', () => {
    expect(config().buyNowLink).toBe('https://go.devexpress.com/Licensing_Installer_Watermark_DevExtremeAngular.aspx');
  });

  it('correctly sets the help link', () => {
    expect(config().licensingDocLink).toBe('https://www.devexpress.com/go/Licensing_Documentation_DevExpress_Angular.aspx');
  });

  it('should be disposed', () => {
    const testSpy = spyOn(TestContainerComponent.prototype, 'testMethod');

    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-test-widget *ngIf="visible" (onDisposing)="testMethod()"></dx-test-widget>',
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    fixture.componentInstance.visible = false;
    fixture.detectChanges();

    expect(testSpy).toHaveBeenCalledTimes(1);
  });

  it('should set testOption value to insatnce', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-test-widget [testOption]="\'Test Value\'" > </dx-test-widget>',
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const outerComponent = fixture.componentInstance;
    const innerComponent = outerComponent.innerWidget;
    const instance = getWidget(fixture);

    expect(instance.option('testOption')).toBe('Test Value');
    expect(innerComponent.testOption).toBe('Test Value');
  });

  it('should emit testOptionChange event', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-test-widget [testOption]="\'Test Value\'" (testOptionChange)="testMethod()"></dx-test-widget>',
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const instance = getWidget(fixture);
    const testSpy = spyOn(component, 'testMethod');

    instance.option('testOption', 'new value');
    fixture.detectChanges();
    expect(testSpy).toHaveBeenCalledTimes(1);
  });

  it('should change component option value', () => {
    const fixture = TestBed.createComponent(DxTestWidgetComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const { instance } = component;

    instance.option('testOption', 'Changed');
    expect(component.testOption).toBe('Changed');
  });

  it('should change instance option value', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-test-widget [testOption]="testOption"></dx-test-widget>',
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const instance = getWidget(fixture);

    testComponent.testOption = 'Changed 2';
    fixture.detectChanges();
    expect(instance.option('testOption')).toBe('Changed 2');
  });

  it('should change instance option value by component option setter', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-test-widget [testOption]="testOption"></dx-test-widget>',
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance.innerWidget;
    const instance = getWidget(fixture);

    testComponent.testOption = 'Changed 2';
    fixture.detectChanges();
    expect(instance.option('testOption')).toBe('Changed 2');
  });

  it('should fire optionChanged event', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-test-widget [testOption]="testOption" (onOptionChanged)="testMethod()"></dx-test-widget>',
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const instance = getWidget(fixture);

    const testSpy = spyOn(testComponent, 'testMethod');
    testComponent.testOption = 'Changed 2';
    fixture.detectChanges();
    expect(instance.option('testOption')).toBe('Changed 2');
    expect(testSpy).toHaveBeenCalledTimes(1);
  });

  it('should fire onInitialized event', () => {
    const testSpy = spyOn(TestContainerComponent.prototype, 'testMethod');
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-test-widget (onInitialized)="testMethod()"></dx-test-widget>',
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();
    expect(testSpy).toHaveBeenCalledTimes(1);
  });

  it('should fire onContentReady event', () => {
    const testSpy = spyOn(TestContainerComponent.prototype, 'testMethod');
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-test-widget (onContentReady)="testMethod()"></dx-test-widget>',
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();
    expect(testSpy).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe events', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-test-widget></dx-test-widget>',
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const instance = getWidget(fixture);
    const spy = jasmine.createSpy('spy');

    instance.on('optionChanged', spy);
    instance.off('optionChanged', spy);

    instance.option('testOption', 'new value');
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should unsubscribe all events', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-test-widget></dx-test-widget>',
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const instance = getWidget(fixture);
    const spy = jasmine.createSpy('spy');

    instance.on('optionChanged', spy);
    instance.off('optionChanged');

    instance.option('testOption', 'new value');
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should have correct context in events', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-test-widget></dx-test-widget>',
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const instance = getWidget(fixture);

    instance.on('optionChanged', function () {
      expect(this).toBe(instance);
    });
    instance.option('testOption', 'new value');
  });

  it('should fire unknown subscribed events', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-test-widget></dx-test-widget>',
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const instance = getWidget(fixture);

    instance.on('unknownEvent', function () {
      expect(this).toBe(instance);
    });

    // NOTE: This fix was made to avoid this change https://github.com/DevExpress/DevExtreme/pull/10894
    // TODO: Clean up after the first devextreme@20.1-unstable package will be published and 19.2 branch wll be forked
    if (instance.fireEvent) {
      instance.fireEvent('unknownEvent');
    } else {
      instance._eventsStrategy.fireEvent('unknownEvent');
    }
  });

  it('ngZone onStable should not called recursively (T551347)', () => {
    TestBed.configureTestingModule(
      {
        declarations: [TestContainerComponent, DxTestWidgetComponent],
        providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
      },
    );
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-test-widget></dx-test-widget>
                    <dx-test-widget></dx-test-widget>
                    <dx-test-widget></dx-test-widget>
                `,
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);

    expect(fixture.componentInstance.onStableCallCount).toBe(1);

    fixture.autoDetectChanges(false);
  });

  it('should not be failed when two-way binding in markup is used for ininitial option', () => {
    TestBed.configureTestingModule(
      {
        declarations: [TestContainerComponent, DxTestWidgetComponent],
        providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
      },
    );
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-test-widget #widget></dx-test-widget>
                    <div id="test">{{widget.text}}</div>
                `,
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);

    expect(document.getElementById('test').innerText).toBe('test text');
    fixture.autoDetectChanges(false);
  });
});
