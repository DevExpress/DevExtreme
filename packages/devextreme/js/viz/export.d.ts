import {
    ExportFormat,
    HorizontalAlignment,
    VerticalAlignment,
} from '../common';

import type dxChart from './chart';
import type dxPieChart from './pie_chart';
import type dxFunnel from './funnel';
import type dxSankey from './sankey';
import type dxTreeMap from './tree_map';
import type dxVectorMap from './vector_map';
import type dxSparkline from './sparkline';
import type dxBullet from './bullet';
import type dxBarGauge from './bar_gauge';

/**
 * @public
 */
export type VizWidget = dxChart | dxPieChart | dxFunnel | dxSankey | dxTreeMap | dxVectorMap | dxSparkline | dxBullet | dxBarGauge;

/**
 * @docid viz.exportFromMarkup
 * @publicName exportFromMarkup(markup, options)
 * @param2_field svgToCanvas: function(svg, canvas)
 * @static
 * @public
 */
export function exportFromMarkup(markup: string, options: { fileName?: string; format?: string; backgroundColor?: string; width?: number; height?: number; onExporting?: Function; onExported?: Function; onFileSaving?: Function; margin?: number; svgToCanvas?: Function }): void;

/**
 * @docid viz.exportWidgets
 * @publicName exportWidgets(widgetInstances)
 * @param1 widgetInstances: Array<Array<dxChart | dxPieChart | dxFunnel | dxSankey | dxTreeMap | dxVectorMap | dxSparkline | dxBullet | dxBarGauge>>
 * @static
 * @public
 */
export function exportWidgets(widgetInstances: VizWidget | Array<VizWidget> | Array<Array<VizWidget>>): void;

/**
 * @docid viz.exportWidgets
 * @publicName exportWidgets(widgetInstances, options)
 * @param1 widgetInstances: Array<Array<dxChart | dxPieChart | dxFunnel | dxSankey | dxTreeMap | dxVectorMap | dxSparkline | dxBullet | dxBarGauge>>
 * @param2_field format:Enums.ExportFormat
 * @param2_field verticalAlignment:Enums.VerticalAlignment
 * @param2_field horizontalAlignment:Enums.HorizontalAlignment
 * @param2_field svgToCanvas: function(svg, canvas)
 * @static
 * @public
 */
export function exportWidgets(widgetInstances: VizWidget | Array<VizWidget> | Array<Array<VizWidget>>, options: { fileName?: string; format?: ExportFormat; backgroundColor?: string; margin?: number; gridLayout?: boolean; verticalAlignment?: VerticalAlignment; horizontalAlignment?: HorizontalAlignment; onExporting?: Function; onExported?: Function; onFileSaving?: Function; svgToCanvas?: Function }): void;

/**
 * @docid viz.getMarkup
 * @publicName getMarkup(widgetInstances)
 * @param1 widgetInstances: Array<Array<dxChart | dxPieChart | dxFunnel | dxSankey | dxTreeMap | dxVectorMap | dxSparkline | dxBullet | dxBarGauge>>
 * @static
 * @public
 */
export function getMarkup(widgetInstances: VizWidget | Array<VizWidget> | Array<Array<VizWidget>>): string;
