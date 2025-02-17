export type {
    template,
} from '../../common';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxTemplateOptions {
    /**
     * Specifies the name of the template.
     */
    name?: string;
}
/**
 * A custom template&apos;s markup.
 */
export type dxTemplate = Template;

 // eslint-disable-next-line @typescript-eslint/no-extraneous-class
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export class Template {
    constructor(options?: dxTemplateOptions);
}
