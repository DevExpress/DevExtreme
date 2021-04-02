import {
    TElement
} from '../core/element';

import {
    ComponentEvent,
    ComponentNativeEvent,
    ComponentDisposingEvent,
    ComponentInitializedEvent,
    ComponentOptionChangedEvent,
    ItemInfo
} from '../events/index';

import CollectionWidget, {
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

/** @public */
export type ContentReadyEvent = ComponentEvent<dxValidationSummary>;

/** @public */
export type DisposingEvent = ComponentDisposingEvent<dxValidationSummary>;

/** @public */
export type InitializedEvent = ComponentInitializedEvent<dxValidationSummary>;

/** @public */
export type ItemClickEvent = ComponentNativeEvent<dxValidationSummary> & ItemInfo;

/** @public */
export type OptionChangedEvent = ComponentOptionChangedEvent<dxValidationSummary>;

export interface dxValidationSummaryOptions extends CollectionWidgetOptions<dxValidationSummary> {
    /**
     * @docid
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationGroup?: string;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/validation_summary
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxValidationSummary extends CollectionWidget {
    constructor(element: TElement, options?: dxValidationSummaryOptions)
}

export type Options = dxValidationSummaryOptions;

/** @deprecated use Options instead */
export type IOptions = dxValidationSummaryOptions;
