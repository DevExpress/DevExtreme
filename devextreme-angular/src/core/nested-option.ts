import { QueryList, ElementRef, Renderer2, EventEmitter } from '@angular/core';

import { DX_TEMPLATE_WRAPPER_CLASS } from './template';
import { getElement } from './utils';

import render from 'devextreme/core/renderer';
import * as events from 'devextreme/events';
import * as domAdapter from 'devextreme/core/dom_adapter';

const VISIBILITY_CHANGE_SELECTOR = 'dx-visibility-change-handler';

export interface INestedOptionContainer {
    instance: any;
    isLinked: boolean;
    removedNestedComponents: string[];
    optionChangedHandlers: EventEmitter<any>;
    recreatedNestedComponents: any[];
    resetOptions: (collectionName?: string) => void;
    isRecreated: (name: string) => boolean;
}

export interface IOptionPathGetter { (): string; }

export abstract class BaseNestedOption implements INestedOptionContainer, ICollectionNestedOptionContainer {
    protected _host: INestedOptionContainer;
    protected _hostOptionPath: IOptionPathGetter;
    private _collectionContainerImpl: ICollectionNestedOptionContainer;
    protected _initialOptions = {};

    protected abstract get _optionPath(): string;
    protected abstract _fullOptionPath(): string;

    constructor() {
        this._collectionContainerImpl = new CollectionNestedOptionContainerImpl(this._setOption.bind(this), this._filterItems.bind(this));
    }

    protected _optionChangedHandler(e: any) {
        let fullOptionPath = this._fullOptionPath();

        if (e.fullName.indexOf(fullOptionPath) === 0) {
            let optionName = e.fullName.slice(fullOptionPath.length);
            let emitter = this[optionName + 'Change'];

            if (emitter) {
                emitter.next(e.value);
            }
        }
    }

    protected _createEventEmitters(events) {
        events.forEach(event => {
            this[event.emit] = new EventEmitter();
        });
    }

    protected _getOption(name: string): any {
        if (this.isLinked) {
            return this.instance.option(this._fullOptionPath() + name);
        } else {
            return this._initialOptions[name];
        }
    }

    protected _setOption(name: string, value: any) {
        if (this.isLinked) {
            const fullPath = this._fullOptionPath() + name;
            this.instance.option(fullPath, value);
        } else {
            this._initialOptions[name] = value;
        }
    }

    protected _addRemovedOption(name: string) {
        if (this.instance && this.removedNestedComponents) {
            this.removedNestedComponents.push(name);
        }
    }

    protected _deleteRemovedOptions(name: string) {
        if (this.instance && this.removedNestedComponents) {
            this.removedNestedComponents = this.removedNestedComponents.filter((x) => !x.startsWith(name));
        }
    }

    protected _addRecreatedComponent() {
        if (this.instance && this.recreatedNestedComponents) {
            this.recreatedNestedComponents.push({ getOptionPath: () => this._getOptionPath() });
        }
    }

    protected _getOptionPath() {
        return this._hostOptionPath() + this._optionPath;
    }

    setHost(host: INestedOptionContainer, optionPath: IOptionPathGetter) {
        this._host = host;
        this._hostOptionPath = optionPath;
        this.optionChangedHandlers.subscribe(this._optionChangedHandler.bind(this));
    }

    setChildren<T extends ICollectionNestedOption>(propertyName: string, items: QueryList<T>) {
        this.resetOptions(propertyName);
        return this._collectionContainerImpl.setChildren(propertyName, items);
    }

    _filterItems(items: QueryList<BaseNestedOption>) {
        return items.filter((item) => { return item !== this; });
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
}

export interface ICollectionNestedOptionContainer {
    setChildren<T extends ICollectionNestedOption>(propertyName: string, items: QueryList<T>);
}

export class CollectionNestedOptionContainerImpl implements ICollectionNestedOptionContainer {
    private _activatedQueries = {};

    constructor(private _setOption: Function, private _filterItems?: Function) { }

    setChildren<T extends ICollectionNestedOption>(propertyName: string, items: QueryList<T>) {
        if (this._filterItems) {
            items = this._filterItems(items);
        }
        if (items.length) {
            this._activatedQueries[propertyName] = true;
        }
        if (this._activatedQueries[propertyName]) {
            let widgetItems = items.map((item, index) => {
                item._index = index;
                return item._value;
            });
            this._setOption(propertyName, widgetItems);
        }
    }
}

export abstract class NestedOption extends BaseNestedOption {
    setHost(host: INestedOptionContainer, optionPath: IOptionPathGetter) {
        super.setHost(host, optionPath);

        this._host[this._optionPath] = this._initialOptions;
    }

    protected _fullOptionPath() {
        return this._getOptionPath() + '.';
    }
}

export interface ICollectionNestedOption {
    _index: number;
    _value: Object;
}

export abstract class CollectionNestedOption extends BaseNestedOption implements ICollectionNestedOption {
    _index: number;

    protected _fullOptionPath() {
        return `${this._getOptionPath()}[${this._index}].`;
    }

    get _value() {
        return this._initialOptions;
    }

    get isLinked() {
        return this._index !== undefined && !!this.instance && this._host.isLinked;
    }
}

export interface IOptionWithTemplate extends BaseNestedOption {
    template: any;
}

let triggerShownEvent = function(element) {
    let changeHandlers = [];

    if (!render(element).hasClass(VISIBILITY_CHANGE_SELECTOR)) {
        changeHandlers.push(element);
    }

    changeHandlers.push.apply(changeHandlers, element.querySelectorAll('.' + VISIBILITY_CHANGE_SELECTOR));

    for (let i = 0; i < changeHandlers.length; i++) {
        events.triggerHandler(changeHandlers[i], 'dxshown');
    }
};

export function extractTemplate(option: IOptionWithTemplate, element: ElementRef, renderer: Renderer2, document: any) {
    if (!option.template === undefined || !element.nativeElement.hasChildNodes()) {
        return;
    }

    let childNodes = [].slice.call(element.nativeElement.childNodes);
    let userContent = childNodes.filter((n) => {
        if (n.tagName) {
            let tagNamePrefix = n.tagName.toLowerCase().substr(0, 3);
            return !(tagNamePrefix === 'dxi' || tagNamePrefix === 'dxo');
        } else {
            return n.nodeName !== '#comment' && n.textContent.replace(/\s/g, '').length;
        }
    });
    if (!userContent.length) {
        return;
    }

    option.template = {
        render: (renderData) => {
            let result = element.nativeElement;

            domAdapter.setClass(result, DX_TEMPLATE_WRAPPER_CLASS, true);

            if (renderData.container) {
                let container = getElement(renderData.container);
                let resultInContainer = container.contains(element.nativeElement);

                renderer.appendChild(container, element.nativeElement);

                if (!resultInContainer) {
                    let resultInBody = document.body.contains(container);

                    if (resultInBody) {
                        triggerShownEvent(result);
                    }
                }
            }

            return result;
        }
    };
}

export class NestedOptionHost {
    private _host: INestedOptionContainer;
    private _optionPath: IOptionPathGetter;

    getHost(): INestedOptionContainer {
        return this._host;
    }

    setHost(host: INestedOptionContainer, optionPath?: IOptionPathGetter) {
        this._host = host;
        this._optionPath = optionPath || (() => '');
    }

    setNestedOption(nestedOption: BaseNestedOption) {
        nestedOption.setHost(this._host, this._optionPath);
    }
}
