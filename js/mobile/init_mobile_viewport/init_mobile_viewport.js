var $ = require('../../core/renderer'),
    domAdapter = require('../../core/dom_adapter'),
    windowUtils = require('../../core/utils/window'),
    window = windowUtils.getWindow(),
    eventsEngine = require('../../events/core/events_engine'),
    extend = require('../../core/utils/extend').extend,
    resizeCallbacks = require('../../core/utils/resize_callbacks'),
    support = require('../../core/utils/support'),
    styleUtils = require('../../core/utils/style'),
    devices = require('../../core/devices');

var initMobileViewport = function(options) {
    options = extend({}, options);
    var realDevice = devices.real();
    var allowZoom = options.allowZoom;
    var allowPan = options.allowPan;
    var allowSelection = ('allowSelection' in options) ? options.allowSelection : realDevice.platform === 'generic';

    var metaSelector = 'meta[name=viewport]';
    if(!$(metaSelector).length) {
        $('<meta>').attr('name', 'viewport').appendTo('head');
    }

    var metaVerbs = ['width=device-width'],
        msTouchVerbs = [];

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

    if(support.touch && !(realDevice.platform === 'win' && realDevice.version[0] === 10)) {
        eventsEngine.off(domAdapter.getDocument(), '.dxInitMobileViewport');
        eventsEngine.on(domAdapter.getDocument(), 'dxpointermove.dxInitMobileViewport', function(e) {
            var count = e.pointers.length,
                isTouchEvent = e.pointerType === 'touch',
                zoomDisabled = !allowZoom && count > 1,
                panDisabled = !allowPan && count === 1 && !e.isScrollingEvent;

            if(isTouchEvent && (zoomDisabled || panDisabled)) {
                e.preventDefault();
            }
        });
    }

    if(realDevice.ios) {
        var isPhoneGap = (domAdapter.getLocation().protocol === 'file:');

        if(!isPhoneGap) {
            // NOTE: fix app size after device rotation in Safari when keyboard was shown
            resizeCallbacks.add(function() {
                var windowWidth = $(window).width();
                $('body').width(windowWidth);
            });
        }
    }

    if(realDevice.android) {
        resizeCallbacks.add(function() {
            setTimeout(function() {
                var activeElement = domAdapter.getActiveElement();

                activeElement.scrollIntoViewIfNeeded ?
                    activeElement.scrollIntoViewIfNeeded() :
                    activeElement.scrollIntoView(false);
            });
        });
    }
};

exports.initMobileViewport = initMobileViewport;
