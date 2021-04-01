import {
    TElement
} from '../core/element';

import {
    TEvent
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
     * @default null
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: PivotGridDataSource;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    headerFilter?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      allowSearch?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 325
       */
      height?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 500
       */
      searchTimeout?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      showRelevantValues?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      texts?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Cancel"
         */
        cancel?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "(Blanks)"
         */
        emptyValue?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Ok"
         */
        ok?: string
      },
      /**
       * @prevFileNamespace DevExpress.ui
       * @docid
       * @default 252
       */
      width?: number
    };
    /**
     * @docid
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
     * @type_function_param1 e:object
     * @type_function_param1_field4 items:Array<Object>
     * @type_function_param1_field5 area:string
     * @type_function_param1_field6 field:PivotGridDataSourceOptions.fields
     * @type_function_param1_field7 event:event
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onContextMenuPreparing?: ((e: { component?: dxPivotGridFieldChooser, element?: TElement, model?: any, items?: Array<any>, area?: string, field?: PivotGridDataSourceField, event?: TEvent }) => void);
    /**
     * @docid
     * @default 500
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchTimeout?: number;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    state?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    texts?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 'All Fields'
       */
      allFields?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 'Column Fields'
       */
      columnFields?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 'Data Fields'
       */
      dataFields?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 'Filter Fields'
       */
      filterFields?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
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
    constructor(element: TElement, options?: dxPivotGridFieldChooserOptions)
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

export type Options = dxPivotGridFieldChooserOptions;

/** @deprecated use Options instead */
export type IOptions = dxPivotGridFieldChooserOptions;
