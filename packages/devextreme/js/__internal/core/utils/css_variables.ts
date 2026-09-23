import domAdapter from '@js/core/dom_adapter';
import { getWindow } from '@js/core/utils/window';

const REFERENCE = /var\(\s*--/;
const LEFT_TO_THE_BROWSER = /var\(|color-mix\(|\(from /;
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const REFERENCED_NAME = /var\(\s*(--[a-z0-9-]+)/i;
const REFERENCE_FALLBACK = /var\(\s*--[a-z0-9-]+\s*,\s*([^)]*)\)/i;

export function isCssVariableReference(value: unknown): value is string {
  return typeof value === 'string' && REFERENCE.test(value);
}

export function fallbackOf(value: string): string {
  const [, fallback] = REFERENCE_FALLBACK.exec(value) ?? [];

  return fallback?.trim() ?? value;
}

export function resolvedInScope(value: string, element: Element | null | undefined): string {
  if (!isCssVariableReference(value)) {
    return value;
  }

  const [, name] = REFERENCED_NAME.exec(value) ?? [];
  const carried = element
    ? getWindow().getComputedStyle(element).getPropertyValue(name).trim()
    : '';

  return carried || fallbackOf(value);
}

function asColorString(painted: string): string | undefined {
  const numbers = (painted.match(/-?[\d.]+/g) ?? []).map(Number);

  if (numbers.length < 3) {
    return undefined;
  }

  const scale = painted.startsWith('color(') ? 255 : 1;
  const [red, green, blue] = numbers
    .slice(0, 3)
    .map((value) => Math.round(Math.min(255, Math.max(0, value * scale))));
  const alpha = numbers.length > 3 ? numbers[3] : 1;

  return alpha < 1
    ? `rgba(${red}, ${green}, ${blue}, ${alpha})`
    : `#${[red, green, blue].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

/*
 * What an element is actually painted with, for a value the browser has to work out: a published
 * name, a mix of two of them, a channel shift. A widget hands this outward - point.getColor() and
 * the like - because an application draws with the answer on its own canvas, where a var() means
 * nothing.
 */
export function paintedColor(value: string, element: Element | null | undefined): string {
  if (typeof value !== 'string' || !LEFT_TO_THE_BROWSER.test(value)) {
    return value;
  }

  if (!element) {
    return fallbackOf(value);
  }

  // @ts-expect-error createElementNS is on the strategy, not on the exported adapter type
  const probe = domAdapter.createElementNS(SVG_NAMESPACE, 'rect') as SVGElement;

  probe.style.setProperty('fill', value);
  element.appendChild(probe);

  const painted = getWindow().getComputedStyle(probe).fill;

  probe.remove();

  return asColorString(painted) ?? fallbackOf(value);
}

function inlineStyleOf(element: Element): CSSStyleDeclaration | undefined {
  const { style } = element as Partial<ElementCSSInlineStyle>;

  return typeof style?.item === 'function' ? style : undefined;
}

function referencedProperties(style: CSSStyleDeclaration): string[] {
  const properties: string[] = [];

  for (let index = 0; index < style.length; index += 1) {
    const property = style.item(index);

    if (isCssVariableReference(style.getPropertyValue(property))) {
      properties.push(property);
    }
  }

  return properties;
}

function referencedAttributes(element: Element): string[] {
  return Array.from(element.attributes)
    .filter(({ value }) => isCssVariableReference(value))
    .map(({ name }) => name);
}

export function copyResolvedStyles(source: Element, copy: Element): void {
  const sources = [source, ...source.querySelectorAll('*')];
  const window = getWindow();

  [copy, ...copy.querySelectorAll('*')].forEach((node, index) => {
    const style = inlineStyleOf(node);
    const properties = style ? referencedProperties(style) : [];
    const attributes = referencedAttributes(node);

    if (!properties.length && !attributes.length) {
      return;
    }

    const computed = window.getComputedStyle(sources[index]);

    properties.forEach((property) => {
      const carried = computed.getPropertyValue(property);

      if (carried) {
        style?.setProperty(property, carried);
      }
    });

    attributes.forEach((attribute) => {
      const carried = computed.getPropertyValue(attribute);

      if (carried) {
        node.setAttribute(attribute, carried);
      }
    });
  });
}
