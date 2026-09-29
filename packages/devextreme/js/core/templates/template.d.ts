import {
    InternalElement,
    UserDefinedElement,
} from '../element';

import {
    TemplateRenderOptions,
} from './function_template';

export type {
    template,
} from '../../common';

/**
 * @docid
 * @hidden
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

export class Template {
    constructor(options?: dxTemplateOptions);
    constructor(element: UserDefinedElement | InternalElement<Element>);

    render(options: TemplateRenderOptions): InternalElement<HTMLElement>;

    source(): InternalElement<HTMLElement>;
}
