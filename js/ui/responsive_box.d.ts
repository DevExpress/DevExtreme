import {
    UserDefinedElement
} from '../core/element';

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
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

/** @public */
export type ContentReadyEvent = EventInfo<dxResponsiveBox>;

/** @public */
export type DisposingEvent = EventInfo<dxResponsiveBox>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxResponsiveBox>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxResponsiveBox> & ItemInfo;

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxResponsiveBox> & ItemInfo;

/** @public */
export type ItemHoldEvent = NativeEventInfo<dxResponsiveBox> & ItemInfo;

/** @public */
export type ItemRenderedEvent = NativeEventInfo<dxResponsiveBox> & ItemInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxResponsiveBox> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxResponsiveBoxOptions extends CollectionWidgetOptions<dxResponsiveBox> {
    /**
     * @docid
     * @public
     */
    cols?: Array<{
      /**
       * @docid
       * @type number | Enums.Mode
       * @default 0
       */
      baseSize?: number | 'auto',
      /**
       * @docid
       * @default 1
       */
      ratio?: number,
      /**
       * @docid
       * @default undefined
       */
      screen?: string,
      /**
       * @docid
       * @default 1
       */
      shrink?: number
    }>;
    /**
     * @docid
     * @default null
     * @public
     */
    dataSource?: string | Array<string | dxResponsiveBoxItem | any> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @type_function_return number|string
     * @default '100%'
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @fires dxResponsiveBoxOptions.onOptionChanged
     * @public
     */
    items?: Array<string | dxResponsiveBoxItem | any>;
    /**
     * @docid
     * @public
     */
    rows?: Array<{
      /**
       * @docid
       * @type number | Enums.Mode
       * @default 0
       */
      baseSize?: number | 'auto',
      /**
       * @docid
       * @default 1
       */
      ratio?: number,
      /**
       * @docid
       * @default undefined
       */
      screen?: string,
      /**
       * @docid
       * @default 1
       */
      shrink?: number
    }>;
    /**
     * @docid
     * @default null
     * @public
     */
    screenByWidth?: Function;
    /**
     * @docid
     * @default ""
     * @public
     */
    singleColumnScreen?: string;
    /**
     * @docid
     * @type_function_return number|string
     * @default '100%'
     * @public
     */
    width?: number | string | (() => number | string);
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/responsive_box
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxResponsiveBox extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxResponsiveBoxOptions)
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxResponsiveBoxItem extends CollectionWidgetItem {
    /**
     * @docid
     * @public
     */
    location?: {
      /**
       * @docid
       */
      col?: number,
      /**
       * @docid
       * @default undefined
       */
      colspan?: number,
      /**
       * @docid
       */
      row?: number,
      /**
       * @docid
       * @default undefined
       */
      rowspan?: number,
      /**
       * @docid
       * @default undefined
       */
      screen?: string
    } | Array<{ col?: number, colspan?: number, row?: number, rowspan?: number, screen?: string }>;
}

/** @public */
export type Properties = dxResponsiveBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxResponsiveBoxOptions;

/** @deprecated use Properties instead */
export type IOptions = dxResponsiveBoxOptions;
