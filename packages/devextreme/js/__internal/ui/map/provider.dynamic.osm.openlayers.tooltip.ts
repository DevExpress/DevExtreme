import { normalizeKeyName } from '@js/common/core/events/utils';
import messageLocalization from '@js/common/core/localization/message';
import domAdapter from '@js/core/dom_adapter';
import Guid from '@js/core/guid';
import $ from '@js/core/renderer';
import Button from '@js/ui/button';
import type { Properties } from '@js/ui/popover';
import type Popover from '@js/ui/popover';
import type { OverlayProperties } from '@ts/ui/overlay/overlay';
import type { PopoverProperties } from '@ts/ui/popover/popover';

import { DEFAULT_MARKER_CLASS } from './provider.dynamic.osm.openlayers.marker';
import MarkerPopover from './provider.dynamic.osm.openlayers.popover';
import type { MapLike } from './provider.dynamic.osm.openlayers.utils';

const TOOLTIP_CLASS = 'dx-map-marker-tooltip';
const TOOLTIP_CLOSE_CLASS = `${TOOLTIP_CLASS}-close`;
const POPOVER_CLASS = 'dx-map-marker-popover';
const POPOVER_CONTENT_CLASS = `${POPOVER_CLASS}-content`;
const CLOSE_BUTTON_SIZE = 28;
const TOOLTIP_MAX_WIDTH = 280;
const TOOLTIP_MAX_HEIGHT = 240;

type MarkerPopoverOptions = Properties & Pick<PopoverProperties & OverlayProperties,
  '_preventDialogContainerFocus' | '_popoverContentRole' | '_fixWrapperPosition'
  | 'enableBodyScroll'>;

export class OpenLayersMarkerTooltip {
  readonly element: HTMLElement;

  private readonly _host: HTMLElement;

  private readonly _content: HTMLElement;

  private readonly _popover: Popover;

  private readonly _closeButton: Button;

  private readonly _closeElement: HTMLElement;

  private _triggers: HTMLElement[] = [];

  private _focusTarget?: HTMLElement;

  private _focusRequested = false;

  private _restoreFocus = false;

  constructor(
    private readonly _map: MapLike,
    private readonly _container: Element,
    private readonly _marker: HTMLElement,
    text: string,
    private readonly _rtlEnabled: boolean,
  ) {
    const { ownerDocument } = _container;
    const host = ownerDocument.createElement('div');
    _map.getOverlayContainer().appendChild(host);
    this._host = host;
    const content = ownerDocument.createElement('div');
    content.className = TOOLTIP_CLASS;
    content.id = `dx-map-tooltip-${new Guid()}`;
    content.innerHTML = text;
    this._content = content;
    const layout = ownerDocument.createElement('div');
    layout.className = POPOVER_CONTENT_CLASS;
    const close = ownerDocument.createElement('div');
    close.className = TOOLTIP_CLOSE_CLASS;
    this._closeElement = close;
    this._closeButton = new Button(close, {
      icon: 'close',
      stylingMode: 'text',
      width: CLOSE_BUTTON_SIZE,
      height: CLOSE_BUTTON_SIZE,
      elementAttr: { 'aria-label': messageLocalization.format('Close') },
      onClick: (): void => this._hide(),
    });
    layout.append(content, close);
    this._popover = new MarkerPopover(host, this._getPopoverOptions(layout));
    this.element = $(this._popover.content()).parent().get(0) as HTMLElement;
    this.element.id = `${content.id}-dialog`;
    this._setAccessibleName();
    this.element.addEventListener('click', this._stopPropagation);
    this.element.addEventListener('dblclick', this._stopPropagation);
    this.element.addEventListener('pointerdown', this._stopPropagation);
    this.element.addEventListener('keydown', this._escapeKeyHandler);
    this.element.addEventListener('keydown', this._stopPropagation);
    _marker.addEventListener('keydown', this._escapeKeyHandler);
    _map.on('postrender', this.syncPosition);
  }

  private _getPopoverOptions(layout: HTMLElement): MarkerPopoverOptions {
    const target = this._marker.classList.contains(DEFAULT_MARKER_CLASS)
      ? this._marker.firstElementChild ?? this._marker
      : this._marker;

    return {
      container: this._map.getOverlayContainer(),
      target,
      position: {
        my: { x: 'center', y: 'bottom' },
        at: { x: 'center', y: 'top' },
        collision: 'flip',
        boundary: this._container,
      },
      animation: undefined,
      deferRendering: false,
      contentTemplate: (): HTMLElement => layout,
      maxWidth: TOOLTIP_MAX_WIDTH,
      maxHeight: TOOLTIP_MAX_HEIGHT,
      showTitle: false,
      showCloseButton: false,
      hideOnOutsideClick: false,
      hideOnParentScroll: false,
      focusStateEnabled: false,
      tabFocusLoopEnabled: false,
      _preventDialogContainerFocus: true,
      _popoverContentRole: 'dialog',
      _fixWrapperPosition: false,
      enableBodyScroll: true,
      rtlEnabled: this._rtlEnabled,
      wrapperAttr: { class: POPOVER_CLASS },
      onShown: this._onShown,
      onHiding: this._onHiding,
      onHidden: this._onHidden,
    };
  }

  private readonly _onShown = (): void => {
    this._setExpanded(true);
    this._setAccessibleName();
    if (this._focusRequested) {
      this._closeElement.focus({ preventScroll: true });
    }
    this._focusRequested = false;
  };

  private readonly _onHiding = (): void => {
    this._restoreFocus = this.element.contains(domAdapter.getActiveElement(this.element));
  };

  private readonly _onHidden = (): void => {
    this._setExpanded(false);
    if (!this._restoreFocus) {
      return;
    }

    if (this._focusTarget?.getAttribute('tabindex') === '-1') {
      (this._container as HTMLElement).focus({ preventScroll: true });
    } else {
      this._focusTarget?.focus({ preventScroll: true });
    }
  };

  private _setAccessibleName(): void {
    if (this._content.textContent?.trim()) {
      this.element.setAttribute('aria-labelledby', this._content.id);
    } else {
      this.element.setAttribute('aria-label', messageLocalization.format('dxMap-markerAriaLabel'));
    }
  }

  setTriggers(triggers: HTMLElement[]): void {
    this._triggers = triggers;
    triggers.forEach((element) => {
      element.setAttribute('aria-controls', this.element.id);
      element.setAttribute('aria-haspopup', 'dialog');
      element.setAttribute('aria-expanded', 'false');
    });
  }

  private _setExpanded(expanded: boolean): void {
    this._triggers.forEach((element) => element.setAttribute('aria-expanded', String(expanded)));
  }

  show(focus = false): void {
    const activeElement = domAdapter.getActiveElement(this._marker);
    this._focusTarget = this._triggers.find((element) => element === activeElement)
      ?? this._triggers[0];
    this._focusRequested = focus;
    const wasVisible = this._popover.option('visible');
    this._popover.option('visible', true);
    if (wasVisible) {
      this.syncPosition();
      if (focus) {
        this._closeElement.focus({ preventScroll: true });
        this._focusRequested = false;
      }
    }
  }

  private _hide(): void {
    this._focusRequested = false;
    this._popover.option('visible', false);
  }

  readonly syncPosition = (): void => {
    if (this._popover.option('visible')) {
      this._popover.repaint();
    }
  };

  private readonly _stopPropagation = (event: Event): void => event.stopPropagation();

  private readonly _escapeKeyHandler = (event: KeyboardEvent): void => {
    if (!event.defaultPrevented
      && normalizeKeyName(event) === 'escape'
      && this._popover.option('visible')) {
      event.preventDefault();
      event.stopPropagation();
      this._hide();
    }
  };

  dispose(): void {
    this._map.un('postrender', this.syncPosition);
    this.element.removeEventListener('click', this._stopPropagation);
    this.element.removeEventListener('dblclick', this._stopPropagation);
    this.element.removeEventListener('pointerdown', this._stopPropagation);
    this.element.removeEventListener('keydown', this._escapeKeyHandler);
    this.element.removeEventListener('keydown', this._stopPropagation);
    this._marker.removeEventListener('keydown', this._escapeKeyHandler);
    this._triggers.forEach((element) => {
      element.removeAttribute('aria-controls');
      element.removeAttribute('aria-haspopup');
      element.removeAttribute('aria-expanded');
    });
    this._closeButton.dispose();
    this._popover.dispose();
    this._host.remove();
  }
}
