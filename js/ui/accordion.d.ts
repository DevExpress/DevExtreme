import {
    TElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    TPromise
} from '../core/utils/deferred';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions,
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

/** @public */
export type ContentReadyEvent = EventInfo<dxAccordion>;

/** @public */
export type DisposingEvent = EventInfo<dxAccordion>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxAccordion>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxAccordion> & ItemInfo;

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxAccordion> & ItemInfo;

/** @public */
export type ItemHoldEvent = NativeEventInfo<dxAccordion> & ItemInfo;

/** @public */
export type ItemRenderedEvent = NativeEventInfo<dxAccordion> & ItemInfo;

/** @public */
export type ItemTitleClickEvent = NativeEventInfo<dxAccordion> & ItemInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxAccordion> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxAccordion> & SelectionChangedInfo;

export interface dxAccordionOptions extends CollectionWidgetOptions<dxAccordion> {
    /**
     * @docid
     * @default 300
     * @default 200 [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animationDuration?: number;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapsible?: boolean;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxAccordionItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default "item"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: TElement) => string | TElement);
    /**
     * @docid
     * @default "title"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemTitleTemplate?: template | ((itemData: any, itemIndex: number, itemElement: TElement) => string | TElement);
    /**
     * @docid
     * @fires dxAccordionOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxAccordionItem | any>;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    multiple?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field1 component:dxAccordion
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemTitleClick?: ((e: ItemTitleClickEvent) => void) | string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedIndex?: number;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/accordion
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxAccordion extends CollectionWidget {
    constructor(element: TElement, options?: dxAccordionOptions)
    /**
     * @docid
     * @publicName collapseItem(index)
     * @param1 index:numeric
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapseItem(index: number): TPromise<void>;
    /**
     * @docid
     * @publicName expandItem(index)
     * @param1 index:numeric
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandItem(index: number): TPromise<void>;
    /**
     * @docid
     * @publicName updateDimensions()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateDimensions(): TPromise<void>;
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
 */
export interface dxAccordionItem extends CollectionWidgetItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    title?: string;
}

export type Options = dxAccordionOptions;

/** @deprecated use Options instead */
export type IOptions = dxAccordionOptions;
