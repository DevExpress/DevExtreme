const $ = require('../../core/renderer');
const domAdapter = require('../../core/dom_adapter');
const windowUtils = require('../../core/utils/window');
const window = windowUtils.getWindow();
const eventsEngine = require('../../events/core/events_engine');
const extend = require('../../core/utils/extend').extend;
const resizeCallbacks = require('../../core/utils/resize_callbacks');
const support = require('../../core/utils/support');
const styleUtils = require('../../core/utils/style');
const devices = require('../../core/devices');

const initMobileViewport = function(options) {
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
        $('.dx-viewport').css(styleUtils.styleProp('userSelect'), 'none');
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

exports.initMobileViewport = initMobileViewport;
