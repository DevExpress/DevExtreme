import {
  TElement
} from '../core/element';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
  ComponentEvent,
  ComponentNativeEvent,
  ComponentDisposingEvent,
  ComponentInitializedEvent,
  ComponentOptionChangedEvent,
  ItemInfo
} from '../events';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

/** @public */
export type ContentReadyEvent = ComponentEvent<dxResponsiveBox>;

/** @public */
export type DisposingEvent = ComponentDisposingEvent<dxResponsiveBox>;

/** @public */
export type InitializedEvent = ComponentInitializedEvent<dxResponsiveBox>;

/** @public */
export type ItemClickEvent = ComponentNativeEvent<dxResponsiveBox> & ItemInfo;

/** @public */
export type ItemContextMenuEvent = ComponentNativeEvent<dxResponsiveBox> & ItemInfo;

/** @public */
export type ItemHoldEvent = ComponentNativeEvent<dxResponsiveBox> & ItemInfo;

/** @public */
export type ItemRenderedEvent = ComponentNativeEvent<dxResponsiveBox> & ItemInfo;

/** @public */
export type OptionChangedEvent = ComponentOptionChangedEvent<dxResponsiveBox>;

export interface dxResponsiveBoxOptions extends CollectionWidgetOptions<dxResponsiveBox> {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cols?: Array<{
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @type number | Enums.Mode
      * @default 0
      */
      baseSize?: number | 'auto',
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default 1
      */
      ratio?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default undefined
      */
      screen?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default 1
      */
      shrink?: number
    }>;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxResponsiveBoxItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @type_function_return number|string
     * @default '100%'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @fires dxResponsiveBoxOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxResponsiveBoxItem | any>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rows?: Array<{
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @type number | Enums.Mode
      * @default 0
      */
      baseSize?: number | 'auto',
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default 1
      */
      ratio?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default undefined
      */
      screen?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default 1
      */
      shrink?: number
    }>;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    screenByWidth?: Function;
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    singleColumnScreen?: string;
    /**
     * @docid
     * @type_function_return number|string
     * @default '100%'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    width?: number | string | (() => number | string);
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/responsive_box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxResponsiveBox extends CollectionWidget {
    constructor(element: TElement, options?: dxResponsiveBoxOptions)
}

/**
* @docid
* @inherits CollectionWidgetItem
* @type object
*/
export interface dxResponsiveBoxItem extends CollectionWidgetItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    location?: {
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      */
      col?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default undefined
      */
      colspan?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      */
      row?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default undefined
      */
      rowspan?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default undefined
      */
      screen?: string
    } | Array<{ col?: number, colspan?: number, row?: number, rowspan?: number, screen?: string }>;
}

export type Options = dxResponsiveBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxResponsiveBoxOptions;
