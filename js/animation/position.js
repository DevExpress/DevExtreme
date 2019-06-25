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


var $ = require("../core/renderer"),
    commonUtils = require("../core/utils/common"),
    each = require("../core/utils/iterator").each,
    windowUtils = require("../core/utils/window"),
    window = windowUtils.getWindow(),
    domAdapter = require("../core/dom_adapter"),
    isWindow = require("../core/utils/type").isWindow,
    extend = require("../core/utils/extend").extend,
    browser = require("../core/utils/browser"),

    translator = require("./translator"),
    support = require("../core/utils/support");

var horzRe = /left|right/,
    vertRe = /top|bottom/,
    collisionRe = /fit|flip|none/,
    IS_SAFARI = browser.safari;

var normalizeAlign = function(raw) {
    var result = {
        h: "center",
        v: "center"
    };

    var pair = commonUtils.splitPair(raw);

    if(pair) {
        each(pair, function() {
            var w = String(this).toLowerCase();
            if(horzRe.test(w)) {
                result.h = w;
            } else if(vertRe.test(w)) {
                result.v = w;
            }
        });
    }

    return result;
};

var normalizeOffset = function(raw) {
    return commonUtils.pairToObject(raw);
};

var normalizeCollision = function(raw) {
    var pair = commonUtils.splitPair(raw),
        h = String(pair && pair[0]).toLowerCase(),
        v = String(pair && pair[1]).toLowerCase();

    if(!collisionRe.test(h)) {
        h = "none";
    }
    if(!collisionRe.test(v)) {
        v = h;
    }

    return { h: h, v: v };
};

var getAlignFactor = function(align) {
    switch(align) {
        case "center":
            return 0.5;
        case "right":
        case "bottom":
            return 1;
        default:
            return 0;
    }
};

var inverseAlign = function(align) {
    switch(align) {
        case "left":
            return "right";
        case "right":
            return "left";
        case "top":
            return "bottom";
        case "bottom":
            return "top";
        default:
            return align;
    }
};

var calculateOversize = function(data, bounds) {
    var oversize = 0;

    if(data.myLocation < bounds.min) {
        oversize += bounds.min - data.myLocation;
    }

    if(data.myLocation > bounds.max) {
        oversize += data.myLocation - bounds.max;
    }

    return oversize;
};

var collisionSide = function(direction, data, bounds) {
    if(data.myLocation < bounds.min) {
        return direction === "h" ? "left" : "top";
    }
    if(data.myLocation > bounds.max) {
        return direction === "h" ? "right" : "bottom";
    }
    return "none";
};

// TODO: rename?
var initMyLocation = function(data) {
    data.myLocation = data.atLocation
        + getAlignFactor(data.atAlign) * data.atSize
        - getAlignFactor(data.myAlign) * data.mySize
        + data.offset;
};

var collisionResolvers = {

    "fit": function(data, bounds) {
        var result = false;
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

    "flip": function(data, bounds) {
        data.flip = false;

        if(data.myAlign === "center" && data.atAlign === "center") {
            return;
        }

        if(data.myLocation < bounds.min || data.myLocation > bounds.max) {
            var inverseData = extend({}, data, {
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

    "flipfit": function(data, bounds) {
        this.flip(data, bounds);
        this.fit(data, bounds);
    },

    "none": function(data) {
        data.oversize = 0;
    }
};

var scrollbarWidth;

var calculateScrollbarWidth = function() {
    var $scrollDiv = $("<div>").css({
            width: 100,
            height: 100,
            overflow: "scroll",
            position: "absolute",
            top: -9999
        }).appendTo($("body")),
        result = $scrollDiv.get(0).offsetWidth - $scrollDiv.get(0).clientWidth;

    $scrollDiv.remove();

    scrollbarWidth = result;
};

var defaultPositionResult = {
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

var calculatePosition = function(what, options) {
    var $what = $(what),
        currentOffset = $what.offset(),
        result = extend(true, {}, defaultPositionResult, {
            h: { location: currentOffset.left },
            v: { location: currentOffset.top }
        });

    if(!options) {
        return result;
    }

    var my = normalizeAlign(options.my),
        at = normalizeAlign(options.at),
        of = ($(options.of).length && options.of) || window,
        offset = normalizeOffset(options.offset),
        collision = normalizeCollision(options.collision),
        boundary = options.boundary,
        boundaryOffset = normalizeOffset(options.boundaryOffset);

    var h = {
        mySize: $what.outerWidth(),
        myAlign: my.h,
        atAlign: at.h,
        offset: offset.h,
        collision: collision.h,
        boundaryOffset: boundaryOffset.h
    };

    var v = {
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
            var o = of.offset();
            h.atLocation = o.left;
            v.atLocation = o.top;
            h.atSize = of.outerWidth();
            v.atSize = of.outerHeight();
        }
    }

    initMyLocation(h);
    initMyLocation(v);

    var bounds = (function() {
        var win = $(window),
            windowWidth = win.width(),
            windowHeight = win.height(),
            left = win.scrollLeft(),
            top = win.scrollTop(),
            documentElement = domAdapter.getDocumentElement(),
            hZoomLevel = support.touch ? documentElement.clientWidth / windowWidth : 1,
            vZoomLevel = support.touch ? documentElement.clientHeight / windowHeight : 1;

        if(scrollbarWidth === undefined) {
            calculateScrollbarWidth();
        }

        var boundaryWidth = windowWidth,
            boundaryHeight = windowHeight;

        if(boundary) {
            var $boundary = $(boundary),
                boundaryPosition = $boundary.offset();

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

    h.collisionSide = collisionSide("h", h, bounds.h);
    v.collisionSide = collisionSide("v", v, bounds.v);

    if(collisionResolvers[h.collision]) {
        collisionResolvers[h.collision](h, bounds.h);
    }

    if(collisionResolvers[v.collision]) {
        collisionResolvers[v.collision](v, bounds.v);
    }

    var preciser = function(number) {
        return options.precise ? number : Math.round(number);
    };

    extend(true, result, {
        h: { location: preciser(h.myLocation), oversize: preciser(h.oversize), fit: h.fit, flip: h.flip, collisionSide: h.collisionSide },
        v: { location: preciser(v.myLocation), oversize: preciser(v.oversize), fit: v.fit, flip: v.flip, collisionSide: v.collisionSide },
        precise: options.precise
    });

    return result;
};

var position = function(what, options) {
    var $what = $(what);

    if(!options) {
        return $what.offset();
    }

    translator.resetPosition($what, true);

    var offset = $what.offset(),
        targetPosition = (options.h && options.v) ? options : calculatePosition($what, options);

    var preciser = function(number) {
        return options.precise ? number : Math.round(number);
    };

    translator.move($what, {
        left: targetPosition.h.location - preciser(offset.left),
        top: targetPosition.v.location - preciser(offset.top)
    });

    return targetPosition;
};

var offset = function(element) {
    element = $(element).get(0);
    if(isWindow(element)) {
        return null;
    } else if(element && "pageY" in element && "pageX" in element) {
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
