const NUMBER_STYLES = new Set([
  'animationIterationCount',
  'borderImageOutset',
  'borderImageSlice',
  'border-imageWidth',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'fillOpacity',
  'flex',
  'flexGrow',
  'flexNegative',
  'flexOrder',
  'flexPositive',
  'flexShrink',
  'floodOpacity',
  'fontWeight',
  'gridColumn',
  'gridRow',
  'lineClamp',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'stopOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
]);

const isNumeric = (value: string | number) => {
  if (typeof value === 'number') return true;
  return !Number.isNaN(Number(value));
};

const getNumberStyleValue = (style: string, value: string | number) => (NUMBER_STYLES.has(style) ? value : `${value}px`);

export function normalizeStyles(styles: unknown): Record<string, string | number> | undefined {
  if (!(styles instanceof Object)) { return undefined; }

  return Object
    .entries(styles)
    .reduce((acc: Record<string, string | number>, [key, value]) => {
      acc[key] = isNumeric(value)
        ? getNumberStyleValue(key, value)
        : value;
      return acc;
    }, {} as Record<string, string | number>);
}
