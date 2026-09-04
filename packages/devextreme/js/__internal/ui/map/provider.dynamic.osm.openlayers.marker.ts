import type { MapEngineMarkerOptions } from './provider.dynamic.osm.engine';

export const MARKER_FALLBACK_WIDTH = 25;
export const MARKER_FALLBACK_HEIGHT = 41;
export const DEFAULT_MARKER_SIZE = 44;

const MARKER_CLASS = 'dx-map-marker';
export const DEFAULT_MARKER_CLASS = `${MARKER_CLASS}-default`;
const DEFAULT_MARKER_ICON_CLASS = `${DEFAULT_MARKER_CLASS}-icon`;
const DEFAULT_MARKER_BODY_CLASS = `${DEFAULT_MARKER_CLASS}-body`;
const DEFAULT_MARKER_CENTER_CLASS = `${DEFAULT_MARKER_CLASS}-center`;
const IMAGE_MARKER_CLASS = `${MARKER_CLASS}-image`;
const DEFAULT_MARKER_WIDTH = 24.5;
const DEFAULT_MARKER_HEIGHT = 36.5;
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const DEFAULT_MARKER_VIEW_BOX = '5 2 14 20';
const DEFAULT_MARKER_BODY_PATH = [
  'M12 2c-3.85 0-7 3.176-7 7.059',
  ' 0 5.294 7 12.941 7 12.941',
  's7-7.765 7-12.941',
  'c0-3.882-3.15-7.059-7-7.059z',
].join('');
const DEFAULT_MARKER_CENTER_PATH = [
  'M12 6.706c-1.283 0-2.333 1.059-2.333 2.353',
  's1.05 2.353 2.333 2.353',
  ' 2.333-1.059 2.333-2.353',
  'c0-1.294-1.05-2.353-2.333-2.353z',
].join('');

const createDefaultMarkerElement = (
  ownerDocument: Document,
): HTMLElement => {
  const element = ownerDocument.createElement('div');
  const svg = ownerDocument.createElementNS(SVG_NAMESPACE, 'svg');
  const body = ownerDocument.createElementNS(SVG_NAMESPACE, 'path');
  const center = ownerDocument.createElementNS(SVG_NAMESPACE, 'path');

  element.className = `${MARKER_CLASS} ${DEFAULT_MARKER_CLASS}`;
  element.style.alignItems = 'flex-end';
  element.style.display = 'flex';
  element.style.height = `${DEFAULT_MARKER_SIZE}px`;
  element.style.justifyContent = 'center';
  element.style.width = `${DEFAULT_MARKER_SIZE}px`;
  svg.setAttribute('class', DEFAULT_MARKER_ICON_CLASS);
  svg.setAttribute('viewBox', DEFAULT_MARKER_VIEW_BOX);
  svg.setAttribute('width', `${DEFAULT_MARKER_WIDTH}`);
  svg.setAttribute('height', `${DEFAULT_MARKER_HEIGHT}`);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.style.display = 'block';
  svg.style.filter = [
    'drop-shadow(0 0 0.5px rgba(255, 255, 255, 0.85))',
    'drop-shadow(0 1px 1.5px rgba(0, 0, 0, 0.35))',
  ].join(' ');
  svg.style.overflow = 'visible';
  body.setAttribute('class', DEFAULT_MARKER_BODY_CLASS);
  body.setAttribute('d', DEFAULT_MARKER_BODY_PATH);
  body.setAttribute('stroke-width', '0.5');
  center.setAttribute('class', DEFAULT_MARKER_CENTER_CLASS);
  center.setAttribute('d', DEFAULT_MARKER_CENTER_PATH);
  svg.appendChild(body);
  svg.appendChild(center);
  element.appendChild(svg);

  return element;
};

export const createMarkerElement = (
  ownerDocument: Document,
  options: MapEngineMarkerOptions,
): { element: HTMLElement; offset: number[]; positioning: string } => {
  if (options.html) {
    const element = ownerDocument.createElement('div');
    element.innerHTML = options.html;

    return {
      element,
      offset: [options.htmlOffset?.left ?? 0, options.htmlOffset?.top ?? 0],
      positioning: 'top-left',
    };
  }

  if (options.iconSrc) {
    const element = ownerDocument.createElement('img');
    element.className = `${MARKER_CLASS} ${IMAGE_MARKER_CLASS}`;
    element.src = options.iconSrc;
    element.alt = '';
    element.draggable = false;

    return { element, offset: [0, 0], positioning: 'bottom-center' };
  }

  return {
    element: createDefaultMarkerElement(ownerDocument),
    offset: [0, 0],
    positioning: 'bottom-center',
  };
};
