import Widget, { WidgetOptions } from './widget/ui.widget';

/**
 * @docid
 * @inherits Widget
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxCheckbox extends Widget<dxCheckboxOptions> { }

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxCheckboxOptions extends WidgetOptions<dxCheckbox> { }

/** @public */
export type Properties = dxCheckboxOptions;
