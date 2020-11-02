import '../jquery_augmentation';

import {
    dxElement
} from '../core/element';

import {
    event
} from '../events/index';

import PivotGridDataSource, {
    PivotGridDataSourceField
} from './pivot_grid/data_source';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface dxPivotGridFieldChooserOptions extends WidgetOptions<dxPivotGridFieldChooser> {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowSearch?: boolean;
    /**
     * @docid
     * @type Enums.ApplyChangesMode
     * @default "instantly"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    applyChangesMode?: 'instantly' | 'onDemand';
    /**
     * @docid
     * @type PivotGridDataSource
     * @default null
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: PivotGridDataSource;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    headerFilter?: {
      /**
       * @docid
       * @default undefined
       */
      allowSearch?: boolean,
      /**
       * @docid
       * @default 325
       */
      height?: number,
      /**
       * @docid
       * @default 500
       */
      searchTimeout?: number,
      /**
       * @docid
       * @default false
       */
      showRelevantValues?: boolean,
      /**
       * @docid
       */
      texts?: {
        /**
         * @docid
         * @default "Cancel"
         */
        cancel?: string,
        /**
         * @docid
         * @default "(Blanks)"
         */
        emptyValue?: string,
        /**
         * @docid
         * @default "Ok"
         */
        ok?: string
      },
      /**
       * @docid
       * @default 252
       */
      width?: number
    };
    /**
     * @docid
     * @type number|string|function
     * @default 400
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @type Enums.PivotGridFieldChooserLayout
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    layout?: 0 | 1 | 2;
    /**
     * @docid
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 items:Array<Object>
     * @type_function_param1_field5 area:string
     * @type_function_param1_field6 field:PivotGridDataSourceOptions.fields
     * @type_function_param1_field7 event:event
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onContextMenuPreparing?: ((e: { component?: dxPivotGridFieldChooser, element?: dxElement, model?: any, items?: Array<any>, area?: string, field?: PivotGridDataSourceField, event?: event }) => any);
    /**
     * @docid
     * @type number
     * @default 500
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchTimeout?: number;
    /**
     * @docid
     * @type object
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    state?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    texts?: {
      /**
       * @docid
       * @default 'All Fields'
       */
      allFields?: string,
      /**
       * @docid
       * @default 'Column Fields'
       */
      columnFields?: string,
      /**
       * @docid
       * @default 'Data Fields'
       */
      dataFields?: string,
      /**
       * @docid
       * @default 'Filter Fields'
       */
      filterFields?: string,
      /**
       * @docid
       * @default 'Row Fields'
       */
      rowFields?: string
    };
}
/**
 * @docid
 * @inherits Widget
 * @module ui/pivot_grid_field_chooser
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxPivotGridFieldChooser extends Widget {
    constructor(element: Element, options?: dxPivotGridFieldChooserOptions)
    constructor(element: JQuery, options?: dxPivotGridFieldChooserOptions)
    /**
     * @docid
     * @publicName applyChanges()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    applyChanges(): void;
    /**
     * @docid
     * @publicName cancelChanges()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cancelChanges(): void;
    /**
     * @docid
     * @publicName getDataSource()
     * @return PivotGridDataSource
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getDataSource(): PivotGridDataSource;
    /**
     * @docid
     * @publicName updateDimensions()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateDimensions(): void;
}

declare global {
interface JQuery {
    dxPivotGridFieldChooser(): JQuery;
    dxPivotGridFieldChooser(options: "instance"): dxPivotGridFieldChooser;
    dxPivotGridFieldChooser(options: string): any;
    dxPivotGridFieldChooser(options: string, ...params: any[]): any;
    dxPivotGridFieldChooser(options: dxPivotGridFieldChooserOptions): JQuery;
}
}
export type Options = dxPivotGridFieldChooserOptions;

/** @deprecated use Options instead */
export type IOptions = dxPivotGridFieldChooserOptions;
