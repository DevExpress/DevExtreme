import {
    ExportFormat,
    HorizontalAlignment,
    VerticalAlignment,
} from '../common';

import dxChart from './chart';
import dxPieChart from './pie_chart';
import dxFunnel from './funnel';
import dxSankey from './sankey';
import dxTreeMap from './tree_map';
import dxVectorMap from './vector_map';
import dxSparkline from './sparkline';
import dxBullet from './bullet';
import dxBarGauge from './bar_gauge';

/**
 * @public
 */
export type VizWidget = dxChart | dxPieChart | dxFunnel | dxSankey | dxTreeMap | dxVectorMap | dxSparkline | dxBullet | dxBarGauge;

/**
 * @docid viz.exportFromMarkup
 * @publicName exportFromMarkup(markup, options)
 * @param2_field proxyUrl:string:deprecated
 * @param2_field svgToCanvas: function(svg, canvas)
 * @static
 * @public
 */
export function exportFromMarkup(markup: string, options: { fileName?: string; format?: string; backgroundColor?: string; proxyUrl?: string; width?: number; height?: number; onExporting?: Function; onExported?: Function; onFileSaving?: Function; margin?: number; svgToCanvas?: Function }): void;

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
 * @param2_field proxyUrl:string:deprecated
 * @param2_field svgToCanvas: function(svg, canvas)
 * @static
 * @public
 */
export function exportWidgets(widgetInstances: VizWidget | Array<VizWidget> | Array<Array<VizWidget>>, options: { fileName?: string; format?: ExportFormat; backgroundColor?: string; margin?: number; gridLayout?: boolean; verticalAlignment?: VerticalAlignment; horizontalAlignment?: HorizontalAlignment; proxyUrl?: string; onExporting?: Function; onExported?: Function; onFileSaving?: Function; svgToCanvas?: Function }): void;

/**
 * @docid viz.getMarkup
 * @publicName getMarkup(widgetInstances)
 * @param1 widgetInstances: Array<Array<dxChart | dxPieChart | dxFunnel | dxSankey | dxTreeMap | dxVectorMap | dxSparkline | dxBullet | dxBarGauge>>
 * @static
 * @public
 */
export function getMarkup(widgetInstances: VizWidget | Array<VizWidget> | Array<Array<VizWidget>>): string;
