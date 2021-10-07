import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions,
} from './collection/ui.collection_widget.base';

/** @public */
export type ContentReadyEvent<
    TItem extends string | CollectionWidgetItem<any> | any = any,
    TKey = any,
> = EventInfo<dxValidationSummary<TItem, TKey>>;

/** @public */
export type DisposingEvent<
    TItem extends string | CollectionWidgetItem<any> | any = any,
    TKey = any,
> = EventInfo<dxValidationSummary<TItem, TKey>>;

/** @public */
export type InitializedEvent<
    TItem extends string | CollectionWidgetItem<any> | any = any,
    TKey = any,
> = InitializedEventInfo<dxValidationSummary<TItem, TKey>>;

/** @public */
export type ItemClickEvent<
    TItem extends string | CollectionWidgetItem<any> | any = any,
    TKey = any,
> = NativeEventInfo<dxValidationSummary<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type OptionChangedEvent<
    TItem extends string | CollectionWidgetItem<any> | any = any,
    TKey = any,
> = EventInfo<dxValidationSummary<TItem, TKey>> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxValidationSummaryOptions<
    TItem extends string | CollectionWidgetItem<any> | any = any,
    TKey = any,
> extends CollectionWidgetOptions<dxValidationSummary<TItem, TKey>, TItem, TKey> {
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
 * @namespace DevExpress.ui
 * @public
 */
export default class dxValidationSummary<
    TItem extends string | CollectionWidgetItem<any> | any = any,
    TKey = any,
> extends CollectionWidget<dxValidationSummaryOptions<TItem, TKey>, TItem, TKey> { }

/** @public */
export type ExplicitTypes<
    TItem extends string | CollectionWidgetItem<any> | any,
    TKey,
> = {
    Properties: Properties<TItem, TKey>;
    ContentReadyEvent: ContentReadyEvent<TItem, TKey>;
    DisposingEvent: DisposingEvent<TItem, TKey>;
    InitializedEvent: InitializedEvent<TItem, TKey>;
    ItemClickEvent: ItemClickEvent<TItem, TKey>;
    OptionChangedEvent: OptionChangedEvent<TItem, TKey>;
};

/** @public */
export type Properties<
    TItem extends string | CollectionWidgetItem<any> | any = any,
    TKey = any,
> = dxValidationSummaryOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends string | CollectionWidgetItem<any> | any = any,
    TKey = any,
> = Properties<TItem, TKey>;

/** @deprecated use Properties instead */
export type IOptions<
    TItem extends string | CollectionWidgetItem<any> | any = any,
    TKey = any,
> = Properties<TItem, TKey>;
