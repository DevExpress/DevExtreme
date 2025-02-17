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
import { UserDefinedElement } from '../core/element';

export type VizWidget = dxChart | dxPieChart | dxFunnel | dxSankey | dxTreeMap | dxVectorMap | dxSparkline | dxBullet | dxBarGauge;

/**
 * Allows you to export UI components using their SVG markup.
 */
export function exportFromMarkup(markup: string | UserDefinedElement, options: { fileName?: string; format?: string; backgroundColor?: string; width?: number; height?: number; onExporting?: Function; onExported?: Function; onFileSaving?: Function; margin?: number; svgToCanvas?: Function }): void;

/**
 * Exports one or several UI components to PNG.
 */
export function exportWidgets(widgetInstances: VizWidget | Array<VizWidget> | Array<Array<VizWidget>>): void;

/**
 * Exports one or several UI components.
 */
export function exportWidgets(widgetInstances: VizWidget | Array<VizWidget> | Array<Array<VizWidget>>, options: { fileName?: string; format?: ExportFormat; backgroundColor?: string; margin?: number; gridLayout?: boolean; verticalAlignment?: VerticalAlignment; horizontalAlignment?: HorizontalAlignment; onExporting?: Function; onExported?: Function; onFileSaving?: Function; svgToCanvas?: Function }): void;

/**
 * Gets the SVG markup of specific UI components for their subsequent export.
 */
export function getMarkup(widgetInstances: VizWidget | Array<VizWidget> | Array<Array<VizWidget>>): string;
