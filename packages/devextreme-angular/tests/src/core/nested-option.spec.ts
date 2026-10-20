/* tslint:disable:component-selector */
import {
  Component,
  ElementRef,
  EventEmitter,
  ViewChild,
  NgZone,
  Input,
  Renderer2,
  Inject,
  Output,
  ContentChildren,
  QueryList,
  Host,
  SkipSelf,
  AfterViewInit,
  PLATFORM_ID,
  TransferState,
} from '@angular/core';

import { DOCUMENT } from '@angular/common';

import {
  TestBed,
  ComponentFixture,
} from '@angular/core/testing';

import {
  WatcherHelper,
  DxComponent,
  DxTemplateHost,
  NestedOption,
  CollectionNestedOption,
  NestedOptionHost,
  extractTemplate,
} from 'devextreme-angular';

import { on } from 'devextreme/events';

// TODO: Try to replace dxButton to Widget ('require' required)
import DxButton from 'devextreme/ui/button';

const DxTestWidget = DxButton;
DxTestWidget.defaultOptions({
  options: {
    elementAttr: { class: 'dx-test-widget' },
  },
});

@Component({
  standalone: false,
  selector: 'dxo-test-option',
  template: '',
  providers: [NestedOptionHost],
})
export class DxoTestOptionComponent extends NestedOption {
  @Input()
  get testNestedOption() {
    return this._getOption('testNestedOption');
  }

  set testNestedOption(value: any) {
    this._setOption('testNestedOption', value);
  }

  @Output() testNestedOptionChange: EventEmitter<any>;

  protected get _optionPath() {
    return 'testOption';
  }

  constructor(@SkipSelf() @Host() private readonly _pnoh: NestedOptionHost, @Host() private readonly _noh: NestedOptionHost) {
    super();

    this._createEventEmitters([
      { emit: 'testNestedOptionChange' },
    ]);

    this._pnoh.setNestedOption(this);
    this._noh.setHost(this);
  }
}

@Component({
  standalone: false,
  selector: 'dxi-test-collection-option',
  template: '',
  providers: [NestedOptionHost],
})
export class DxiTestCollectionOptionComponent extends CollectionNestedOption {
  @Input()
  get testOption() {
    return this._getOption('testOption');
  }

  set testOption(value: any) {
    this._setOption('testOption', value);
  }

  @Output() testOptionChange: EventEmitter<any>;

  protected get _optionPath() {
    return 'testCollectionOption';
  }

  constructor(@SkipSelf() @Host() private readonly _pnoh: NestedOptionHost, @Host() private readonly _noh: NestedOptionHost) {
    super();

    this._createEventEmitters([
      { emit: 'testOptionChange' },
    ]);

    this._pnoh.setNestedOption(this);
    this._noh.setHost(this, this._fullOptionPath.bind(this));
  }
}

@Component({
  standalone: false,
  selector: 'dxi-test-collection-option-with-template',
  template: '<ng-content></ng-content>',
  providers: [NestedOptionHost],
})
export class DxiTestCollectionOptionWithTemplateComponent extends CollectionNestedOption implements AfterViewInit {
  protected get _optionPath() {
    return 'testCollectionOptionWithTemplate';
  }

  get template() {
    return this._getOption('template');
  }

  set template(value: any) {
    this._setOption('template', value);
  }

  shownEventFired = false;

  constructor(
    @SkipSelf() @Host() private readonly _pnoh: NestedOptionHost,
    @Host() private readonly _noh: NestedOptionHost,
    private readonly element: ElementRef,
    private readonly renderer: Renderer2,
    @Inject(DOCUMENT) private readonly document: any,
  ) {
    super();

    this._pnoh.setNestedOption(this);
    this._noh.setHost(this, this._fullOptionPath.bind(this));
  }

  ngAfterViewInit() {
    const element = this.element.nativeElement;

    extractTemplate(this, this.element, this.renderer, this.document);

    element.classList.add('dx-visibility-change-handler');
    on(element, 'dxshown', () => {
      this.shownEventFired = true;
    });

    this.template.render({
      container: document.querySelector('dx-test-widget'),
    });
  }
}

@Component({
  standalone: false,
  selector: 'dx-test-widget',
  template: '',
  providers: [DxTemplateHost, NestedOptionHost, WatcherHelper],
})
export class DxTestWidgetComponent extends DxComponent {
  @Input()
  get testOption(): any {
    return this._getOption('testOption');
  }

  set testOption(value: any) {
    this._setOption('testOption', value);
  }

  @Input()
  get testCollectionOption(): any {
    return this._getOption('testCollectionOption');
  }

  set testCollectionOption(value: any) {
    this._setOption('testCollectionOption', value);
  }

  @Input()
  get testCollectionOptionWithTemplate(): any {
    return this._getOption('testCollectionOptionWithTemplate');
  }

  set testCollectionOptionWithTemplate(value: any) {
    this._setOption('testCollectionOptionWithTemplate', value);
  }

  @ContentChildren(DxiTestCollectionOptionComponent)
  get testCollectionOptionChildren(): QueryList<DxiTestCollectionOptionComponent> {
    return this._getOption('testCollectionOption');
  }

  set testCollectionOptionChildren(value) {
    this.setChildren('testCollectionOption', value);
  }

  @ContentChildren(DxiTestCollectionOptionWithTemplateComponent)
  get testCollectionOptionWithTemplateChildren(): QueryList<DxiTestCollectionOptionWithTemplateComponent> {
    return this._getOption('testCollectionOptionWithTemplate');
  }

  set testCollectionOptionWithTemplateChildren(value) {
    this.setChildren('testCollectionOptionWithTemplate', value);
  }

  @ContentChildren(DxiTestCollectionOptionWithTemplateComponent)
  testCollectionOptionWithTemplateChildrens: QueryList<DxiTestCollectionOptionWithTemplateComponent>;

  @Output() onOptionChanged = new EventEmitter<any>();

  @Output() testOptionChange = new EventEmitter<any>();

  @Output() testCollectionOptionChange = new EventEmitter<any>();

  @Output() testCollectionOptionWithTemplateChange = new EventEmitter<any>();

  constructor(
    elementRef: ElementRef,
    ngZone: NgZone,
    templateHost: DxTemplateHost,
    private readonly _noh: NestedOptionHost,
    _watcherHelper: WatcherHelper,
    transferState: TransferState,
    @Inject(PLATFORM_ID) platformId: any,
  ) {
    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

    this._noh.setHost(this);
  }

  protected _createInstance(element, options) {
    return new DxTestWidget(element, options);
  }
}

@Component({
  standalone: false,
  selector: 'test-container-component',
  template: '',
})
export class TestContainerComponent {
  testOption: string;

  @ViewChild(DxTestWidgetComponent) innerWidget: DxTestWidgetComponent;

  testMethod() {}
}

describe('DevExtreme Angular widget', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        imports: [],
        declarations: [
          TestContainerComponent,
          DxTestWidgetComponent,
          DxoTestOptionComponent,
          DxiTestCollectionOptionComponent,
          DxiTestCollectionOptionWithTemplateComponent,
        ],
      },
    );
  });

  function getWidget(fixture: ComponentFixture<TestContainerComponent>) {
    return fixture.componentInstance.innerWidget.instance;
  }

  // spec
  it('option should be initially setted', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-test-widget><dxo-test-option testNestedOption="test"></dxo-test-option></dx-test-widget>',
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const instance = getWidget(fixture);

    expect(instance.option('testOption')).toEqual({ testNestedOption: 'test' });
  });

  it('option should be setted dynamically', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-test-widget><dxo-test-option [testNestedOption]="testOption"></dxo-test-option></dx-test-widget>',
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const instance = getWidget(fixture);

    testComponent.testOption = 'text';
    fixture.detectChanges();

    expect(instance.option('testOption')).toEqual({ testNestedOption: 'text' });
  });

  it('nested option should update their nested options', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-test-widget>
                        <dxi-test-collection-option>
                            <dxo-test-option [testNestedOption]="testOption">
                            </dxo-test-option>
                        </dxi-test-collection-option>
                    </dx-test-widget>
                `,
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const instance = getWidget(fixture);

    expect(instance.option('testCollectionOption')[0].testOption).toEqual({ testNestedOption: undefined });

    testComponent.testOption = 'text';
    fixture.detectChanges();

    expect(instance.option('testCollectionOption')[0].testOption).toEqual({ testNestedOption: 'text' });
  });

  it('nested option should emit change event', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-test-widget>
                        <dxo-test-option
                            [(testNestedOption)]='testOption'
                            (testNestedOptionChange)='testMethod()'>
                        </dxo-test-option>
                    </dx-test-widget>
                `,
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const instance = getWidget(fixture);
    const testSpy = spyOn(testComponent, 'testMethod');

    instance.option('testOption.testNestedOption', 'new value');
    fixture.detectChanges();
    expect(testSpy).toHaveBeenCalledTimes(1);
  });

  it('collection nested option should emit change event', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-test-widget>
                        <dxi-test-collection-option
                            [(testOption)]='testOption'
                            (testOptionChange)='testMethod()'>
                        </dxi-test-collection-option>
                    </dx-test-widget>
                `,
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const instance = getWidget(fixture);
    const testSpy = spyOn(testComponent, 'testMethod');

    instance.option('testCollectionOption[0].testOption', 'new value');
    fixture.detectChanges();
    expect(testSpy).toHaveBeenCalledTimes(1);
  });

  it('method template.render of nested option should trigger shownEvent after rendering', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-test-widget>
                        <dxi-test-collection-option-with-template>
                            <div>123</div>
                        </dxi-test-collection-option-with-template>
                    </dx-test-widget>
                `,
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const { innerWidget } = fixture.componentInstance;
    const nestedOption = innerWidget.testCollectionOptionWithTemplateChildrens.first;

    expect(nestedOption.shownEventFired).toBe(true);
  });
});
