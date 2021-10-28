import { DataSourceLike } from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions,
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
     * @public
     */
    align?: 'center' | 'end' | 'space-around' | 'space-between' | 'start';
    /**
     * @docid
     * @type Enums.BoxCrossAlign
     * @default 'start'
     * @public
     */
    crossAlign?: 'center' | 'end' | 'start' | 'stretch';
    /**
     * @docid
     * @type string | Array<string | dxBoxItem | any> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<string | Item | any>;
    /**
     * @docid
     * @type Enums.BoxDirection
     * @default 'row'
     * @public
     */
    direction?: 'col' | 'row';
    /**
     * @docid
     * @type Array<string | dxBoxItem | any>
     * @fires dxBoxOptions.onOptionChanged
     * @public
     */
    items?: Array<string | Item | any>;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxBox extends CollectionWidget<dxBoxOptions> { }

/**
 * @public
 * @namespace DevExpress.ui.dxBox
 */
export type Item = dxBoxItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxBoxItem extends CollectionWidgetItem {
    /**
     * @docid
     * @type number | Enums.Mode
     * @default 0
     * @public
     */
    baseSize?: number | 'auto';
    /**
     * @docid
     * @default undefined
     * @public
     */
    box?: dxBoxOptions;
    /**
     * @docid
     * @default 0
     * @public
     */
    ratio?: number;
    /**
     * @docid
     * @default 1
     * @public
     */
    shrink?: number;
}

/** @public */
export type Properties = dxBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxBoxOptions;
