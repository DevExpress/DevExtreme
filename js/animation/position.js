/**
* @name positionConfig
* @namespace DevExpress
* @type object
*/

/**
* @name positionConfig.my
* @type Enums.PositionAlignment|object
*/
/**
* @name positionConfig.my.x
* @type Enums.HorizontalAlignment
*/
/**
* @name positionConfig.my.y
* @type Enums.VerticalAlignment
*/

/**
* @name positionConfig.at
* @type Enums.PositionAlignment|object
*/
/**
* @name positionConfig.at.x
* @type Enums.HorizontalAlignment
*/
/**
* @name positionConfig.at.y
* @type Enums.VerticalAlignment
*/

/**
* @name positionConfig.of
* @type string|Node|jQuery|window
*/

/**
* @name positionConfig.offset
* @type string|object
*/
/**
* @name positionConfig.offset.x
* @type number
* @default 0
*/
/**
* @name positionConfig.offset.y
* @type number
* @default 0
*/

/**
* @name positionConfig.collision
* @type Enums.PositionResolveCollisionXY|object
*/
/**
* @name positionConfig.collision.x
* @type Enums.PositionResolveCollision
* @default 'none'
*/
/**
* @name positionConfig.collision.y
* @type Enums.PositionResolveCollision
* @default 'none'
*/

/**
* @name positionConfig.boundary
* @type string|Node|jQuery|window
*/

/**
* @name positionConfig.boundaryOffset
* @type string|object
*/
/**
* @name positionConfig.boundaryOffset.x
* @type number
* @default 0
*/
/**
* @name positionConfig.boundaryOffset.y
* @default 0
* @type number
*/


const $ = require('../core/renderer');
const commonUtils = require('../core/utils/common');
const each = require('../core/utils/iterator').each;
const windowUtils = require('../core/utils/window');
const window = windowUtils.getWindow();
const domAdapter = require('../core/dom_adapter');
const isWindow = require('../core/utils/type').isWindow;
const extend = require('../core/utils/extend').extend;
const browser = require('../core/utils/browser');

const translator = require('./translator');
const support = require('../core/utils/support');

const horzRe = /left|right/;
const vertRe = /top|bottom/;
const collisionRe = /fit|flip|none/;
const IS_SAFARI = browser.safari;

const normalizeAlign = function(raw) {
    const result = {
        h: 'center',
        v: 'center'
    };

    const pair = commonUtils.splitPair(raw);

    if(pair) {
        each(pair, function() {
            const w = String(this).toLowerCase();
            if(horzRe.test(w)) {
                result.h = w;
            } else if(vertRe.test(w)) {
                result.v = w;
            }
        });
    }

    return result;
};

const normalizeOffset = function(raw) {
    return commonUtils.pairToObject(raw);
};

const normalizeCollision = function(raw) {
    const pair = commonUtils.splitPair(raw);
    let h = String(pair && pair[0]).toLowerCase();
    let v = String(pair && pair[1]).toLowerCase();

    if(!collisionRe.test(h)) {
        h = 'none';
    }
    if(!collisionRe.test(v)) {
        v = h;
    }

    return { h: h, v: v };
};

const getAlignFactor = function(align) {
    switch(align) {
        case 'center':
            return 0.5;
        case 'right':
        case 'bottom':
            return 1;
        default:
            return 0;
    }
};

const inverseAlign = function(align) {
    switch(align) {
        case 'left':
            return 'right';
        case 'right':
            return 'left';
        case 'top':
            return 'bottom';
        case 'bottom':
            return 'top';
        default:
            return align;
    }
};

const calculateOversize = function(data, bounds) {
    let oversize = 0;

    if(data.myLocation < bounds.min) {
        oversize += bounds.min - data.myLocation;
    }

    if(data.myLocation > bounds.max) {
        oversize += data.myLocation - bounds.max;
    }

    return oversize;
};

const collisionSide = function(direction, data, bounds) {
    if(data.myLocation < bounds.min) {
        return direction === 'h' ? 'left' : 'top';
    }
    if(data.myLocation > bounds.max) {
        return direction === 'h' ? 'right' : 'bottom';
    }
    return 'none';
};

// TODO: rename?
const initMyLocation = function(data) {
    data.myLocation = data.atLocation
        + getAlignFactor(data.atAlign) * data.atSize
        - getAlignFactor(data.myAlign) * data.mySize
        + data.offset;
};

const collisionResolvers = {

    'fit': function(data, bounds) {
        let result = false;
        if(data.myLocation > bounds.max) {
            data.myLocation = bounds.max;
            result = true;
        }
        if(data.myLocation < bounds.min) {
            data.myLocation = bounds.min;
            result = true;
        }

        data.fit = result;
    },

    'flip': function(data, bounds) {
        data.flip = false;

        if(data.myAlign === 'center' && data.atAlign === 'center') {
            return;
        }

        if(data.myLocation < bounds.min || data.myLocation > bounds.max) {
            const inverseData = extend({}, data, {
                myAlign: inverseAlign(data.myAlign),
                atAlign: inverseAlign(data.atAlign),
                offset: -data.offset
            });

            initMyLocation(inverseData);
            inverseData.oversize = calculateOversize(inverseData, bounds);

            if((inverseData.myLocation >= bounds.min && inverseData.myLocation <= bounds.max) || data.oversize > inverseData.oversize) {
                data.myLocation = inverseData.myLocation;
                data.oversize = inverseData.oversize;
                data.flip = true;
            }
        }
    },

    'flipfit': function(data, bounds) {
        this.flip(data, bounds);
        this.fit(data, bounds);
    },

    'none': function(data) {
        data.oversize = 0;
    }
};

let scrollbarWidth;

const calculateScrollbarWidth = function() {
    const $scrollDiv = $('<div>').css({
        width: 100,
        height: 100,
        overflow: 'scroll',
        position: 'absolute',
        top: -9999
    }).appendTo($('body'));
    const result = $scrollDiv.get(0).offsetWidth - $scrollDiv.get(0).clientWidth;

    $scrollDiv.remove();

    scrollbarWidth = result;
};

const defaultPositionResult = {
    h: {
        location: 0,
        flip: false,
        fit: false,
        oversize: 0
    },
    v: {
        location: 0,
        flip: false,
        fit: false,
        oversize: 0
    }
};

const calculatePosition = function(what, options) {
    const $what = $(what);
    const currentOffset = $what.offset();
    const result = extend(true, {}, defaultPositionResult, {
        h: { location: currentOffset.left },
        v: { location: currentOffset.top }
    });

    if(!options) {
        return result;
    }

    const my = normalizeAlign(options.my);
    const at = normalizeAlign(options.at);
    let of = ($(options.of).length && options.of) || window;
    const offset = normalizeOffset(options.offset);
    const collision = normalizeCollision(options.collision);
    const boundary = options.boundary;
    const boundaryOffset = normalizeOffset(options.boundaryOffset);

    const h = {
        mySize: $what.outerWidth(),
        myAlign: my.h,
        atAlign: at.h,
        offset: offset.h,
        collision: collision.h,
        boundaryOffset: boundaryOffset.h
    };

    const v = {
        mySize: $what.outerHeight(),
        myAlign: my.v,
        atAlign: at.v,
        offset: offset.v,
        collision: collision.v,
        boundaryOffset: boundaryOffset.v
    };

    if(of.preventDefault) {
        h.atLocation = of.pageX;
        v.atLocation = of.pageY;
        h.atSize = 0;
        v.atSize = 0;
    } else {
        of = $(of);
        if(isWindow(of[0])) {
            h.atLocation = of.scrollLeft();
            v.atLocation = of.scrollTop();
            h.atSize = of[0].innerWidth >= of[0].outerWidth ? of[0].innerWidth : of.width();
            v.atSize = of[0].innerHeight >= of[0].outerHeight || IS_SAFARI ? of[0].innerHeight : of.height();
        } else if(of[0].nodeType === 9) {
            h.atLocation = 0;
            v.atLocation = 0;
            h.atSize = of.width();
            v.atSize = of.height();
        } else {
            const o = of.offset();
            h.atLocation = o.left;
            v.atLocation = o.top;
            h.atSize = of.outerWidth();
            v.atSize = of.outerHeight();
        }
    }

    initMyLocation(h);
    initMyLocation(v);

    const bounds = (function() {
        const win = $(window);
        const windowWidth = win.width();
        const windowHeight = win.height();
        let left = win.scrollLeft();
        let top = win.scrollTop();
        const documentElement = domAdapter.getDocumentElement();
        const hZoomLevel = support.touch ? documentElement.clientWidth / windowWidth : 1;
        const vZoomLevel = support.touch ? documentElement.clientHeight / windowHeight : 1;

        if(scrollbarWidth === undefined) {
            calculateScrollbarWidth();
        }

        let boundaryWidth = windowWidth;
        let boundaryHeight = windowHeight;

        if(boundary) {
            const $boundary = $(boundary);
            const boundaryPosition = $boundary.offset();

            left = boundaryPosition.left;
            top = boundaryPosition.top;

            boundaryWidth = $boundary.width();
            boundaryHeight = $boundary.height();
        }

        return {
            h: {
                min: left + h.boundaryOffset,
                max: left + boundaryWidth / hZoomLevel - h.mySize - h.boundaryOffset
            },
            v: {
                min: top + v.boundaryOffset,
                max: top + boundaryHeight / vZoomLevel - v.mySize - v.boundaryOffset
            }
        };
    })();

    h.oversize = calculateOversize(h, bounds.h);
    v.oversize = calculateOversize(v, bounds.v);

    h.collisionSide = collisionSide('h', h, bounds.h);
    v.collisionSide = collisionSide('v', v, bounds.v);

    if(collisionResolvers[h.collision]) {
        collisionResolvers[h.collision](h, bounds.h);
    }

    if(collisionResolvers[v.collision]) {
        collisionResolvers[v.collision](v, bounds.v);
    }

    const preciser = function(number) {
        return options.precise ? number : Math.round(number);
    };

    extend(true, result, {
        h: { location: preciser(h.myLocation), oversize: preciser(h.oversize), fit: h.fit, flip: h.flip, collisionSide: h.collisionSide },
        v: { location: preciser(v.myLocation), oversize: preciser(v.oversize), fit: v.fit, flip: v.flip, collisionSide: v.collisionSide },
        precise: options.precise
    });

    return result;
};

const position = function(what, options) {
    const $what = $(what);

    if(!options) {
        return $what.offset();
    }

    translator.resetPosition($what, true);

    const offset = $what.offset();
    const targetPosition = (options.h && options.v) ? options : calculatePosition($what, options);

    const preciser = function(number) {
        return options.precise ? number : Math.round(number);
    };

    translator.move($what, {
        left: targetPosition.h.location - preciser(offset.left),
        top: targetPosition.v.location - preciser(offset.top)
    });

    return targetPosition;
};

const offset = function(element) {
    element = $(element).get(0);
    if(isWindow(element)) {
        return null;
    } else if(element && 'pageY' in element && 'pageX' in element) {
        return { top: element.pageY, left: element.pageX };
    }

    return $(element).offset();
};

if(!position.inverseAlign) {
    position.inverseAlign = inverseAlign;
}

if(!position.normalizeAlign) {
    position.normalizeAlign = normalizeAlign;
}

module.exports = {
    calculateScrollbarWidth: calculateScrollbarWidth,
    calculate: calculatePosition,
    setup: position,
    offset: offset
};
