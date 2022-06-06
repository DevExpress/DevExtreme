export type AnimationEasing = 'easeOutCubic' | 'linear';
export type Palette = 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
export type PaletteColorSet = 'simpleSet' | 'indicatingSet' | 'gradientSet';
export type PaletteExtensionMode = 'alternate' | 'blend' | 'extrapolate';
export type PointSymbol = 'circle' | 'cross' | 'polygon' | 'square' | 'triangle' | 'triangleDown' | 'triangleUp';
export type TextOverflow = 'ellipsis' | 'hide' | 'none';
export type Theme = 'generic.dark' | 'generic.light' | 'generic.contrast' | 'generic.carmine' | 'generic.darkmoon' | 'generic.darkviolet' | 'generic.greenmist' | 'generic.softblue' | 'material.blue.light' | 'material.lime.light' | 'material.orange.light' | 'material.purple.light' | 'material.teal.light';
export type TimeInterval = 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
export type WordWrap = 'normal' | 'breakWord' | 'none';

export type LabelOverlapping = 'hide' | 'none';
export type ChartLabelOverlapping = 'hide' | 'none' | 'stack';
export type ChartAxisLabelOverlapping = 'rotate' | 'stagger' | 'none' | 'hide';
export type FunnelLabelOverlapping = 'hide' | 'none' | 'shift';
export type CircularGaugeLabelOverlapping = 'first' | 'last';

export type ZoomPanAction = 'zoom' | 'pan';
export type ChartDataType = 'datetime' | 'numeric' | 'string';

export type LegendHoverMode = 'excludePoints' | 'includePoints' | 'none';
export type SeriesHoverMode = 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';
export type SeriesSelectionMode = 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';
export type PointInteractionMode = 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';

export type LegendMarkerState = 'normal' | 'hovered' | 'selected';

export type CircularGaugeElementOrientation = 'center' | 'inside' | 'outside';

export type LabelPosition = 'columns' | 'inside' | 'outside';
export type SankeyColorMode = 'none' | 'source' | 'target' | 'gradient';
export type DiscreteAxisDivisionMode = 'betweenLabels' | 'crossLabels';
export type AxisScaleType = 'continuous' | 'discrete' | 'logarithmic';
export type ArgumentAxisHoverMode = 'allArgumentPoints' | 'none';

export type FunnelAlgorithm = 'dynamicHeight' | 'dynamicSlope';
export type HatchingDirection = 'left' | 'none' | 'right';
