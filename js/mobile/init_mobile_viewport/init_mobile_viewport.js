import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import { getWindow } from '../../core/utils/window';
const window = getWindow();
import eventsEngine from '../../events/core/events_engine';
import { extend } from '../../core/utils/extend';
import resizeCallbacks from '../../core/utils/resize_callbacks';
import support from '../../core/utils/support';
import { styleProp } from '../../core/utils/style';
import devices from '../../core/devices';

export const initMobileViewport = function(options) {
    options = extend({}, options);
    let realDevice = devices.real();
    const allowZoom = options.allowZoom;
    const allowPan = options.allowPan;
    const allowSelection = ('allowSelection' in options) ? options.allowSelection : realDevice.platform === 'generic';

    const metaSelector = 'meta[name=viewport]';
    if(!$(metaSelector).length) {
        $('<meta>').attr('name', 'viewport').appendTo('head');
    }

    const metaVerbs = ['width=device-width'];
    const msTouchVerbs = [];

    if(allowZoom) {
        msTouchVerbs.push('pinch-zoom');
    } else {
        metaVerbs.push('initial-scale=1.0', 'maximum-scale=1.0, user-scalable=no');
    }

    if(allowPan) {
        msTouchVerbs.push('pan-x', 'pan-y');
    }

    if(!allowPan && !allowZoom) {
        $('html, body').css({
            'msContentZooming': 'none',
            'msUserSelect': 'none',
            'overflow': 'hidden'
        });
    } else {
        $('html').css('msOverflowStyle', '-ms-autohiding-scrollbar');
    }

    if(!allowSelection && support.supportProp('userSelect')) {
        $('.dx-viewport').css(styleProp('userSelect'), 'none');
    }

    $(metaSelector).attr('content', metaVerbs.join());
    $('html').css('msTouchAction', msTouchVerbs.join(' ') || 'none');

    realDevice = devices.real();

    if(support.touch) {
        eventsEngine.off(domAdapter.getDocument(), '.dxInitMobileViewport');
        eventsEngine.on(domAdapter.getDocument(), 'dxpointermove.dxInitMobileViewport', function(e) {
            const count = e.pointers.length;
            const isTouchEvent = e.pointerType === 'touch';
            const zoomDisabled = !allowZoom && count > 1;
            const panDisabled = !allowPan && count === 1 && !e.isScrollingEvent;

            if(isTouchEvent && (zoomDisabled || panDisabled)) {
                e.preventDefault();
            }
        });
    }

    if(realDevice.ios) {
        const isPhoneGap = (domAdapter.getLocation().protocol === 'file:');

        if(!isPhoneGap) {
            // NOTE: fix app size after device rotation in Safari when keyboard was shown
            resizeCallbacks.add(function() {
                const windowWidth = $(window).width();
                $('body').width(windowWidth);
            });
        }
    }

    if(realDevice.android) {
        resizeCallbacks.add(function() {
            setTimeout(function() {
                const activeElement = domAdapter.getActiveElement();

                activeElement.scrollIntoViewIfNeeded ?
                    activeElement.scrollIntoViewIfNeeded() :
                    activeElement.scrollIntoView(false);
            });
        });
    }
};
