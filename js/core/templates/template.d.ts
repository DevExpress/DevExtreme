export interface dxTemplateOptions {
    /**
     * @docid dxTemplateOptions.name
     * @prevFileNamespace DevExpress.core
     * @public
     */
    name?: string;
}
/**
 * @docid dxTemplate
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
 * @docid template
 * @section Common
 * @prevFileNamespace DevExpress.core
 * @public
 */
export type template = string | Function | Element | JQuery;
