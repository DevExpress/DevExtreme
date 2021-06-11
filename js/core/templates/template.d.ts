import {
    UserDefinedElement
} from '../element';

export interface dxTemplateOptions {
    /**
     * @docid
     * @public
     */
    name?: string;
}
/**
 * @docid
 * @section uiWidgetMarkupComponents
 * @type object
 * @public
 */
export type dxTemplate = Template;
export class Template {
    constructor(options?: dxTemplateOptions)
}

/**
 * @docid
 * @section Common
 * @public
 */
export type template = string | Function | UserDefinedElement;
