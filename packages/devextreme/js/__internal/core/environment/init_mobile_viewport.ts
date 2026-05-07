import $ from '@js/core/renderer';
import devices from '@ts/core/m_devices';
import domAdapter from '@ts/core/m_dom_adapter';
import { extend } from '@ts/core/utils/m_extend';
import resizeCallbacks from '@ts/core/utils/m_resize_callbacks';
import { getWidth, setWidth } from '@ts/core/utils/m_size';
import { styleProp } from '@ts/core/utils/m_style';
import supportUtils from '@ts/core/utils/m_support';
import { getWindow } from '@ts/core/utils/m_window';
import eventsEngine from '@ts/events/core/m_events_engine';

const window = getWindow();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const initMobileViewport = function (
  options: { allowZoom?: boolean; allowPan?: boolean; allowSelection?: boolean },
): void {
  // eslint-disable-next-line no-param-reassign
  options = extend({}, options);
  let realDevice = devices.real();
  const { allowZoom } = options;
  const { allowPan } = options;
  const allowSelection = 'allowSelection' in options ? options.allowSelection : realDevice.platform === 'generic';

  const metaSelector = 'meta[name=viewport]';
  if (!$(metaSelector).length) {
    // @ts-expect-error
    $('<meta>').attr('name', 'viewport').appendTo('head');
  }

  const metaVerbs = ['width=device-width'];
  const msTouchVerbs = [];

  if (allowZoom) {
    // @ts-expect-error
    msTouchVerbs.push('pinch-zoom');
  } else {
    metaVerbs.push('initial-scale=1.0', 'maximum-scale=1.0, user-scalable=no');
  }

  if (allowPan) {
    // @ts-expect-error
    msTouchVerbs.push('pan-x', 'pan-y');
  }

  if (!allowPan && !allowZoom) {
    $('html, body').css({
      msContentZooming: 'none',
      msUserSelect: 'none',
      overflow: 'hidden',
    });
  } else {
    $('html').css('msOverflowStyle', '-ms-autohiding-scrollbar');
  }

  if (!allowSelection && supportUtils.supportProp('userSelect')) {
    $('.dx-viewport').css(styleProp('userSelect'), 'none');
  }

  $(metaSelector).attr('content', metaVerbs.join());
  $('html').css('msTouchAction', msTouchVerbs.join(' ') || 'none');

  realDevice = devices.real();

  if (supportUtils.touch) {
    eventsEngine.off(domAdapter.getDocument(), '.dxInitMobileViewport');
    eventsEngine.on(domAdapter.getDocument(), 'dxpointermove.dxInitMobileViewport', (e) => {
      const count = e.pointers.length;
      const isTouchEvent = e.pointerType === 'touch';
      const zoomDisabled = !allowZoom && count > 1;
      const panDisabled = !allowPan && count === 1 && !e.isScrollingEvent;

      if (isTouchEvent && (zoomDisabled || panDisabled)) {
        e.preventDefault();
      }
    });
  }

  if (realDevice.ios) {
    // @ts-expect-error
    const isPhoneGap = domAdapter.getLocation().protocol === 'file:';

    if (!isPhoneGap) {
      // NOTE: fix app size after device rotation in Safari when keyboard was shown
      resizeCallbacks.add(() => {
        const windowWidth = getWidth(window);
        setWidth($('body'), windowWidth);
      });
    }
  }

  if (realDevice.android) {
    resizeCallbacks.add(() => {
      // eslint-disable-next-line no-restricted-globals
      setTimeout(() => {
        const activeElement = domAdapter.getActiveElement();

        // @ts-expect-error
        if (activeElement.scrollIntoViewIfNeeded) {
          // @ts-expect-error
          activeElement.scrollIntoViewIfNeeded();
        } else {
          activeElement.scrollIntoView(false);
        }
      });
    });
  }
};
