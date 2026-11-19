import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import type { SvgAttributes } from '@ts/viz/core/renderers/renderer';
import { patchFontOptions as _patchFontOptions } from '@ts/viz/core/utils';

export interface TextAppearance {
  attr: SvgAttributes;
  css: ReturnType<typeof _patchFontOptions>;
  visible?: boolean;
}

export function buildRectAppearance(option: ThemeValue): SvgAttributes {
  const border = option.border || {};
  return {
    fill: option.color,
    opacity: option.opacity,
    stroke: border.color,
    'stroke-width': border.width,
    'stroke-opacity': border.opacity,
    hatching: option.hatching,
  };
}

export function buildTextAppearance(options: ThemeValue, filter?: string): TextAppearance {
  return {
    attr: { filter },
    css: _patchFontOptions(options.font),
  };
}
