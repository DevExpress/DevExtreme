import { normalizeKeyName } from '@js/common/core/events/utils';
import domAdapter from '@js/core/dom_adapter';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/popover';
import Popover from '@js/ui/popover';
import { ALL_FOCUSABLE_ELEMENTS_SELECTOR } from '@ts/core/utils/m_selectors';
import type InternalPopover from '@ts/ui/popover/popover';

import { DEFAULT_MARKER_CLASS } from './provider.dynamic.osm.openlayers.marker';
import type { MapLike } from './provider.dynamic.osm.openlayers.utils';

const POPOVER_CLASS = 'dx-map-marker-popover';
const TOOLTIP_MAX_WIDTH = 280;

type MarkerPopover = Popover & Pick<InternalPopover,
  '_getEffectiveAriaRole' | '_renderDimensions' | '_setContentHeight' | '_renderPosition'>;

export class OpenLayersMarkerTooltip {
  readonly element: HTMLElement;

  private readonly _host: HTMLElement;

  private readonly _popover: MarkerPopover;

  private readonly _inertElements = new Set<HTMLElement>();

  private readonly _tabIndexes = new Map<HTMLElement, string | null>();

  private _focusEnabled = true;

  private _positioning = false;

  private _positionUpdatePending = false;

  private _disposed = false;

  constructor(
    private readonly _map: MapLike,
    private readonly _container: Element,
    private readonly _marker: HTMLElement,
    text: string,
    rtlEnabled: boolean,
  ) {
    const { ownerDocument } = _container;
    const host = ownerDocument.createElement('div');
    Object.assign(host.style, { position: 'absolute', inset: '0', contain: 'layout paint' });
    _map.getOverlayContainer().appendChild(host);
    this._host = host;
    const element = ownerDocument.createElement('div');
    host.appendChild(element);
    const content = ownerDocument.createElement('div');
    content.innerHTML = text;
    const target = _marker.classList.contains(DEFAULT_MARKER_CLASS)
      ? _marker.firstElementChild ?? _marker
      : _marker;
    const focusTargets = _marker.querySelectorAll<HTMLElement>(ALL_FOCUSABLE_ELEMENTS_SELECTOR);

    this._popover = new Popover<Properties>(element, {
      container: host,
      // @ts-expect-error Popover also supports renderer collections as targets.
      target: focusTargets.length ? $(Array.from(focusTargets)) : _marker,
      position: {
        of: target,
        my: { x: 'center', y: 'bottom' },
        at: { x: 'center', y: 'top' },
        collision: 'flip',
        boundary: _container,
      },
      animation: undefined,
      deferRendering: false,
      contentTemplate: (): HTMLElement => content,
      maxWidth: TOOLTIP_MAX_WIDTH,
      showTitle: false,
      showCloseButton: false,
      hideOnOutsideClick: false,
      hideOnParentScroll: false,
      rtlEnabled,
      elementAttr: { class: POPOVER_CLASS },
      wrapperAttr: { class: POPOVER_CLASS },
    }) as MarkerPopover;
    this.element = $(this._popover.content()).parent().get(0) as HTMLElement;
    this._popover.on('showing', this._syncFocusState);
    this._popover.on('positioned', this._restoreContentSize);
    this._popover.on('positioned', this._syncFocusState);
    this._popover.on('shown', this._syncFocusState);
    this._popover.on('hidden', this._syncFocusState);
    this.element.addEventListener('click', this._stopPropagation);
    this.element.addEventListener('dblclick', this._stopPropagation);
    this.element.addEventListener('pointerdown', this._stopPropagation);
    this.element.addEventListener('keydown', this._stopMapKeyPropagation);
    _map.on('postrender', this.syncPosition);
  }

  get popover(): Popover {
    return this._popover;
  }

  show(): void {
    if (!this._disposed) {
      this._popover.option('visible', true);
    }
  }

  setFocusEnabled(enabled: boolean): void {
    if (enabled !== this._focusEnabled) {
      this._focusEnabled = enabled;
      this._popover.option('_preventDialogContainerFocus', !enabled);
      const focusEnabled = enabled && this._popover._getEffectiveAriaRole() === 'dialog';
      this._popover.option({
        focusStateEnabled: focusEnabled,
        tabFocusLoopEnabled: focusEnabled,
      });
    }
    this._syncFocusState();
  }

  private readonly _restoreContentSize = (): Promise<void> | undefined => {
    if (this._positioning || this._positionUpdatePending) {
      return undefined;
    }

    this._positionUpdatePending = true;
    return Promise.resolve().then(() => {
      this._positionUpdatePending = false;
      if (this._disposed) {
        return;
      }

      this._popover._renderDimensions();
      this._popover._setContentHeight(true);
      this.syncPosition();
    });
  };

  readonly syncPosition = (): void => {
    if (!this._popover.option('visible')) {
      return;
    }

    this._positioning = true;
    try {
      this._popover._renderPosition(false);
    } finally {
      this._positioning = false;
    }
    this._syncFocusState();
  };

  private readonly _stopPropagation = (event: Event): void => event.stopPropagation();

  private readonly _stopMapKeyPropagation = (event: KeyboardEvent): void => {
    const key = normalizeKeyName(event);
    if (event.defaultPrevented || (key !== 'escape' && key !== 'tab')) {
      event.stopPropagation();
    }
  };

  private readonly _syncFocusState = (): void => {
    this._inertElements.forEach((element) => { element.inert = false; });
    this._inertElements.clear();
    if (this._focusEnabled) {
      this._tabIndexes.forEach((tabIndex, element) => {
        if (tabIndex === null) {
          element.removeAttribute('tabindex');
        } else {
          element.setAttribute('tabindex', tabIndex);
        }
      });
      this._tabIndexes.clear();
    }
    const focusTargets = this.element
      .querySelectorAll<HTMLElement>(ALL_FOCUSABLE_ELEMENTS_SELECTOR);
    if (!this._focusEnabled) {
      focusTargets.forEach((element) => {
        if (!this._tabIndexes.has(element)) {
          this._tabIndexes.set(element, element.getAttribute('tabindex'));
        }
        element.setAttribute('tabindex', '-1');
      });
    }
    const boundary = this._container.getBoundingClientRect();
    const activeElement = domAdapter.getActiveElement(this.element);
    const elements = this._popover.option('visible') && this.element.getClientRects().length
      ? [this._marker, this.element, ...focusTargets]
      : [this._marker];

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const outside = element === this.element
        ? rect.bottom <= boundary.top || rect.top >= boundary.bottom
          || rect.right <= boundary.left || rect.left >= boundary.right
        : rect.top < boundary.top || rect.bottom > boundary.bottom
          || rect.left < boundary.left || rect.right > boundary.right;

      if (outside) {
        if (element.contains(activeElement)) {
          (this._container as HTMLElement).focus({ preventScroll: true });
        }
        if (!element.inert) {
          element.inert = true;
          this._inertElements.add(element);
        }
      }
    });
  };

  dispose(): void {
    this._disposed = true;
    this._map.un('postrender', this.syncPosition);
    this.element.removeEventListener('click', this._stopPropagation);
    this.element.removeEventListener('dblclick', this._stopPropagation);
    this.element.removeEventListener('pointerdown', this._stopPropagation);
    this.element.removeEventListener('keydown', this._stopMapKeyPropagation);
    this._popover.dispose();
    this._host.remove();
    this._inertElements.forEach((element) => { element.inert = false; });
    this._inertElements.clear();
    this._tabIndexes.clear();
  }
}
