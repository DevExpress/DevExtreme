import {
    Component,
    ElementRef,
    NgZone,
    QueryList,
    SimpleChanges,
    PLATFORM_ID,
    Inject,
    EventEmitter,

    OnChanges,
    OnInit,
    DoCheck,
    AfterContentChecked,
    AfterViewInit
} from '@angular/core';

import { isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/platform-browser';

import { DxTemplateDirective } from './template';
import { IDxTemplateHost, DxTemplateHost } from './template-host';
import { EmitterHelper, NgEventsStrategy } from './events-strategy';
import { WatcherHelper } from './watcher-helper';
import domAdapter from 'devextreme/core/dom_adapter';
import { triggerHandler } from 'devextreme/events';

import {
    INestedOptionContainer,
    ICollectionNestedOption,
    ICollectionNestedOptionContainer,
    CollectionNestedOptionContainerImpl
} from './nested-option';

let serverStateKey;
export const getServerStateKey = () => {
    if (!serverStateKey) {
        serverStateKey = makeStateKey<any>('DX_isPlatformServer');
    }

    return serverStateKey;
};

@Component({
    template: ''
})
export abstract class DxComponent implements OnChanges, OnInit, DoCheck, AfterContentChecked, AfterViewInit,
    INestedOptionContainer, ICollectionNestedOptionContainer, IDxTemplateHost {
    private _initialOptions: any = {};
    protected _optionsToUpdate: any = {};
    private _collectionContainerImpl: ICollectionNestedOptionContainer;
    eventHelper: EmitterHelper;
    optionChangedHandlers: EventEmitter<any> = new EventEmitter();
    templates: DxTemplateDirective[];
    instance: any;
    isLinked = true;
    changedOptions = {};
    removedNestedComponents = [];
    recreatedNestedComponents: any[];
    widgetUpdateLocked = false;
    templateUpdateRequired = false;

    private _updateTemplates() {
        if (this.templates.length && this.templateUpdateRequired) {
            let updatedTemplates = {};
            this.templates.forEach(template => {
                updatedTemplates[template.name] = template;
            });
            this.instance.option('integrationOptions.templates', updatedTemplates);
            this.templates = Object.values(updatedTemplates);
            this.templateUpdateRequired = false;
        }
    }

    private _initEvents() {
        this.instance.on('optionChanged', (e) => {
            this.changedOptions[e.name] = e.value;

            const value = e.name === e.fullName ? e.value : e.component.option(e.name);
            this.eventHelper.fireNgEvent(e.name + 'Change', [value]);
            this.optionChangedHandlers.emit(e);
        });
    }

    private _initOptions() {
        this._initialOptions.integrationOptions.watchMethod = this.watcherHelper.getWatchMethod();
    }

    private _initPlatform() {
        if (this.transferState.hasKey(getServerStateKey())) {
            this._initialOptions.integrationOptions.renderedOnServer = this.transferState.get(getServerStateKey(), null);
        } else if (isPlatformServer(this.platformId)) {
            this.transferState.set(getServerStateKey(), true);
        }
    }

    protected _createEventEmitters(events) {
        const zone = this.ngZone;
        this.eventHelper.createEmitters(events);

        this._initialOptions.eventsStrategy = (instance) => {
            let strategy = new NgEventsStrategy(instance, zone);

            events.filter(event => event.subscribe).forEach(event => {
                strategy.addEmitter(event.subscribe, this[event.emit]);
            });

            return strategy;
        };

        this._initialOptions.nestedComponentOptions = function (component) {
            return {
                eventsStrategy: (instance) => { return new NgEventsStrategy(instance, zone); },
                nestedComponentOptions: component.option('nestedComponentOptions')
            };
        };
    }

    _shouldOptionChange(name: string, value: any) {
        if (this.changedOptions.hasOwnProperty(name)) {
            const prevValue = this.changedOptions[name];
            delete this.changedOptions[name];

            return value !== prevValue;
        }
        return true;
    }

    clearChangedOptions() {
        this.changedOptions = {};
    }

    protected _getOption(name: string) {
        return this.instance ?
            this.instance.option(name) :
            this._initialOptions[name];
    }

    lockWidgetUpdate() {
        if (!this.widgetUpdateLocked && this.instance) {
            this.instance.beginUpdate();
            this.widgetUpdateLocked = true;
        }
    }

    unlockWidgetUpdate() {
        if (this.widgetUpdateLocked) {
            this.widgetUpdateLocked = false;
            this.instance.endUpdate();
        }
    }

    protected _setOption(name: string, value: any) {
        this.lockWidgetUpdate();

        if (!this._shouldOptionChange(name, value)) {
            return;
        }

        if (this.instance) {
            this.instance.option(name, value);
        } else {
            this._initialOptions[name] = value;
        }
    }

    protected abstract _createInstance(element, options)

    protected _createWidget(element: any) {
        this._initialOptions.integrationOptions = {};
        this._initPlatform();
        this._initOptions();

        this._initialOptions.onInitializing = function () {
            this.beginUpdate();
        };
        this.instance = this._createInstance(element, this._initialOptions);
        this._initEvents();
        this._initialOptions = {};
    }

    protected _destroyWidget() {
        this.removedNestedComponents = [];
        if (this.instance) {
            let element = this.instance.element();
            triggerHandler(element, 'dxremove', { _angularIntegration: true });
            this.instance.dispose();
            domAdapter.removeElement(element);
        }
    }

    constructor(protected element: ElementRef,
        private ngZone: NgZone,
        templateHost: DxTemplateHost,
        private watcherHelper: WatcherHelper,
        private transferState: TransferState,
        @Inject(PLATFORM_ID) private platformId: any) {
        this.templates = [];
        templateHost.setHost(this);
        this._collectionContainerImpl = new CollectionNestedOptionContainerImpl(this._setOption.bind(this));
        this.eventHelper = new EmitterHelper(ngZone, this);
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let key in changes) {
            let change = changes[key];
            if (change.currentValue !== this[key]) {
                this._optionsToUpdate[key] = changes[key].currentValue;
            }
        }
    }

    ngOnInit() {
        this._createWidget(this.element.nativeElement);
    }

    ngDoCheck() {
        this.applyOptions();
    }

    ngAfterContentChecked() {
        this._updateTemplates();
        this.applyOptions();
        this.resetOptions();
        this.unlockWidgetUpdate();
    }

    ngAfterViewInit() {
        this._updateTemplates();
        this.instance.endUpdate();
        this.recreatedNestedComponents = [];
    }

    applyOptions() {
        if (Object.keys(this._optionsToUpdate).length) {
            if (this.instance) {
                this.instance.option(this._optionsToUpdate);
            }
            this._optionsToUpdate = {};
        }
    }

    resetOptions(collectionName?: string) {
        if (this.instance) {
            this.removedNestedComponents.filter(option => option &&
                !this.isRecreated(option) &&
                collectionName ? option.startsWith(collectionName) : true)
                .forEach(option => {
                    this.instance.resetOption(option);
                });

            this.removedNestedComponents = [];
            this.recreatedNestedComponents = [];
        }
    }

    isRecreated(name: string): boolean {
        return this.recreatedNestedComponents &&
            this.recreatedNestedComponents.some(nestedComponent => nestedComponent.getOptionPath() === name);
    }

    setTemplate(template: DxTemplateDirective) {
        this.templates.push(template);
        this.templateUpdateRequired = true;
    }

    setChildren<T extends ICollectionNestedOption>(propertyName: string, items: QueryList<T>) {
        this.resetOptions(propertyName);
        return this._collectionContainerImpl.setChildren(propertyName, items);
    }
}

@Component({
    template: ''
})
export abstract class DxComponentExtension extends DxComponent implements OnInit, AfterViewInit {
    createInstance(element: any) {
        this._createWidget(element);
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this._createWidget(this.element.nativeElement);
        this.instance.endUpdate();
    }
}
