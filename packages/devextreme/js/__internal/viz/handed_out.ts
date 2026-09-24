import { isPlainObject } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import domAdapter from '@ts/core/dom_adapter';
import { fallbackOf, isCssVariableReference, resolvedInScope } from '@ts/core/utils/css_variables';
import * as raw from '@ts/viz/palette';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const LEFT_TO_THE_BROWSER = /var\(|color-mix\(|\(from /;
const PAINTED = /^(?:rgba?\(|color\(srgb )/;
const NUMBER = /-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi;

type Page = HTMLElement | undefined;

type Resolved = Map<string, string | undefined>;

interface Source {
  source: unknown;
  page?: HTMLElement;
}

interface Colors {
  getColor: (at: number) => unknown;
}

interface Extension {
  extensionMode?: string;
  keepLastColorInEnd?: boolean;
  useHighlight?: boolean;
}

interface GenerationOptions extends Omit<Extension, 'extensionMode'> {
  baseColorSet?: string;
  paletteExtensionMode?: string;
}

function isLeftToTheBrowser(value: unknown): value is string {
  return typeof value === 'string' && LEFT_TO_THE_BROWSER.test(value);
}

export function paintingPage(): Page {
  return hasWindow() && typeof getWindow().getComputedStyle === 'function'
    ? domAdapter.getDocumentElement()
    : undefined;
}

function asHandedOut(painted: string): string | undefined {
  if (!PAINTED.test(painted) || LEFT_TO_THE_BROWSER.test(painted)) {
    return undefined;
  }

  const isColorFunction = painted.startsWith('color(');
  const channels = isColorFunction ? painted.slice(painted.indexOf(' ')) : painted;
  const numbers = (channels.match(NUMBER) ?? []).map(Number);

  if (numbers.length < 3) {
    return undefined;
  }

  const scale = isColorFunction ? 255 : 1;
  const [red, green, blue] = numbers
    .slice(0, 3)
    .map((value) => Math.round(Math.min(255, Math.max(0, value * scale))));
  const alpha = numbers.length > 3 ? numbers[3] : 1;

  return alpha < 1
    ? `rgba(${red}, ${green}, ${blue}, ${alpha})`
    : `#${[red, green, blue].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

function asRgb(value: string): string {
  return `color-mix(in srgb, ${value} 100%, transparent)`;
}

function paintedOn(page: HTMLElement, values: string[]): (string | undefined)[] {
  const probe = domAdapter.createElementNS(SVG_NAMESPACE, 'svg') as SVGElement;
  const swatchOf = (fill: string): SVGElement => {
    const swatch = domAdapter.createElementNS(SVG_NAMESPACE, 'rect') as SVGElement;

    swatch.style.setProperty('fill', fill);
    probe.appendChild(swatch);

    return swatch;
  };
  const swatches = values.map((value) => [swatchOf(value), swatchOf(asRgb(value))]);

  probe.style.setProperty('display', 'none');
  probe.style.setProperty('fill', 'none');
  page.appendChild(probe);

  const painted = swatches.map((pair) => pair
    .map((swatch) => asHandedOut(getWindow().getComputedStyle(swatch).fill))
    .find((color) => color !== undefined));

  probe.remove();

  return painted;
}

function literalOf(value: string, page: Page): string | undefined {
  const literal = value.startsWith('var(') ? resolvedInScope(value, page) : fallbackOf(value);

  return isCssVariableReference(literal) ? undefined : literal;
}

function collectNames(value: unknown, names: Set<string>): Set<string> {
  if (isLeftToTheBrowser(value)) {
    names.add(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectNames(item, names));
  } else if (isPlainObject(value)) {
    Object.values(value).forEach((item) => collectNames(item, names));
  }

  return names;
}

function rebuilt(value: unknown, resolved: Resolved): unknown {
  if (typeof value === 'string') {
    return resolved.has(value) ? resolved.get(value) : value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => rebuilt(item, resolved));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, rebuilt(item, resolved)]),
    );
  }

  return value;
}

export function handedOut<T>(value: T, page: Page): T {
  const names = Array.from(collectNames(value, new Set()));

  if (!names.length) {
    return value;
  }

  const painted = page ? paintedOn(page, names) : [];
  const resolved: Resolved = new Map(
    names.map((name, index) => [name, painted[index] ?? literalOf(name, page)]),
  );

  return rebuilt(value, resolved) as T;
}

function paletteSource(source: unknown, set: string | undefined, themeDefault: unknown): Source {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const colors: unknown[] = raw.getPalette(source, { type: set || 'simpleSet', themeDefault });
  const names = colors.filter(isLeftToTheBrowser);

  if (!names.length) {
    return { source };
  }

  const page = paintingPage();

  if (page && paintedOn(page, names).some((painted) => painted !== undefined)) {
    return { source, page };
  }

  return { source: handedOut(colors, undefined) };
}

export function getPalette(palette: unknown, parameters?: unknown): unknown {
  return handedOut(raw.getPalette(palette, parameters), paintingPage());
}

export function getAccentColor(palette: unknown, themeDefault?: unknown): unknown {
  return handedOut(raw.getAccentColor(palette, themeDefault), paintingPage());
}

export function generateColors(
  palette: unknown,
  count: number,
  options?: GenerationOptions,
): unknown {
  const { source, page } = paletteSource(palette, options?.baseColorSet, undefined);
  const generated = raw.generateColors(
    source,
    count,
    options as Parameters<typeof raw.generateColors>[2],
  );

  return handedOut(generated, page);
}

export function createPalette(
  palette: unknown,
  parameters?: Extension & { type?: string },
  themeDefaultPalette?: unknown,
): ReturnType<typeof raw.createPalette> {
  const { source, page } = paletteSource(palette, parameters?.type, themeDefaultPalette);
  const created = raw.createPalette(source, parameters, themeDefaultPalette);

  if (!page) {
    return created;
  }

  const { getNextColor, generateColors: generate } = created;

  created.getNextColor = (count): unknown => handedOut(getNextColor.call(created, count), page);
  created.generateColors = (count, options): unknown => handedOut(
    generate.call(created, count, options),
    page,
  );

  return created;
}

export function getDiscretePalette(
  source: unknown,
  size: number,
  themeDefaultPalette?: unknown,
): Colors {
  const input: Source = size > 0 ? paletteSource(source, 'gradientSet', themeDefaultPalette) : { source };
  const discrete = raw.getDiscretePalette(input.source, size, themeDefaultPalette);

  return input.page
    ? { getColor: (index): unknown => handedOut(discrete.getColor(index), input.page) }
    : discrete;
}

export function getGradientPalette(
  source: unknown,
  themeDefaultPalette?: unknown,
): Colors {
  const { source: input, page } = paletteSource(source, 'gradientSet', themeDefaultPalette);
  const gradient = raw.getGradientPalette(input, themeDefaultPalette);

  return page
    ? { getColor: (ratio): unknown => handedOut(gradient.getColor(ratio), page) }
    : gradient;
}
