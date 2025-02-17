import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import { DxEvent } from '../events';

import PivotGridDataSource, {
    Field,
} from './pivot_grid/data_source';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

import {
    FieldChooserLayout,
} from '../common';

import {
    ApplyChangesMode,
    HeaderFilterSearchConfig,
} from '../common/grids';

export {
    ApplyChangesMode,
    FieldChooserLayout,
};

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxPivotGridFieldChooser>;

/**
 * The type of the contextMenuPreparing event handler&apos;s argument.
 */
export type ContextMenuPreparingEvent = EventInfo<dxPivotGridFieldChooser> & {
    /**
     * 
     */
    readonly area?: string;
    /**
     * 
     */
    readonly field?: Field;
    /**
     * 
     */
    readonly event?: DxEvent;
    /**
     * 
     */
    items?: Array<any>;
};

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxPivotGridFieldChooser>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxPivotGridFieldChooser>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxPivotGridFieldChooser> & ChangedOptionInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPivotGridFieldChooserOptions extends WidgetOptions<dxPivotGridFieldChooser> {
    /**
     * Specifies whether the field chooser allows search operations in the &apos;All Fields&apos; section.
     */
    allowSearch?: boolean;
    /**
     * Specifies when to apply changes made in the UI component to the PivotGrid.
     */
    applyChangesMode?: ApplyChangesMode;
    /**
     * The data source of a PivotGrid UI component.
     */
    dataSource?: PivotGridDataSource | null;
    /**
     * Specifies whether HTML tags are displayed as plain text or applied to the values of the header filter.
     */
    encodeHtml?: boolean;
    /**
     * Configures the header filter feature.
     */
    headerFilter?: {
      /**
       * Specifies whether searching is enabled in the header filter.
       * @deprecated Use search.enabled instead.
       */
      allowSearch?: boolean;
      /**
       * Specifies whether a &apos;Select All&apos; option is available to users.
       */
      allowSelectAll?: boolean;
      /**
       * Specifies the height of the popup menu containing filtering values.
       */
      height?: number;
      /**
       * Configures the header filter&apos;s search functionality.
       */
      search?: HeaderFilterSearchConfig;
      /**
       * Specifies a delay in milliseconds between when a user finishes typing in the header filter&apos;s search panel, and when the search is executed.
       * @deprecated Use search.timeout instead.
       */
      searchTimeout?: number;
      /**
       * Specifies whether to show all field values or only those that satisfy the other applied filters.
       */
      showRelevantValues?: boolean;
      /**
       * Configures the texts of the popup menu&apos;s elements.
       */
      texts?: {
        /**
         * Specifies the text of the button that closes the popup menu without applying a filter.
         */
        cancel?: string;
        /**
         * Specifies the name of the item that represents empty values in the popup menu.
         */
        emptyValue?: string;
        /**
         * Specifies the text of the button that applies a filter.
         */
        ok?: string;
      };
      /**
       * Specifies the width of the popup menu containing filtering values.
       */
      width?: number;
    };
    /**
     * Specifies the UI component&apos;s height.
     */
    height?: number | string | (() => number | string);
    /**
     * Specifies the field chooser layout.
     */
    layout?: FieldChooserLayout;
    /**
     * A function that is executed before the context menu is rendered.
     */
    onContextMenuPreparing?: ((e: ContextMenuPreparingEvent) => void);
    /**
     * Specifies a delay in milliseconds between when a user finishes typing in the field chooser&apos;s search panel, and when the search is executed.
     */
    searchTimeout?: number;
    /**
     * The UI component&apos;s state.
     */
    state?: any;
    /**
     * Strings that can be changed or localized in the PivotGridFieldChooser UI component.
     */
    texts?: {
      /**
       * The string to display instead of All Fields.
       */
      allFields?: string;
      /**
       * The string to display instead of Column Fields.
       */
      columnFields?: string;
      /**
       * The string to display instead of Data Fields.
       */
      dataFields?: string;
      /**
       * The string to display instead of Filter Fields.
       */
      filterFields?: string;
      /**
       * The string to display instead of Row Fields.
       */
      rowFields?: string;
    };
}
/**
 * A complementary UI component for the PivotGrid that allows you to manage data displayed in the PivotGrid. The field chooser is already integrated in the PivotGrid and can be invoked using the context menu. If you need to continuously display the field chooser near the PivotGrid UI component, use the PivotGridFieldChooser UI component.
 */
export default class dxPivotGridFieldChooser extends Widget<dxPivotGridFieldChooserOptions> {
    /**
     * Applies changes made in the UI component to the PivotGrid. Takes effect only if applyChangesMode is &apos;onDemand&apos;.
     */
    applyChanges(): void;
    /**
     * Cancels changes made in the UI component without applying them to the PivotGrid. Takes effect only if applyChangesMode is &apos;onDemand&apos;.
     */
    cancelChanges(): void;
    /**
     * Gets the PivotGridDataSource instance.
     */
    getDataSource(): PivotGridDataSource;
    /**
     * Updates the UI component to the size of its content.
     */
    updateDimensions(): void;
}

export type Properties = dxPivotGridFieldChooserOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxPivotGridFieldChooserOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onContextMenuPreparing'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxPivotGridFieldChooserOptions.onContentReady
 * @type_function_param1 e:{ui/pivot_grid_field_chooser:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxPivotGridFieldChooserOptions.onDisposing
 * @type_function_param1 e:{ui/pivot_grid_field_chooser:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxPivotGridFieldChooserOptions.onInitialized
 * @type_function_param1 e:{ui/pivot_grid_field_chooser:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxPivotGridFieldChooserOptions.onOptionChanged
 * @type_function_param1 e:{ui/pivot_grid_field_chooser:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
