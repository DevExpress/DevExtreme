import { DataControllerProperties } from './card_view/data_controller';
import Widget, { WidgetOptions } from './widget/ui.widget';

/**
 * @namespace DevExpress.ui
 * @public
 * @docid
 * @deprecated use Properties instead
 * @inherits DataControllerProperties
 */
export interface dxCardViewOptions extends WidgetOptions<dxCardView>,
    DataControllerProperties {

}

/** @public */
export type Properties = dxCardViewOptions;

/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxCardView extends Widget<Properties> {

}
