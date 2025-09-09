import Widget, { WidgetOptions } from './widget/ui.widget';

/**
 * @docid
 * @inherits Widget
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxInfernoTextBox extends Widget<dxInfernoTextBoxOptions> { }

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxInfernoTextBoxOptions extends WidgetOptions<dxInfernoTextBox> {
  value?: string;
}

/** @public */
export type Properties = dxInfernoTextBoxOptions;
