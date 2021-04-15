import {
    THTMLElement
} from '../element';

export interface dxTemplateOptions {
    /**
     * @docid
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
 * @section Common
 * @prevFileNamespace DevExpress.core
 * @public
 */
export type template = string | Function | THTMLElement;
