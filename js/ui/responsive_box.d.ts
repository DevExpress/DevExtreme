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
      baseSize?: number | 'auto';
      /**
       * @docid
       * @default 1
       */
      ratio?: number;
      /**
       * @docid
       * @default undefined
       */
      screen?: string;
      /**
       * @docid
       * @default 1
       */
      shrink?: number;
    }>;
    /**
     * @docid
     * @type string | Array<string | dxResponsiveBoxItem | any> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<string | Item | any>;
    /**
     * @docid
     * @default '100%'
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @type Array<string | dxResponsiveBoxItem | any>
     * @fires dxResponsiveBoxOptions.onOptionChanged
     * @public
     */
    items?: Array<string | Item | any>;
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
      baseSize?: number | 'auto';
      /**
       * @docid
       * @default 1
       */
      ratio?: number;
      /**
       * @docid
       * @default undefined
       */
      screen?: string;
      /**
       * @docid
       * @default 1
       */
      shrink?: number;
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
     * @default '100%'
     * @public
     */
    width?: number | string | (() => number | string);
}
/**
 * @docid
 * @inherits CollectionWidget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxResponsiveBox extends CollectionWidget<dxResponsiveBoxOptions> { }

/**
 * @public
 * @namespace DevExpress.ui.dxResponsiveBox
 */
export type Item = dxResponsiveBoxItem;

/**
 * @deprecated Use Item instead
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
      col?: number;
      /**
       * @docid
       * @default undefined
       */
      colspan?: number;
      /**
       * @docid
       */
      row?: number;
      /**
       * @docid
       * @default undefined
       */
      rowspan?: number;
      /**
       * @docid
       * @default undefined
       */
      screen?: string;
    } | Array<{ col?: number; colspan?: number; row?: number; rowspan?: number; screen?: string }>;
}

/** @public */
export type Properties = dxResponsiveBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxResponsiveBoxOptions;
