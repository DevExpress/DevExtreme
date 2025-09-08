import Widget, { WidgetOptions } from './widget/ui.widget';

/**
 * @docid
 * @inherits Widget
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxCounter extends Widget<dxCounterOptions> { }

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxCounterOptions extends WidgetOptions<dxCounter> { }

/** @public */
export type Properties = dxCounterOptions;
