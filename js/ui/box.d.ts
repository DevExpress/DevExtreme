import {
    UserDefinedElement
} from '../core/element';

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
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

/** @public */
export type ContentReadyEvent = EventInfo<dxBox>;

/** @public */
export type DisposingEvent = EventInfo<dxBox>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxBox>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxBox> & ItemInfo;

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxBox> & ItemInfo;

/** @public */
export type ItemHoldEvent = NativeEventInfo<dxBox> & ItemInfo;

/** @public */
export type ItemRenderedEvent = NativeEventInfo<dxBox> & ItemInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxBox> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxBoxOptions extends CollectionWidgetOptions<dxBox> {
    /**
     * @docid
     * @type Enums.BoxAlign
     * @default 'start'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    align?: 'center' | 'end' | 'space-around' | 'space-between' | 'start';
    /**
     * @docid
     * @type Enums.BoxCrossAlign
     * @default 'start'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    crossAlign?: 'center' | 'end' | 'start' | 'stretch';
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxBoxItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @type Enums.BoxDirection
     * @default 'row'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    direction?: 'col' | 'row';
    /**
     * @docid
     * @fires dxBoxOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxBoxItem | any>;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @namespace DevExpress.ui
 * @public
 */
export default class dxBox extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxBoxOptions)
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @namespace DevExpress.ui
 * @type object
 */
export interface dxBoxItem extends CollectionWidgetItem {
    /**
     * @docid
     * @type number | Enums.Mode
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    baseSize?: number | 'auto';
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    box?: dxBoxOptions;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ratio?: number;
    /**
     * @docid
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shrink?: number;
}

/** @public */
export type Properties = dxBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxBoxOptions;

/** @deprecated use Properties instead */
export type IOptions = dxBoxOptions;
