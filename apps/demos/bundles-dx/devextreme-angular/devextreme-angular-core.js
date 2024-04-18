System.register(['@angular/core', '@angular/common', '@angular/platform-browser', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i0, Injectable, Directive, Input, NgModule, EventEmitter, Component, PLATFORM_ID, Inject, Optional, VERSION, isPlatformServer, DOCUMENT, i1, i2, makeStateKey, domAdapter, one, triggerHandler, equalByValue, render, httpRequest, readyCallbacks, eventsEngine, ajax, Deferred;
    return {
        setters: [function (module) {
            i0 = module;
            Injectable = module.Injectable;
            Directive = module.Directive;
            Input = module.Input;
            NgModule = module.NgModule;
            EventEmitter = module.EventEmitter;
            Component = module.Component;
            PLATFORM_ID = module.PLATFORM_ID;
            Inject = module.Inject;
            Optional = module.Optional;
            VERSION = module.VERSION;
        }, function (module) {
            isPlatformServer = module.isPlatformServer;
            DOCUMENT = module.DOCUMENT;
            i1 = module;
        }, function (module) {
            i2 = module;
            makeStateKey = module.makeStateKey;
        }, function (module) {
            domAdapter = module.default;
        }, function (module) {
            one = module.one;
            triggerHandler = module.triggerHandler;
        }, function (module) {
            equalByValue = module.equalByValue;
        }, function (module) {
            render = module.default;
        }, function (module) {
            httpRequest = module.default;
        }, function (module) {
            readyCallbacks = module.default;
        }, function (module) {
            eventsEngine = module.default;
        }, function (module) {
            ajax = module.default;
        }, function (module) {
            Deferred = module.Deferred;
        }],
        execute: (function () {

            exports({
                k: extractTemplate,
                l: getElement
            });

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            class DxTemplateHost {
                host;
                setHost(host) {
                    this.host = host;
                }
                setTemplate(template) {
                    this.host.setTemplate(template);
                }
            } exports("h", DxTemplateHost);

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            class NgEventsStrategy {
                instance;
                zone;
                subscriptions = {};
                events = {};
                constructor(instance, zone) {
                    this.instance = instance;
                    this.zone = zone;
                }
                hasEvent(name) {
                    return this.getEmitter(name).observers.length !== 0;
                }
                fireEvent(name, args) {
                    const emitter = this.getEmitter(name);
                    if (emitter.observers.length) {
                        const internalSubs = this.subscriptions[name] || [];
                        if (internalSubs.length === emitter.observers.length) {
                            emitter.next(args && args[0]);
                        }
                        else {
                            this.zone.run(() => emitter.next(args && args[0]));
                        }
                    }
                }
                on(name, handler) {
                    if (typeof name === 'string') {
                        const eventSubscriptions = this.subscriptions[name] || [];
                        const subcription = this.getEmitter(name).subscribe(handler?.bind(this.instance));
                        const unsubscribe = subcription.unsubscribe.bind(subcription);
                        eventSubscriptions.push({ handler, unsubscribe });
                        this.subscriptions[name] = eventSubscriptions;
                    }
                    else {
                        const handlersObj = name;
                        Object.keys(handlersObj).forEach((event) => this.on(event, handlersObj[event]));
                    }
                }
                off(name, handler) {
                    const eventSubscriptions = this.subscriptions[name] || [];
                    if (handler) {
                        eventSubscriptions.some((subscription, i) => {
                            if (subscription.handler === handler) {
                                subscription.unsubscribe();
                                eventSubscriptions.splice(i, 1);
                                return true;
                            }
                            return false;
                        });
                    }
                    else {
                        eventSubscriptions.forEach((subscription) => {
                            subscription.unsubscribe();
                        });
                        eventSubscriptions.splice(0, eventSubscriptions.length);
                    }
                }
                dispose() { }
                addEmitter(eventName, emitter) {
                    this.events[eventName] = emitter;
                }
                getEmitter(eventName) {
                    if (!this.events[eventName]) {
                        this.events[eventName] = new EventEmitter();
                    }
                    return this.events[eventName];
                }
            } exports("j", NgEventsStrategy);
            class EmitterHelper {
                zone;
                component;
                lockedValueChangeEvent = false;
                constructor(zone, component) {
                    this.zone = zone;
                    this.component = component;
                }
                fireNgEvent(eventName, eventArgs) {
                    if (this.lockedValueChangeEvent && eventName === 'valueChange') {
                        return;
                    }
                    const emitter = this.component[eventName];
                    if (emitter && emitter.observers.length) {
                        this.zone.run(() => {
                            emitter.next(eventArgs && eventArgs[0]);
                        });
                    }
                }
                createEmitters(events) {
                    events.forEach((event) => {
                        this.component[event.emit] = new EventEmitter();
                    });
                }
            } exports("E", EmitterHelper);

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            class WatcherHelper {
                _watchers = [];
                getWatchMethod() {
                    const watchMethod = (valueGetter, valueChangeCallback, options) => {
                        let oldValue = valueGetter();
                        options = options || {};
                        if (!options.skipImmediate) {
                            valueChangeCallback(oldValue);
                        }
                        const watcher = () => {
                            const newValue = valueGetter();
                            if (this._isDifferentValues(oldValue, newValue, options.deep)) {
                                valueChangeCallback(newValue);
                                oldValue = newValue;
                            }
                        };
                        this._watchers.push(watcher);
                        return () => {
                            const index = this._watchers.indexOf(watcher);
                            if (index !== -1) {
                                this._watchers.splice(index, 1);
                            }
                        };
                    };
                    return watchMethod;
                }
                _isDifferentValues(oldValue, newValue, deepCheck) {
                    const comparableNewValue = this._toComparable(newValue);
                    const comparableOldValue = this._toComparable(oldValue);
                    const isObjectValues = comparableNewValue instanceof Object && comparableOldValue instanceof Object;
                    if (deepCheck && isObjectValues) {
                        return this._checkObjectsFields(newValue, oldValue);
                    }
                    return comparableNewValue !== comparableOldValue;
                }
                _toComparable(value) {
                    if (value instanceof Date) {
                        return value.getTime();
                    }
                    return value;
                }
                _checkObjectsFields(checkingFromObject, checkingToObject) {
                    for (const field in checkingFromObject) {
                        const oldValue = this._toComparable(checkingFromObject[field]);
                        const newValue = this._toComparable(checkingToObject[field]);
                        let isEqualObjects = false;
                        if (typeof oldValue === 'object' && typeof newValue === 'object') {
                            isEqualObjects = equalByValue(oldValue, newValue);
                        }
                        if (oldValue !== newValue && !isEqualObjects) {
                            return true;
                        }
                    }
                }
                checkWatchers() {
                    for (const watcher of this._watchers) {
                        watcher();
                    }
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: WatcherHelper, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
                /** @nocollapse */ static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: WatcherHelper });
            } exports("W", WatcherHelper);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: WatcherHelper, decorators: [{
                        type: Injectable
                    }] });

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            function getElement(element) {
                return element.get ? element.get(0) : element;
            }

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            /* tslint:disable:use-input-property-decorator */
            const DX_TEMPLATE_WRAPPER_CLASS = exports("b", 'dx-template-wrapper');
            class RenderData {
                model;
                index;
                container;
            } exports("R", RenderData);
            class DxTemplateDirective {
                templateRef;
                viewContainerRef;
                renderer;
                zone;
                set dxTemplateOf(value) {
                    this.name = value;
                }
                name;
                constructor(templateRef, viewContainerRef, templateHost, renderer, zone) {
                    this.templateRef = templateRef;
                    this.viewContainerRef = viewContainerRef;
                    this.renderer = renderer;
                    this.zone = zone;
                    templateHost.setTemplate(this);
                }
                renderTemplate(renderData) {
                    const childView = this.viewContainerRef.createEmbeddedView(this.templateRef, {
                        $implicit: renderData.model,
                        index: renderData.index,
                    });
                    const container = getElement(renderData.container);
                    if (renderData.container) {
                        childView.rootNodes.forEach((element) => {
                            this.renderer.appendChild(container, element);
                        });
                    }
                    return childView;
                }
                render(renderData) {
                    let childView;
                    if (this.zone.isStable) {
                        childView = this.zone.run(() => this.renderTemplate(renderData));
                    }
                    else {
                        childView = this.renderTemplate(renderData);
                    }
                    // =========== WORKAROUND =============
                    // https://github.com/angular/angular/issues/12243
                    childView.detectChanges();
                    // =========== /WORKAROUND =============
                    childView.rootNodes.forEach((element) => {
                        if (element.nodeType === 1) {
                            domAdapter.setClass(element, DX_TEMPLATE_WRAPPER_CLASS, true);
                        }
                        one(element, 'dxremove', ({}, params) => {
                            if (!params || !params._angularIntegration) {
                                childView.destroy();
                            }
                        });
                    });
                    return childView.rootNodes;
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTemplateDirective, deps: [{ token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: DxTemplateHost }, { token: i0.Renderer2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
                /** @nocollapse */ static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: DxTemplateDirective, selector: "[dxTemplate]", inputs: { dxTemplateOf: "dxTemplateOf" }, ngImport: i0 });
            } exports("g", DxTemplateDirective);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTemplateDirective, decorators: [{
                        type: Directive,
                        args: [{
                                selector: '[dxTemplate]',
                            }]
                    }], ctorParameters: () => [{ type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: DxTemplateHost }, { type: i0.Renderer2 }, { type: i0.NgZone }], propDecorators: { dxTemplateOf: [{
                            type: Input
                        }] } });
            class DxTemplateModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTemplateModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxTemplateModule, declarations: [DxTemplateDirective], exports: [DxTemplateDirective] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTemplateModule });
            } exports("D", DxTemplateModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTemplateModule, decorators: [{
                        type: NgModule,
                        args: [{
                                declarations: [DxTemplateDirective],
                                exports: [DxTemplateDirective],
                            }]
                    }] });

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            const VISIBILITY_CHANGE_SELECTOR = 'dx-visibility-change-handler';
            class BaseNestedOption {
                _host;
                _hostOptionPath;
                _collectionContainerImpl;
                _initialOptions = {};
                constructor() {
                    this._collectionContainerImpl = new CollectionNestedOptionContainerImpl(this._setOption.bind(this), this._filterItems.bind(this));
                }
                _optionChangedHandler(e) {
                    const fullOptionPath = this._fullOptionPath();
                    if (e.fullName.indexOf(fullOptionPath) === 0) {
                        const optionName = e.fullName.slice(fullOptionPath.length);
                        const emitter = this[`${optionName}Change`];
                        if (emitter) {
                            emitter.next(e.value);
                        }
                    }
                }
                _createEventEmitters(events) {
                    events.forEach((event) => {
                        this[event.emit] = new EventEmitter();
                    });
                }
                _getOption(name) {
                    if (this.isLinked) {
                        return this.instance.option(this._fullOptionPath() + name);
                    }
                    return this._initialOptions[name];
                }
                _setOption(name, value) {
                    if (this.isLinked) {
                        const fullPath = this._fullOptionPath() + name;
                        this.instance.option(fullPath, value);
                    }
                    else {
                        this._initialOptions[name] = value;
                    }
                }
                _addRemovedOption(name) {
                    if (this.instance && this.removedNestedComponents) {
                        this.removedNestedComponents.push(name);
                    }
                }
                _deleteRemovedOptions(name) {
                    if (this.instance && this.removedNestedComponents) {
                        this.removedNestedComponents = this.removedNestedComponents.filter((x) => !x.startsWith(name));
                    }
                }
                _addRecreatedComponent() {
                    if (this.instance && this.recreatedNestedComponents) {
                        this.recreatedNestedComponents.push({ getOptionPath: () => this._getOptionPath() });
                    }
                }
                _getOptionPath() {
                    return this._hostOptionPath() + this._optionPath;
                }
                setHost(host, optionPath) {
                    this._host = host;
                    this._hostOptionPath = optionPath;
                    this.optionChangedHandlers.subscribe(this._optionChangedHandler.bind(this));
                }
                setChildren(propertyName, items) {
                    this.resetOptions(propertyName);
                    return this._collectionContainerImpl.setChildren(propertyName, items);
                }
                _filterItems(items) {
                    return items.filter((item) => item !== this);
                }
                get instance() {
                    return this._host && this._host.instance;
                }
                get resetOptions() {
                    return this._host && this._host.resetOptions;
                }
                get isRecreated() {
                    return this._host && this._host.isRecreated;
                }
                get removedNestedComponents() {
                    return this._host && this._host.removedNestedComponents;
                }
                set removedNestedComponents(value) {
                    this._host.removedNestedComponents = value;
                }
                get recreatedNestedComponents() {
                    return this._host && this._host.recreatedNestedComponents;
                }
                set recreatedNestedComponents(value) {
                    this._host.recreatedNestedComponents = value;
                }
                get isLinked() {
                    return !!this.instance && this._host.isLinked;
                }
                get optionChangedHandlers() {
                    return this._host && this._host.optionChangedHandlers;
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: BaseNestedOption, deps: [], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: BaseNestedOption, selector: "ng-component", ngImport: i0, template: '', isInline: true });
            } exports("B", BaseNestedOption);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: BaseNestedOption, decorators: [{
                        type: Component,
                        args: [{
                                template: '',
                            }]
                    }], ctorParameters: () => [] });
            class CollectionNestedOptionContainerImpl {
                _setOption;
                _filterItems;
                _activatedQueries = {};
                constructor(_setOption, _filterItems) {
                    this._setOption = _setOption;
                    this._filterItems = _filterItems;
                }
                setChildren(propertyName, items) {
                    if (this._filterItems) {
                        items = this._filterItems(items);
                    }
                    if (items.length) {
                        this._activatedQueries[propertyName] = true;
                    }
                    if (this._activatedQueries[propertyName]) {
                        const widgetItems = items.map((item, index) => {
                            item._index = index;
                            return item._value;
                        });
                        this._setOption(propertyName, widgetItems);
                    }
                }
            } exports("a", CollectionNestedOptionContainerImpl);
            class NestedOption extends BaseNestedOption {
                setHost(host, optionPath) {
                    super.setHost(host, optionPath);
                    this._host[this._optionPath] = this._initialOptions;
                }
                _fullOptionPath() {
                    return `${this._getOptionPath()}.`;
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: NestedOption, deps: null, target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: NestedOption, selector: "ng-component", usesInheritance: true, ngImport: i0, template: '', isInline: true });
            } exports("N", NestedOption);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: NestedOption, decorators: [{
                        type: Component,
                        args: [{
                                template: '',
                            }]
                    }] });
            class CollectionNestedOption extends BaseNestedOption {
                _index;
                _fullOptionPath() {
                    return `${this._getOptionPath()}[${this._index}].`;
                }
                get _value() {
                    return this._initialOptions;
                }
                get isLinked() {
                    return this._index !== undefined && !!this.instance && this._host.isLinked;
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: CollectionNestedOption, deps: null, target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: CollectionNestedOption, selector: "ng-component", usesInheritance: true, ngImport: i0, template: '', isInline: true });
            } exports("C", CollectionNestedOption);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: CollectionNestedOption, decorators: [{
                        type: Component,
                        args: [{
                                template: '',
                            }]
                    }] });
            const triggerShownEvent = function (element) {
                const changeHandlers = [];
                if (!render(element).hasClass(VISIBILITY_CHANGE_SELECTOR)) {
                    changeHandlers.push(element);
                }
                changeHandlers.push.apply(changeHandlers, element.querySelectorAll(`.${VISIBILITY_CHANGE_SELECTOR}`));
                for (let i = 0; i < changeHandlers.length; i++) {
                    triggerHandler(changeHandlers[i], 'dxshown');
                }
            };
            function extractTemplate(option, element, renderer, document) {
                if (!option.template === undefined || !element.nativeElement.hasChildNodes()) {
                    return;
                }
                const childNodes = [].slice.call(element.nativeElement.childNodes);
                const userContent = childNodes.filter((n) => {
                    if (n.tagName) {
                        const tagNamePrefix = n.tagName.toLowerCase().substr(0, 3);
                        return !(tagNamePrefix === 'dxi' || tagNamePrefix === 'dxo');
                    }
                    return n.nodeName !== '#comment' && n.textContent.replace(/\s/g, '').length;
                });
                if (!userContent.length) {
                    return;
                }
                option.template = {
                    render: (renderData) => {
                        const result = element.nativeElement;
                        domAdapter.setClass(result, DX_TEMPLATE_WRAPPER_CLASS, true);
                        if (renderData.container) {
                            const container = getElement(renderData.container);
                            const resultInContainer = container.contains(element.nativeElement);
                            renderer.appendChild(container, element.nativeElement);
                            if (!resultInContainer) {
                                const resultInBody = document.body.contains(container);
                                if (resultInBody) {
                                    triggerShownEvent(result);
                                }
                            }
                        }
                        return result;
                    },
                };
            }
            class NestedOptionHost {
                _host;
                _optionPath;
                getHost() {
                    return this._host;
                }
                setHost(host, optionPath) {
                    this._host = host;
                    this._optionPath = optionPath || (() => '');
                }
                setNestedOption(nestedOption) {
                    nestedOption.setHost(this._host, this._optionPath);
                }
            } exports("i", NestedOptionHost);

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            let serverStateKey;
            const getServerStateKey = exports("m", () => {
                if (!serverStateKey) {
                    serverStateKey = makeStateKey('DX_isPlatformServer');
                }
                return serverStateKey;
            });
            class DxComponent {
                element;
                ngZone;
                watcherHelper;
                transferState;
                platformId;
                _initialOptions = {};
                _optionsToUpdate = {};
                _collectionContainerImpl;
                eventHelper;
                optionChangedHandlers = new EventEmitter();
                templates;
                instance;
                isLinked = true;
                changedOptions = {};
                removedNestedComponents = [];
                recreatedNestedComponents;
                widgetUpdateLocked = false;
                templateUpdateRequired = false;
                _updateTemplates() {
                    if (this.templates.length && this.templateUpdateRequired) {
                        const updatedTemplates = {};
                        this.templates.forEach((template) => {
                            updatedTemplates[template.name] = template;
                        });
                        this.instance.option('integrationOptions.templates', updatedTemplates);
                        this.templates = Object.values(updatedTemplates);
                        this.templateUpdateRequired = false;
                    }
                }
                _initEvents() {
                    this.instance.on('optionChanged', (e) => {
                        this.changedOptions[e.name] = e.value;
                        const value = e.name === e.fullName ? e.value : e.component.option(e.name);
                        this.eventHelper.fireNgEvent(`${e.name}Change`, [value]);
                        this.optionChangedHandlers.emit(e);
                    });
                }
                _initOptions() {
                    this._initialOptions.integrationOptions.watchMethod = this.watcherHelper.getWatchMethod();
                }
                _initPlatform() {
                    if (this.transferState.hasKey(getServerStateKey())) {
                        this._initialOptions.integrationOptions.renderedOnServer = this.transferState.get(getServerStateKey(), null);
                    }
                    else if (isPlatformServer(this.platformId)) {
                        this.transferState.set(getServerStateKey(), true);
                    }
                }
                _createEventEmitters(events) {
                    const zone = this.ngZone;
                    this.eventHelper.createEmitters(events);
                    this._initialOptions.eventsStrategy = (instance) => {
                        const strategy = new NgEventsStrategy(instance, zone);
                        events.filter((event) => event.subscribe).forEach((event) => {
                            strategy.addEmitter(event.subscribe, this[event.emit]);
                        });
                        return strategy;
                    };
                    this._initialOptions.nestedComponentOptions = function (component) {
                        return {
                            eventsStrategy: (instance) => new NgEventsStrategy(instance, zone),
                            nestedComponentOptions: component.option('nestedComponentOptions'),
                        };
                    };
                }
                _shouldOptionChange(name, value) {
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
                _getOption(name) {
                    return this.instance
                        ? this.instance.option(name)
                        : this._initialOptions[name];
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
                _setOption(name, value) {
                    this.lockWidgetUpdate();
                    if (!this._shouldOptionChange(name, value)) {
                        return;
                    }
                    if (this.instance) {
                        this.instance.option(name, value);
                    }
                    else {
                        this._initialOptions[name] = value;
                    }
                }
                _createWidget(element) {
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
                _destroyWidget() {
                    this.removedNestedComponents = [];
                    if (this.instance) {
                        const element = this.instance.element();
                        triggerHandler(element, 'dxremove', { _angularIntegration: true });
                        this.instance.dispose();
                        domAdapter.removeElement(element);
                    }
                }
                constructor(element, ngZone, templateHost, watcherHelper, transferState, platformId) {
                    this.element = element;
                    this.ngZone = ngZone;
                    this.watcherHelper = watcherHelper;
                    this.transferState = transferState;
                    this.platformId = platformId;
                    this.templates = [];
                    templateHost.setHost(this);
                    this._collectionContainerImpl = new CollectionNestedOptionContainerImpl(this._setOption.bind(this));
                    this.eventHelper = new EmitterHelper(ngZone, this);
                }
                ngOnChanges(changes) {
                    for (const key in changes) {
                        const change = changes[key];
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
                    this.applyOptions();
                    this.resetOptions();
                    this.unlockWidgetUpdate();
                }
                ngAfterViewInit() {
                    this._updateTemplates();
                    this.instance.endUpdate();
                    this.recreatedNestedComponents = [];
                }
                ngAfterViewChecked() {
                    this._updateTemplates();
                }
                applyOptions() {
                    if (Object.keys(this._optionsToUpdate).length) {
                        if (this.instance) {
                            this.instance.option(this._optionsToUpdate);
                        }
                        this._optionsToUpdate = {};
                    }
                }
                resetOptions(collectionName) {
                    if (this.instance) {
                        this.removedNestedComponents.filter((option) => (option
                            && !this.isRecreated(option)
                            && collectionName ? option.startsWith(collectionName) : true))
                            .forEach((option) => {
                            this.instance.resetOption(option);
                        });
                        this.removedNestedComponents = [];
                        this.recreatedNestedComponents = [];
                    }
                }
                isRecreated(name) {
                    return this.recreatedNestedComponents
                        && this.recreatedNestedComponents.some((nestedComponent) => nestedComponent.getOptionPath() === name);
                }
                setTemplate(template) {
                    this.templates.push(template);
                    this.templateUpdateRequired = true;
                }
                setChildren(propertyName, items) {
                    this.resetOptions(propertyName);
                    return this._collectionContainerImpl.setChildren(propertyName, items);
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxComponent, selector: "ng-component", usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("c", DxComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxComponent, decorators: [{
                        type: Component,
                        args: [{
                                template: '',
                            }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }] });
            class DxComponentExtension extends DxComponent {
                createInstance(element) {
                    this._createWidget(element);
                }
                ngOnInit() {
                }
                ngAfterViewInit() {
                    this._createWidget(this.element.nativeElement);
                    this.instance.endUpdate();
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxComponentExtension, deps: null, target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxComponentExtension, selector: "ng-component", usesInheritance: true, ngImport: i0, template: '', isInline: true });
            } exports("d", DxComponentExtension);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxComponentExtension, decorators: [{
                        type: Component,
                        args: [{
                                template: '',
                            }]
                    }] });

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            /* tslint:disable:max-line-length */
            const outsideZoneEvents = ['mousemove', 'mouseover', 'mouseout'];
            const insideZoneEvents = ['mouseup', 'click', 'mousedown', 'transitionend', 'wheel'];
            let originalAdd;
            let callbacks = [];
            let readyCallbackAdd = function (callback) {
                if (!originalAdd) {
                    originalAdd = this.callBase.bind(this);
                }
                callbacks.push(callback);
            };
            readyCallbacks.inject({
                add(callback) {
                    return readyCallbackAdd.call(this, callback);
                },
            });
            let doInjections = (document, ngZone, xhrFactory) => {
                if (Number(VERSION.major) < 12) {
                    console.warn('Your version of Angular is not supported. Please update your project to version 12 or later.'
                        + ' Please refer to the Angular Update Guide for more information: https://update.angular.io');
                }
                domAdapter.inject({
                    _document: document,
                    listen(...args) {
                        const eventName = args[1];
                        if (outsideZoneEvents.includes(eventName)) {
                            return ngZone.runOutsideAngular(() => this.callBase.apply(this, args));
                        }
                        if (ngZone.isStable && insideZoneEvents.includes(eventName)) {
                            return ngZone.run(() => this.callBase.apply(this, args));
                        }
                        return this.callBase.apply(this, args);
                    },
                    isElementNode(element) {
                        return element && element.nodeType === 1;
                    },
                    isTextNode(element) {
                        return element && element.nodeType === 3;
                    },
                    isDocument(element) {
                        return element && element.nodeType === 9;
                    },
                });
                httpRequest.inject({
                    getXhr() {
                        if (!xhrFactory) {
                            return this.callBase.apply(this);
                        }
                        const _xhr = xhrFactory.build();
                        if (!('withCredentials' in _xhr)) {
                            _xhr.withCredentials = false;
                        }
                        return _xhr;
                    },
                });
                const runReadyCallbacksInZone = () => {
                    ngZone.run(() => {
                        eventsEngine.set({});
                        callbacks.forEach((callback) => originalAdd.call(null, callback));
                        callbacks = [];
                        readyCallbacks.fire();
                    });
                };
                runReadyCallbacksInZone();
                readyCallbackAdd = (callback) => ngZone.run(() => callback());
                doInjections = runReadyCallbacksInZone;
            };
            class DxIntegrationModule {
                constructor(document, ngZone, xhrFactory) {
                    doInjections(document, ngZone, xhrFactory);
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxIntegrationModule, deps: [{ token: DOCUMENT }, { token: i0.NgZone }, { token: i1.XhrFactory, optional: true }], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxIntegrationModule });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxIntegrationModule });
            } exports("e", DxIntegrationModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxIntegrationModule, decorators: [{
                        type: NgModule,
                        args: [{}]
                    }], ctorParameters: () => [{ type: undefined, decorators: [{
                                type: Inject,
                                args: [DOCUMENT]
                            }] }, { type: i0.NgZone }, { type: i1.XhrFactory, decorators: [{
                                type: Optional
                            }] }] });

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            function isIterable(value) {
                return value && (typeof value[Symbol.iterator] === 'function');
            }
            class IterableDifferHelper {
                _differs;
                _host;
                _propertyDiffers = {};
                constructor(_differs) {
                    this._differs = _differs;
                }
                setHost(host) {
                    this._host = host;
                }
                setup(prop, changes) {
                    if (prop in changes) {
                        const value = changes[prop].currentValue;
                        this.setupSingle(prop, value);
                    }
                }
                setupSingle(prop, value) {
                    if (value && Array.isArray(value)) {
                        if (!this._propertyDiffers[prop]) {
                            try {
                                this._propertyDiffers[prop] = this._differs.find(value).create(null);
                                return true;
                            }
                            catch (e) { }
                        }
                    }
                    else {
                        delete this._propertyDiffers[prop];
                    }
                    return false;
                }
                getChanges(prop, value) {
                    if (this._propertyDiffers[prop]) {
                        return this._propertyDiffers[prop].diff(value);
                    }
                }
                checkChangedOptions(propName, hostValue) {
                    return this._host.changedOptions[propName] === hostValue;
                }
                doCheck(prop) {
                    if (this._propertyDiffers[prop] && this._host.instance) {
                        const hostValue = this._host[prop];
                        const changes = isIterable(hostValue) && this.getChanges(prop, hostValue);
                        if (changes && !this.checkChangedOptions(prop, hostValue)) {
                            this._host.lockWidgetUpdate();
                            this._host.instance.option(prop, hostValue);
                        }
                    }
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: IterableDifferHelper, deps: [{ token: i0.IterableDiffers }], target: i0.ɵɵFactoryTarget.Injectable });
                /** @nocollapse */ static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: IterableDifferHelper });
            } exports("I", IterableDifferHelper);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: IterableDifferHelper, decorators: [{
                        type: Injectable
                    }], ctorParameters: () => [{ type: i0.IterableDiffers }] });

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            class DxServerTransferStateModule {
                state;
                platformId;
                constructor(state, platformId) {
                    this.state = state;
                    this.platformId = platformId;
                    const that = this;
                    ajax.inject({
                        sendRequest(...args) {
                            const key = makeStateKey(that.generateKey(args));
                            const cachedData = that.state.get(key, null);
                            if (isPlatformServer(that.platformId)) {
                                const result = this.callBase.apply(this, args);
                                result.always((data, status) => {
                                    const dataForCache = {
                                        data,
                                        status,
                                    };
                                    that.state.set(key, dataForCache);
                                });
                                return result;
                            }
                            if (cachedData) {
                                const d = Deferred();
                                d.resolve(cachedData.data, cachedData.status);
                                that.state.set(key, null);
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
                        }
                        else {
                            keyValue += key + args[key];
                        }
                    }
                    return keyValue;
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxServerTransferStateModule, deps: [{ token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxServerTransferStateModule });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxServerTransferStateModule });
            } exports("f", DxServerTransferStateModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxServerTransferStateModule, decorators: [{
                        type: NgModule,
                        args: [{}]
                    }], ctorParameters: () => [{ type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }] });

        })
    };
}));
