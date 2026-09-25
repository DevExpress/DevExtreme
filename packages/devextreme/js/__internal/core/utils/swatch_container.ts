import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { value } from '@js/core/utils/view_port';
import { getWindow, hasWindow } from '@js/core/utils/window';
import { resolvedThemeMode } from '@ts/core/utils/theme_mode';

const SWATCH_CONTAINER_CLASS_PREFIX = 'dx-swatch-';
const THEME_MODE_CLASS_PREFIX = 'dx-theme-mode-';

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

const themeModeClasses = ($element: dxElementWrapper): string[] => {
  const mode = resolvedThemeMode($element);

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
  // that repaints nothing.
  const sorted = (cssClasses: string[]): string => [...cssClasses].sort().join(' ');

  return sorted(classes) === sorted(scopeClasses($viewport)) ? [] : classes;
};

const isExactScope = (
  node: Element,
  containerClasses: string[],
): boolean => [SWATCH_CONTAINER_CLASS_PREFIX, THEME_MODE_CLASS_PREFIX]
  .every((prefix) => classesByPrefix(node, prefix)
    .every((cssClass) => containerClasses.includes(cssClass)));

const showsOverflow = (node: Element): boolean => {
  const style = hasWindow() ? getWindow().getComputedStyle(node) : undefined;

  return ['overflow', 'overflow-x', 'overflow-y']
    .every((property) => ['', 'visible'].includes(style?.getPropertyValue(property) ?? ''));
};

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
    .filter((node) => isExactScope(node, containerClasses) && showsOverflow(node)));

  if (!$container.length) {
    $container = $('<div>').addClass(containerClasses.join(' ')).appendTo($viewport);
  }

  return $container;
};

export default { getSwatchContainer };
