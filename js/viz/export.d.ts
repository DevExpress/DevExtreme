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
 * @static
 * @public
 */
export function exportWidgets(widgetInstances: Array<Array<dxChart | dxPieChart | dxFunnel | dxSankey | dxTreeMap | dxVectorMap | dxSparkline | dxBullet | dxBarGauge>>): void;

/**
 * @docid viz.exportWidgets
 * @publicName exportWidgets(widgetInstances, options)
 * @param2_field format:Enums.ExportFormat
 * @param2_field verticalAlignment:Enums.VerticalAlignment
 * @param2_field horizontalAlignment:Enums.HorizontalAlignment
 * @param2_field proxyUrl:string:deprecated
 * @param2_field svgToCanvas: function(svg, canvas)
 * @static
 * @public
 */
export function exportWidgets(widgetInstances: Array<Array<dxChart | dxPieChart | dxFunnel | dxSankey | dxTreeMap | dxVectorMap | dxSparkline | dxBullet | dxBarGauge>>, options: { fileName?: string; format?: ExportFormat; backgroundColor?: string; margin?: number; gridLayout?: boolean; verticalAlignment?: VerticalAlignment; horizontalAlignment?: HorizontalAlignment; proxyUrl?: string; onExporting?: Function; onExported?: Function; onFileSaving?: Function; svgToCanvas?: Function }): void;

/**
 * @docid viz.getMarkup
 * @publicName getMarkup(widgetInstances)
 * @static
 * @public
 */
export function getMarkup(widgetInstances: Array<Array<dxChart | dxPieChart | dxFunnel | dxSankey | dxTreeMap | dxVectorMap | dxSparkline | dxBullet | dxBarGauge>>): string;
