import CollectionWidget, {
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

export interface dxValidationSummaryOptions extends CollectionWidgetOptions<dxValidationSummary> {
    /**
     * @docid dxValidationSummaryOptions.validationGroup
     * @type string
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationGroup?: string;
}
/**
 * @docid dxValidationSummary
 * @inherits CollectionWidget
 * @module ui/validation_summary
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxValidationSummary extends CollectionWidget {
    constructor(element: Element, options?: dxValidationSummaryOptions)
    constructor(element: JQuery, options?: dxValidationSummaryOptions)
}

declare global {
interface JQuery {
    dxValidationSummary(): JQuery;
    dxValidationSummary(options: "instance"): dxValidationSummary;
    dxValidationSummary(options: string): any;
    dxValidationSummary(options: string, ...params: any[]): any;
    dxValidationSummary(options: dxValidationSummaryOptions): JQuery;
}
}
export type Options = dxValidationSummaryOptions;

/** @deprecated use Options instead */
export type IOptions = dxValidationSummaryOptions;