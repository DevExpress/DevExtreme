import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    DxPromise
} from '../core/utils/deferred';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import Store from '../data/abstract_store';

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

/** 
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxAccordionOptions extends CollectionWidgetOptions<dxAccordion> {
    /**
     * @docid
     * @default 300
     * @default 200 [for](Material)
     * @public
     */
    animationDuration?: number;
    /**
     * @docid
     * @default false
     * @public
     */
    collapsible?: boolean;
    /**
     * @docid
     * @default null
     * @public
     */
    dataSource?: string | Array<string | dxAccordionItem | any> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default true
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid
     * @default true [for](desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @type_function_return number|string
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default "item"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:DxElement
     * @type_function_return string|Element|jQuery
     * @public
     */
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default "title"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:DxElement
     * @type_function_return string|Element|jQuery
     * @public
     */
    itemTitleTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @fires dxAccordionOptions.onOptionChanged
     * @public
     */
    items?: Array<string | dxAccordionItem | any>;
    /**
     * @docid
     * @default false
     * @public
     */
    multiple?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field1 component:dxAccordion
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onItemTitleClick?: ((e: ItemTitleClickEvent) => void) | string;
    /**
     * @docid
     * @default false
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid
     * @default 0
     * @public
     */
    selectedIndex?: number;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/accordion
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxAccordion extends CollectionWidget<dxAccordionOptions> {
    /**
     * @docid
     * @publicName collapseItem(index)
     * @param1 index:numeric
     * @return Promise<void>
     * @public
     */
    collapseItem(index: number): DxPromise<void>;
    /**
     * @docid
     * @publicName expandItem(index)
     * @param1 index:numeric
     * @return Promise<void>
     * @public
     */
    expandItem(index: number): DxPromise<void>;
    /**
     * @docid
     * @publicName updateDimensions()
     * @return Promise<void>
     * @public
     */
    updateDimensions(): DxPromise<void>;
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @namespace DevExpress.ui
 * @type object
 */
export interface dxAccordionItem extends CollectionWidgetItem {
    /**
     * @docid
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @public
     */
    title?: string;
}

/** @public */
export type Properties = dxAccordionOptions;

/** @deprecated use Properties instead */
export type Options = dxAccordionOptions;

/** @deprecated use Properties instead */
export type IOptions = dxAccordionOptions;
