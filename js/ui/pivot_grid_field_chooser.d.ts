import {
    DxEvent,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import PivotGridDataSource, {
    Field,
} from './pivot_grid/data_source';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

import {
    FieldChooserLayout,
} from '../common';

import {
    ApplyChangesMode,
    HeaderFilterSearch,
} from '../common/grids';

export {
    ApplyChangesMode,
    FieldChooserLayout,
};

/** @public */
export type ContentReadyEvent = EventInfo<dxPivotGridFieldChooser>;

/** @public */
export type ContextMenuPreparingEvent = EventInfo<dxPivotGridFieldChooser> & {
    readonly area?: string;
    readonly field?: Field;
    readonly event?: DxEvent;
    items?: Array<any>;
};

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
     * @default "instantly"
     * @public
     */
    applyChangesMode?: ApplyChangesMode;
    /**
     * @docid
     * @default null
     * @ref
     * @public
     */
    dataSource?: PivotGridDataSource | null;
    /**
     * @docid
     * @default true
     * @public
     */
    encodeHtml?: boolean;
    /**
     * @docid
     * @public
     */
    headerFilter?: {
      /**
       * @docid
       * @default false
       * @deprecated
       */
      allowSearch?: boolean;
      /**
       * @docid
       * @default true
       */
      allowSelectAll?: boolean;
      /**
       * @docid
       * @default 325
       */
      height?: number;
      /**
       * @docid
       */
      search?: HeaderFilterSearch;
      /**
       * @docid
       * @default 500
       * @deprecated
       */
      searchTimeout?: number;
      /**
       * @docid
       * @default false
       */
      showRelevantValues?: boolean;
      /**
       * @docid
       */
      texts?: {
        /**
         * @docid
         * @default "Cancel"
         */
        cancel?: string;
        /**
         * @docid
         * @default "(Blanks)"
         */
        emptyValue?: string;
        /**
         * @docid
         * @default "Ok"
         */
        ok?: string;
      };
      /**
       * @docid
       * @default 252
       */
      width?: number;
    };
    /**
     * @docid
     * @default 400
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default 0
     * @public
     */
    layout?: FieldChooserLayout;
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxPivotGridFieldChooser
     * @type_function_param1_field field:PivotGridDataSourceOptions.fields
     * @type_function_param1_field event:event
     * @type_function_param1_field items:Array<Object>
     * @default null

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
      allFields?: string;
      /**
       * @docid
       * @default 'Column Fields'
       */
      columnFields?: string;
      /**
       * @docid
       * @default 'Data Fields'
       */
      dataFields?: string;
      /**
       * @docid
       * @default 'Filter Fields'
       */
      filterFields?: string;
      /**
       * @docid
       * @default 'Row Fields'
       */
      rowFields?: string;
    };
}
/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxPivotGridFieldChooser extends Widget<dxPivotGridFieldChooserOptions> {
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
