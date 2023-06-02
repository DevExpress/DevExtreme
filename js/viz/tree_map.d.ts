import DataSource, { DataSourceLike } from '../data/data_source';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import BaseWidget, {
    BaseWidgetMargin,
    BaseWidgetOptions,
    BaseWidgetTooltip,
    Font,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import {
    SingleMultipleOrNone,
} from '../common';

import {
    Palette,
    PaletteExtensionMode,
    TextOverflow,
    WordWrap,
} from '../common/charts';

export {
    Palette,
    PaletteExtensionMode,
    TextOverflow,
    WordWrap,
};

/** @public */
export type TreeMapColorizerType = 'discrete' | 'gradient' | 'none' | 'range';
/** @public */
export type TreeMapLayoutAlgorithm = 'sliceanddice' | 'squarified' | 'strip';
/** @public */
export type TreeMapLayoutDirection = 'leftBottomRightTop' | 'leftTopRightBottom' | 'rightBottomLeftTop' | 'rightTopLeftBottom';

export interface InteractionInfo {
  readonly node: dxTreeMapNode;
}

/** @public */
export type ClickEvent = NativeEventInfo<dxTreeMap, MouseEvent | PointerEvent> & {
  readonly node: dxTreeMapNode;
};

/** @public */
export type DisposingEvent = EventInfo<dxTreeMap>;

/** @public */
export type DrawnEvent = EventInfo<dxTreeMap>;

/** @public */
export type DrillEvent = EventInfo<dxTreeMap> & {
  readonly node: dxTreeMapNode;
};

/** @public */
export type ExportedEvent = EventInfo<dxTreeMap>;

/** @public */
export type ExportingEvent = EventInfo<dxTreeMap> & ExportInfo;

/** @public */
export type FileSavingEvent = FileSavingEventInfo<dxTreeMap>;

/** @public */
export type HoverChangedEvent = EventInfo<dxTreeMap> & InteractionInfo;

/** @public */
export type IncidentOccurredEvent = EventInfo<dxTreeMap> & IncidentInfo;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxTreeMap>;

/** @public */
export type NodesInitializedEvent = EventInfo<dxTreeMap> & {
    readonly root: dxTreeMapNode;
};

/** @public */
export type NodesRenderingEvent = EventInfo<dxTreeMap> & {
    readonly node: dxTreeMapNode;
};

/** @public */
export type OptionChangedEvent = EventInfo<dxTreeMap> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxTreeMap> & InteractionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 * @docid
 */
export interface dxTreeMapOptions extends BaseWidgetOptions<dxTreeMap> {
    /**
     * @docid
     * @default 'items'
     * @public
     */
    childrenField?: string;
    /**
     * @docid
     * @default 'color'
     * @public
     */
    colorField?: string;
    /**
     * @docid
     * @public
     */
    colorizer?: {
      /**
       * @docid
       * @default undefined
       */
      colorCodeField?: string;
      /**
       * @docid
       * @default false
       */
      colorizeGroups?: boolean;
      /**
       * @docid
       * @default "Material"
       */
      palette?: Array<string> | Palette;
      /**
       * @docid
       * @default 'blend'
       */
      paletteExtensionMode?: PaletteExtensionMode;
      /**
       * @docid
       * @default undefined
       */
      range?: Array<number>;
      /**
       * @docid
       * @default undefined
       */
      type?: TreeMapColorizerType;
    };
    /**
     * @docid
     * @notUsedInTheme
     * @public
     * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
     */
    dataSource?: DataSourceLike<any> | null;
    /**
     * @docid
     * @public
     */
    group?: {
      /**
       * @docid
       */
      border?: {
        /**
         * @docid
         * @default "#d3d3d3"
         */
        color?: string;
        /**
         * @docid
         * @default 1
         */
        width?: number;
      };
      /**
       * @docid
       * @default "#eeeeee"
       */
      color?: string;
      /**
       * @docid
       * @default 4
       */
      padding?: number;
      /**
       * @docid
       * @default undefined
       */
      headerHeight?: number;
      /**
       * @docid
       * @default undefined
       */
      hoverEnabled?: boolean;
      /**
       * @docid
       */
      hoverStyle?: {
        /**
         * @docid
         */
        border?: {
          /**
           * @docid
           * @default undefined
           */
          color?: string;
          /**
           * @docid
           * @default undefined
           */
          width?: number;
        };
        /**
         * @docid
         * @default undefined
         */
        color?: string;
      };
      /**
       * @docid
       */
      label?: {
        /**
         * @docid
         * @default '#767676' &prop(color)
         * @default 600 &prop(weight)
         */
        font?: Font;
        /**
         * @docid
         * @default "ellipsis"
         */
        textOverflow?: TextOverflow;
        /**
         * @docid
         * @default true
         */
        visible?: boolean;
      };
      /**
       * @docid
       */
      selectionStyle?: {
        /**
         * @docid
         */
        border?: {
          /**
           * @docid
           * @default "#232323"
           */
          color?: string;
          /**
           * @docid
           * @default undefined
           */
          width?: number;
        };
        /**
         * @docid
         * @default undefined
         */
        color?: string;
      };
    };
    /**
     * @docid
     * @default undefined
     * @public
     */
    hoverEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    idField?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    interactWithGroup?: boolean;
    /**
     * @docid
     * @default 'name'
     * @public
     */
    labelField?: string;
    /**
     * @docid
     * @type Enums.TreeMapLayoutAlgorithm | function
     * @default 'squarified'
     * @type_function_return void
     * @public
     */
    layoutAlgorithm?: TreeMapLayoutAlgorithm | ((e: { rect?: Array<number>; sum?: number; items?: Array<any> }) => any);
    /**
     * @docid
     * @default 'leftTopRightBottom'
     * @public
     */
    layoutDirection?: TreeMapLayoutDirection;
    /**
     * @docid
     * @type object
     * @hidden
     */
    margin?: BaseWidgetMargin;
    /**
     * @docid
     * @default undefined
     * @public
     */
    maxDepth?: number;
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:{viz/tree_map:ClickEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onClick?: ((e: ClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/tree_map:DrillEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onDrill?: ((e: DrillEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/tree_map:HoverChangedEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onHoverChanged?: ((e: HoverChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/tree_map:NodesInitializedEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onNodesInitialized?: ((e: NodesInitializedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/tree_map:NodesRenderingEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onNodesRendering?: ((e: NodesRenderingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/tree_map:SelectionChangedEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @default undefined
     * @public
     */
    parentField?: string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    selectionMode?: SingleMultipleOrNone;
    /**
     * @docid
     * @public
     */
    tile?: {
      /**
       * @docid
       */
      border?: {
        /**
         * @docid
         * @default "#000000"
         */
        color?: string;
        /**
         * @docid
         * @default 1
         */
        width?: number;
      };
      /**
       * @docid
       * @default "#$5f8b95"
       */
      color?: string;
      /**
       * @docid
       */
      hoverStyle?: {
        /**
         * @docid
         */
        border?: {
          /**
           * @docid
           * @default undefined
           */
          color?: string;
          /**
           * @docid
           * @default undefined
           */
          width?: number;
        };
        /**
         * @docid
         * @default undefined
         */
        color?: string;
      };
      /**
       * @docid
       */
      label?: {
        /**
         * @docid
         * @default '#FFFFFF' &prop(color)
         * @default 300 &prop(weight)
         */
        font?: Font;
        /**
         * @docid
         * @default "ellipsis"
         */
        textOverflow?: TextOverflow;
        /**
         * @docid
         * @defaultValue true
         */
        visible?: boolean;
        /**
         * @docid
         * @default "normal"
         */
        wordWrap?: WordWrap;
      };
      /**
       * @docid
       */
      selectionStyle?: {
        /**
         * @docid
         */
        border?: {
          /**
           * @docid
           * @default "#232323"
           */
          color?: string;
          /**
           * @docid
           * @default undefined
           */
          width?: number;
        };
        /**
         * @docid
         * @default undefined
         */
        color?: string;
      };
    };
    /**
     * @docid
     * @type object
     * @public
     */
    tooltip?: dxTreeMapTooltip;
    /**
     * @docid
     * @default 'value'
     * @public
     */
    valueField?: string;
}
/**
 * @docid
 * @namespace DevExpress.viz
 */
export interface dxTreeMapTooltip extends BaseWidgetTooltip {
    /**
     * @docid dxTreeMapOptions.tooltip.contentTemplate
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    contentTemplate?: template | ((info: { value?: number; valueText?: string; node?: dxTreeMapNode }, element: DxElement) => string | UserDefinedElement);
    /**
     * @docid dxTreeMapOptions.tooltip.customizeTooltip
     * @default undefined
     * @type_function_return object
     * @public
     */
    customizeTooltip?: ((info: { value?: number; valueText?: string; node?: dxTreeMapNode }) => any);
}
/**
 * @docid
 * @inherits BaseWidget, DataHelperMixin
 * @namespace DevExpress.viz
 * @public
 */
export default class dxTreeMap extends BaseWidget<dxTreeMapOptions> {
    /**
     * @docid
     * @publicName clearSelection()
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @publicName drillUp()
     * @public
     */
    drillUp(): void;
    /**
     * @docid
     * @publicName getCurrentNode()
     * @public
     */
    getCurrentNode(): dxTreeMapNode;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName getRootNode()
     * @public
     */
    getRootNode(): dxTreeMapNode;
    /**
     * @docid
     * @publicName hideTooltip()
     * @public
     */
    hideTooltip(): void;
    /**
     * @docid
     * @publicName resetDrillDown()
     * @public
     */
    resetDrillDown(): void;
}

/**
 * @docid
 * @publicName Node
 * @namespace DevExpress.viz
 */
export interface dxTreeMapNode {
    /**
     * @docid
     * @publicName customize(options)
     * @param1 options:object
     * @public
     */
    customize(options: any): void;
    /**
     * @docid
     * @public
     */
    data?: any;
    /**
     * @docid
     * @publicName drillDown()
     * @public
     */
    drillDown(): void;
    /**
     * @docid
     * @publicName getAllChildren()
     * @public
     */
    getAllChildren(): Array<dxTreeMapNode>;
    /**
     * @docid
     * @publicName getAllNodes()
     * @public
     */
    getAllNodes(): Array<dxTreeMapNode>;
    /**
     * @docid
     * @publicName getChild(index)
     * @public
     */
    getChild(index: number): dxTreeMapNode;
    /**
     * @docid
     * @publicName getChildrenCount()
     * @public
     */
    getChildrenCount(): number;
    /**
     * @docid
     * @publicName getParent()
     * @public
     */
    getParent(): dxTreeMapNode;
    /**
     * @docid
     * @public
     */
    index?: number;
    /**
     * @docid
     * @publicName isActive()
     * @public
     */
    isActive(): boolean;
    /**
     * @docid
     * @publicName isHovered()
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid
     * @publicName isLeaf()
     * @public
     */
    isLeaf(): boolean;
    /**
     * @docid
     * @publicName isSelected()
     * @public
     */
    isSelected(): boolean;
    /**
     * @docid
     * @publicName label()
     * @public
     */
    label(): string;
    /**
     * @docid
     * @publicName label(label)
     * @public
     */
    label(label: string): void;
    /**
     * @docid
     * @public
     */
    level?: number;
    /**
     * @docid
     * @publicName resetCustomization()
     * @public
     */
    resetCustomization(): void;
    /**
     * @docid
     * @publicName select(state)
     * @public
     */
    select(state: boolean): void;
    /**
     * @docid
     * @publicName showTooltip()
     * @public
     */
    showTooltip(): void;
    /**
     * @docid
     * @publicName value()
     * @public
     */
    value(): number;
}

/** @public */
export type Properties = dxTreeMapOptions;

/** @deprecated use Properties instead */
export type Options = dxTreeMapOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onClick' | 'onDrill' | 'onHoverChanged' | 'onNodesInitialized' | 'onNodesRendering' | 'onSelectionChanged'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxTreeMapOptions.onDisposing
 * @type_function_param1 e:{viz/tree_map:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxTreeMapOptions.onDrawn
 * @type_function_param1 e:{viz/tree_map:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @skip
 * @docid dxTreeMapOptions.onExported
 * @type_function_param1 e:{viz/tree_map:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @skip
 * @docid dxTreeMapOptions.onExporting
 * @type_function_param1 e:{viz/tree_map:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @skip
 * @docid dxTreeMapOptions.onFileSaving
 * @type_function_param1 e:{viz/tree_map:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @skip
 * @docid dxTreeMapOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/tree_map:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @skip
 * @docid dxTreeMapOptions.onInitialized
 * @type_function_param1 e:{viz/tree_map:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxTreeMapOptions.onOptionChanged
 * @type_function_param1 e:{viz/tree_map:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
