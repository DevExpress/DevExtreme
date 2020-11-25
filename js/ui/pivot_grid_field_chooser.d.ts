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
     * @docid dxPivotGridFieldChooserOptions.allowSearch
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowSearch?: boolean;
    /**
     * @docid dxPivotGridFieldChooserOptions.applyChangesMode
     * @type Enums.ApplyChangesMode
     * @default "instantly"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    applyChangesMode?: 'instantly' | 'onDemand';
    /**
     * @docid dxPivotGridFieldChooserOptions.dataSource
     * @default null
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: PivotGridDataSource;
    /**
     * @docid dxPivotGridFieldChooserOptions.headerFilter
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    headerFilter?: { allowSearch?: boolean, height?: number, searchTimeout?: number, showRelevantValues?: boolean, texts?: { cancel?: string, emptyValue?: string, ok?: string }, width?: number };
    /**
     * @docid dxPivotGridFieldChooserOptions.height
     * @default 400
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid dxPivotGridFieldChooserOptions.layout
     * @type Enums.PivotGridFieldChooserLayout
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    layout?: 0 | 1 | 2;
    /**
     * @docid dxPivotGridFieldChooserOptions.onContextMenuPreparing
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
     * @docid dxPivotGridFieldChooserOptions.searchTimeout
     * @default 500
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchTimeout?: number;
    /**
     * @docid dxPivotGridFieldChooserOptions.state
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    state?: any;
    /**
     * @docid dxPivotGridFieldChooserOptions.texts
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    texts?: { allFields?: string, columnFields?: string, dataFields?: string, filterFields?: string, rowFields?: string };
}
/**
 * @docid dxPivotGridFieldChooser
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
     * @docid dxPivotGridFieldChooser.applyChanges
     * @publicName applyChanges()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    applyChanges(): void;
    /**
     * @docid dxPivotGridFieldChooser.cancelChanges
     * @publicName cancelChanges()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cancelChanges(): void;
    /**
     * @docid dxPivotGridFieldChooser.getDataSource
     * @publicName getDataSource()
     * @return PivotGridDataSource
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getDataSource(): PivotGridDataSource;
    /**
     * @docid dxPivotGridFieldChooser.updateDimensions
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
