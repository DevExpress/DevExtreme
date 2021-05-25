import {
    UserDefinedElement
} from '../core/element';

import {
    DxEvent,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import PivotGridDataSource, {
    PivotGridDataSourceField
} from './pivot_grid/data_source';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

/** @public */
export type ContentReadyEvent = EventInfo<dxPivotGridFieldChooser>;

/** @public */
export type ContextMenuPreparingEvent = EventInfo<dxPivotGridFieldChooser> & {
    readonly area?: string;
    readonly field?: PivotGridDataSourceField;
    readonly event?: DxEvent;
    items?: Array<any>;
}

/** @public */
export type DisposingEvent = EventInfo<dxPivotGridFieldChooser>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxPivotGridFieldChooser>;

/** @public */
export type OptionChangedEvent = EventInfo<dxPivotGridFieldChooser> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxPivotGridFieldChooserOptions extends WidgetOptions<dxPivotGridFieldChooser> {
    /**
     * @docid
     * @default false
     * @public
     */
    allowSearch?: boolean;
    /**
     * @docid
     * @type Enums.ApplyChangesMode
     * @default "instantly"
     * @public
     */
    applyChangesMode?: 'instantly' | 'onDemand';
    /**
     * @docid
     * @default null
     * @ref
     * @public
     */
    dataSource?: PivotGridDataSource;
    /**
     * @docid
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
     * @default 400
     * @type_function_return number|string
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @type Enums.PivotGridFieldChooserLayout
     * @default 0
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
     * @type_function_param1_field1 component:dxPivotGridFieldChooser
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onContextMenuPreparing?: ((e: ContextMenuPreparingEvent) => void);
    /**
     * @docid
     * @default 500
     * @public
     */
    searchTimeout?: number;
    /**
     * @docid
     * @default null
     * @public
     */
    state?: any;
    /**
     * @docid
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
 * @namespace DevExpress.ui
 * @public
 */
export default class dxPivotGridFieldChooser extends Widget {
    constructor(element: UserDefinedElement, options?: dxPivotGridFieldChooserOptions)
    /**
     * @docid
     * @publicName applyChanges()
     * @public
     */
    applyChanges(): void;
    /**
     * @docid
     * @publicName cancelChanges()
     * @public
     */
    cancelChanges(): void;
    /**
     * @docid
     * @publicName getDataSource()
     * @return PivotGridDataSource
     * @public
     */
    getDataSource(): PivotGridDataSource;
    /**
     * @docid
     * @publicName updateDimensions()
     * @public
     */
    updateDimensions(): void;
}

/** @public */
export type Properties = dxPivotGridFieldChooserOptions;

/** @deprecated use Properties instead */
export type Options = dxPivotGridFieldChooserOptions;

/** @deprecated use Properties instead */
export type IOptions = dxPivotGridFieldChooserOptions;
