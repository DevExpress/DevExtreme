import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { value } from '@js/core/utils/view_port';
import { getWindow, hasWindow } from '@js/core/utils/window';

const SWATCH_CONTAINER_CLASS_PREFIX = 'dx-swatch-';
const THEME_MODE_CLASS_PREFIX = 'dx-theme-mode-';
const THEME_MODE_PROPERTY = '--dx-theme-mode';

const classesByPrefix = (
  element: Element,
  prefix: string,
): string[] => [...element.classList].filter((cssClass) => cssClass.startsWith(prefix));

const closestClassesByPrefix = (
  $element: dxElementWrapper,
  prefix: string,
): string[] => {
  const $scope = $element.closest(`[class^="${prefix}"], [class*=" ${prefix}"]`);

  return $scope.length ? classesByPrefix($scope.get(0), prefix) : [];
};

/*
 * The mode an element ended up in is what the cascade decided, not what its ancestor classes
 * spell: `dx-theme-mode-inverted` asks for the opposite of its surroundings, and the container is
 * reparented to the viewport, whose surroundings are different ones. The theme names the outcome
 * in `--dx-theme-mode` (widgets/fluent-next/_design-system.scss), so ask the browser for it.
 * Themes that ship one mode per bundle declare nothing and get no class, as before.
 */
const themeModeClasses = ($element: dxElementWrapper): string[] => {
  const element = $element.get(0);
  const window = hasWindow() ? getWindow() : undefined;

  if (!element || !window?.getComputedStyle) {
    return [];
  }

  const mode = window.getComputedStyle(element).getPropertyValue(THEME_MODE_PROPERTY).trim();

  return mode ? [`${THEME_MODE_CLASS_PREFIX}${mode}`] : [];
};

const scopeClasses = ($element: dxElementWrapper): string[] => [
  ...closestClassesByPrefix($element, SWATCH_CONTAINER_CLASS_PREFIX),
  ...themeModeClasses($element),
];

const getContainerClasses = (
  $element: dxElementWrapper,
  $viewport: dxElementWrapper,
): string[] => {
  const classes = scopeClasses($element);
  // A scope the viewport already resolves to needs no container of its own: it would be a wrapper
  // that repaints nothing, and one that measures nothing - callers reading the container as a
  // geometric area (popup drag and resize) would be clamped to its zero height.
  const sorted = (cssClasses: string[]): string => [...cssClasses].sort().join(' ');

  return sorted(classes) === sorted(scopeClasses($viewport)) ? [] : classes;
};

// A container carrying a swatch or a mode class beyond the ones asked for belongs to a scope the
// element itself is not in. A class with neither prefix says nothing about the scope, so it does
// not disqualify a container - anything on the page may have tagged it.
const isExactScope = (
  node: Element,
  containerClasses: string[],
): boolean => [SWATCH_CONTAINER_CLASS_PREFIX, THEME_MODE_CLASS_PREFIX]
  .every((prefix) => classesByPrefix(node, prefix)
    .every((cssClass) => containerClasses.includes(cssClass)));

/*
 * Where an overlay belonging to `element` should be rendered: the viewport itself, or a child of it
 * repeating the swatch and the theme mode the element resolved to.
 *
 * Undefined while the viewport is unset - before documentReady - which callers read as "not ready
 * yet" (speed_dial_action defers to ready(); T713615, T1143527).
 */
const getSwatchContainer = (
  element: Element | dxElementWrapper,
): dxElementWrapper | undefined => {
  const $viewport = value() as dxElementWrapper | undefined;

  if (!$viewport?.length) {
    return $viewport;
  }

  const containerClasses = getContainerClasses($(element), $viewport);

  if (!containerClasses.length) {
    return $viewport;
  }

  const selector = containerClasses.map((cssClass) => `.${cssClass}`).join('');
  let $container = $($viewport
    .children(selector)
    .toArray()
    .filter((node) => isExactScope(node, containerClasses)));

  if (!$container.length) {
    $container = $('<div>').addClass(containerClasses.join(' ')).appendTo($viewport);
  }

  return $container;
};

export default { getSwatchContainer };
