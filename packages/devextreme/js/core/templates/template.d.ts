export type {
    template,
} from '../../common';

/**
 * @docid
 * @type object
 */
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
 * @options dxTemplateOptions
 */
export type dxTemplate = Template;

 // eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Template {
    constructor(options?: dxTemplateOptions);
}
