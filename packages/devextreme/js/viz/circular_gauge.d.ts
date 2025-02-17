import {
    UserDefinedElement,
} from '../core/element';

import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import {
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import {
    template,
} from '../common';

import {
    BaseGauge,
    BaseGaugeOptions,
    BaseGaugeRangeContainer,
    BaseGaugeScale,
    BaseGaugeScaleLabel,
    GaugeIndicator,
    TooltipInfo,
} from './gauges/base_gauge';

export type CircularGaugeElementOrientation = 'center' | 'inside' | 'outside';
export type CircularGaugeLabelOverlap = 'first' | 'last';

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxCircularGauge>;

/**
 * The type of the drawn event handler&apos;s argument.
 */
export type DrawnEvent = EventInfo<dxCircularGauge>;

/**
 * The type of the exported event handler&apos;s argument.
 */
export type ExportedEvent = EventInfo<dxCircularGauge>;

/**
 * The type of the exporting event handler&apos;s argument.
 */
export type ExportingEvent = EventInfo<dxCircularGauge> & ExportInfo;

/**
 * The type of the fileSaving event handler&apos;s argument.
 */
export type FileSavingEvent = FileSavingEventInfo<dxCircularGauge>;

/**
 * The type of the incidentOccurred event handler&apos;s argument.
 */
export type IncidentOccurredEvent = EventInfo<dxCircularGauge> & IncidentInfo;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxCircularGauge>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxCircularGauge> & ChangedOptionInfo;

/**
 * The type of the tooltipHidden event handler&apos;s argument.
 */
export type TooltipHiddenEvent = EventInfo<dxCircularGauge> & TooltipInfo;

/**
 * The type of the tooltipShown event handler&apos;s argument.
 */
export type TooltipShownEvent = EventInfo<dxCircularGauge> & TooltipInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxCircularGaugeOptions extends BaseGaugeOptions<dxCircularGauge> {
    /**
     * Specifies the properties required to set the geometry of the CircularGauge UI component.
     */
    geometry?: {
      /**
       * Specifies the end angle of the circular gauge&apos;s arc.
       */
      endAngle?: number;
      /**
       * Specifies the start angle of the circular gauge&apos;s arc.
       */
      startAngle?: number;
    };
    /**
     * Specifies a custom template for content in the component&apos;s center.
     */
    centerTemplate?: template | ((component: dxCircularGauge, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
    /**
     * Specifies gauge range container properties.
     */
    rangeContainer?: RangeContainer;
    /**
     * Specifies a gauge&apos;s scale properties.
     */
    scale?: Scale;
    /**
     * Specifies the appearance properties of subvalue indicators.
     */
    subvalueIndicator?: GaugeIndicator;
    /**
     * Specifies the appearance properties of the value indicator.
     */
    valueIndicator?: GaugeIndicator;
}
/**
 * Specifies gauge range container properties.
 */
export type RangeContainer = BaseGaugeRangeContainer & {
    /**
     * Specifies the orientation of the range container in the CircularGauge UI component.
     */
    orientation?: CircularGaugeElementOrientation;
    /**
     * Specifies the range container&apos;s width in pixels.
     */
    width?: number;
};
/**
 * Specifies a gauge&apos;s scale properties.
 */
export type Scale = BaseGaugeScale & {
    /**
     * Specifies common properties for scale labels.
     */
    label?: ScaleLabel;
    /**
     * Specifies the orientation of scale ticks.
     */
    orientation?: CircularGaugeElementOrientation;
};
/**
 * Specifies common properties for scale labels.
 */
export type ScaleLabel = BaseGaugeScaleLabel & {
    /**
     * Specifies which label to hide in case of overlapping.
     */
    hideFirstOrLast?: CircularGaugeLabelOverlap;
    /**
     * Specifies the spacing between scale labels and ticks.
     */
    indentFromTick?: number;
};
/**
 * The CircularGauge is a UI component that indicates values on a circular numeric scale.
 */
export default class dxCircularGauge extends BaseGauge<dxCircularGaugeOptions> { }

export type Properties = dxCircularGaugeOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxCircularGaugeOptions;

// #region deprecated in v23.1

/**
 * @deprecated Use RangeContainer instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxCircularGaugeRangeContainer = RangeContainer;

/**
 * @deprecated Use Scale instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxCircularGaugeScale = Scale;

/**
 * @deprecated Use ScaleLabel instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxCircularGaugeScaleLabel = ScaleLabel;

// #endregion

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Events = {
/**
 * A function that is executed before the UI component is disposed of.
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * A function that is executed when the UI component&apos;s rendering has finished.
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * A function that is executed after the UI component is exported.
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * A function that is executed before the UI component is exported.
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * A function that is executed before a file with exported UI component is saved to the user&apos;s local storage.
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * A function that is executed when an error or warning occurs.
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * A function used in JavaScript frameworks to save the UI component instance.
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * A function that is executed after a UI component property is changed.
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * A function that is executed when a tooltip becomes hidden.
 */
onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
/**
 * A function that is executed when a tooltip appears.
 */
onTooltipShown?: ((e: TooltipShownEvent) => void);
};
///#ENDDEBUG
