export interface dxTemplateOptions {
    /**
     * @docid
     * @type string
     * @prevFileNamespace DevExpress.core
     * @public
     */
    name?: string;
}
/**
 * @docid
 * @section uiWidgetMarkupComponents
 * @type object
 * @prevFileNamespace DevExpress.core
 * @public
 */
export type dxTemplate = Template;
export class Template {
    constructor(options?: dxTemplateOptions)
}

/**
 * @docid
 * @type String|function|Element|jQuery
 * @section Common
 * @prevFileNamespace DevExpress.core
 * @public
 */
export type template = string | Function | Element | JQuery;
