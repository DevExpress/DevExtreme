import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { value } from '@js/core/utils/view_port';

const SWATCH_CONTAINER_CLASS_PREFIX = 'dx-swatch-';
const THEME_MODE_CLASS_PREFIX = 'dx-theme-mode-';

const LIGHT_THEME_MODE_CLASS = `${THEME_MODE_CLASS_PREFIX}light`;
const DARK_THEME_MODE_CLASS = `${THEME_MODE_CLASS_PREFIX}dark`;
const INVERTED_THEME_MODE_CLASS = `${THEME_MODE_CLASS_PREFIX}inverted`;

const closestByClassPrefix = (
  $element: dxElementWrapper,
  prefix: string,
): dxElementWrapper => $element.closest(`[class^="${prefix}"], [class*=" ${prefix}"]`);

const classesByPrefix = (
  element: Element,
  prefix: string,
): string[] => [...element.classList].filter((cssClass) => cssClass.startsWith(prefix));

const getThemeModeClasses = ($element: dxElementWrapper): string[] => {
  const $scope = closestByClassPrefix($element, THEME_MODE_CLASS_PREFIX);

  if (!$scope.length) {
    return [];
  }

  const classes = classesByPrefix($scope[0], THEME_MODE_CLASS_PREFIX);

  if (!classes.includes(INVERTED_THEME_MODE_CLASS)) {
    return classes;
  }

  // The container hangs off the viewport, so "the opposite of my surroundings" would be read
  // against the viewport rather than against the element the overlay belongs to. Name the mode the
  // element resolves to instead. Without a named mode above it that is the mode the stylesheet
  // falls back to, which the container inherits too, so the relative class carries over as is.
  const $named = $scope.parent().closest(`.${LIGHT_THEME_MODE_CLASS}, .${DARK_THEME_MODE_CLASS}`);

  if (!$named.length) {
    return classes;
  }

  return [
    $named[0].classList.contains(DARK_THEME_MODE_CLASS)
      ? LIGHT_THEME_MODE_CLASS
      : DARK_THEME_MODE_CLASS,
  ];
};

const getContainerClasses = ($element: dxElementWrapper): string[] => {
  const $swatch = closestByClassPrefix($element, SWATCH_CONTAINER_CLASS_PREFIX);
  const swatchClasses = $swatch.length
    ? classesByPrefix($swatch[0], SWATCH_CONTAINER_CLASS_PREFIX)
    : [];

  return [...swatchClasses, ...getThemeModeClasses($element)];
};

const getSwatchContainer = (
  element: Element | dxElementWrapper,
): dxElementWrapper => {
  const containerClasses = getContainerClasses($(element));
  const viewport: dxElementWrapper = value();

  if (!containerClasses.length) {
    return viewport;
  }

  const selector = containerClasses.map((cssClass) => `.${cssClass}`).join('');
  // A container carrying more classes than asked for would hand the overlay a swatch or a mode the
  // element itself is not in.
  let viewportContainer = $(viewport
    .children(selector)
    .toArray()
    .filter((node) => node.classList.length === containerClasses.length));

  if (!viewportContainer.length) {
    viewportContainer = $('<div>').addClass(containerClasses.join(' ')).appendTo(viewport);
  }

  return viewportContainer;
};

export default { getSwatchContainer };
