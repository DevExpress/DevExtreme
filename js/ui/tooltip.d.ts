import dxPopover, {
    dxPopoverOptions
} from './popover';

export interface dxTooltipOptions extends dxPopoverOptions<dxTooltip> {
}
/**
 * @docid dxTooltip
 * @inherits dxPopover
 * @hasTranscludedContent
 * @module ui/tooltip
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxTooltip extends dxPopover {
    constructor(element: Element, options?: dxTooltipOptions)
    constructor(element: JQuery, options?: dxTooltipOptions)
}

declare global {
interface JQuery {
    dxTooltip(): JQuery;
    dxTooltip(options: "instance"): dxTooltip;
    dxTooltip(options: string): any;
    dxTooltip(options: string, ...params: any[]): any;
    dxTooltip(options: dxTooltipOptions): JQuery;
}
}
export type Options = dxTooltipOptions;

/** @deprecated use Options instead */
export type IOptions = dxTooltipOptions;