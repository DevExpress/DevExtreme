import {
    UserDefinedElement
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import CollectionWidget, {
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

/** @public */
export type ContentReadyEvent = EventInfo<dxValidationSummary>;

/** @public */
export type DisposingEvent = EventInfo<dxValidationSummary>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxValidationSummary>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxValidationSummary> & ItemInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxValidationSummary> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxValidationSummaryOptions extends CollectionWidgetOptions<dxValidationSummary> {
    /**
     * @docid
     * @ref
     * @public
     */
    validationGroup?: string;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/validation_summary
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxValidationSummary extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxValidationSummaryOptions)
}

/** @public */
export type Properties = dxValidationSummaryOptions;

/** @deprecated use Properties instead */
export type Options = dxValidationSummaryOptions;

/** @deprecated use Properties instead */
export type IOptions = dxValidationSummaryOptions;
