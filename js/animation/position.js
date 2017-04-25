"use strict";

/**
* @name positionConfig
* @publicName positionConfig
* @type object
*/

/**
* @name positionConfig_my
* @publicName my
* @type string|object
* @acceptValues 'left'|'right'|'top'|'bottom'|'center'|'left top'|'left bottom'|'right top'|'right bottom'
*/
/**
* @name positionConfig_my_x
* @publicName x
* @type string
* @acceptValues 'left'|'right'|'center'
*/
/**
* @name positionConfig_my_y
* @publicName y
* @type string
* @acceptValues 'top'|'bottom'|'center'
*/

/**
* @name positionConfig_at
* @publicName at
* @type string|object
* @acceptValues 'left'|'right'|'top'|'bottom'|'center'|'left top'|'left bottom'|'right top'|'right bottom'
*/
/**
* @name positionConfig_at_x
* @publicName x
* @type string
* @acceptValues 'left'|'right'|'center'
*/
/**
* @name positionConfig_at_y
* @publicName y
* @type string
* @acceptValues 'top'|'bottom'|'center'
*/

/**
* @name positionConfig_of
* @publicName of
* @type string|Node|jQuery|window
*/

/**
* @name positionConfig_offset
* @publicName offset
* @type string|object
*/
/**
* @name positionConfig_offset_x
* @publicName x
* @type number
* @default 0
*/
/**
* @name positionConfig_offset_y
* @publicName y
* @type number
* @default 0
*/

/**
* @name positionConfig_collision
* @publicName collision
* @type string|object
* @acceptValues 'none'|'flip'|'fit'|'flipfit'|'none flip'|'flip none'|'none fit'|'fit none'|'none flipfit'|'flipfit none'|'flip fit'|'fit flip'|'fit flipfit'|'flipfit fit'
*/
/**
* @name positionConfig_collision_x
* @publicName x
* @type string
* @default 'none'
* @acceptValues 'none'|'flip'|'fit'|'flipfit'
*/
/**
* @name positionConfig_collision_y
* @publicName y
* @type string
* @default 'none'
* @acceptValues 'none'|'flip'|'fit'|'flipfit'
*/

/**
* @name positionConfig_boundary
* @publicName boundary
* @type string|Node|jQuery|window
*/

/**
* @name positionConfig_boundaryOffset
* @publicName boundaryOffset
* @type string|object
*/
/**
* @name positionConfig_boundaryOffset_x
* @publicName x
* @type number
* @default 0
*/
/**
* @name positionConfig_boundaryOffset_y
* @publicName y
* @default 0
* @type number
*/



var $ = require("jquery"),
    commonUtils = require("../core/utils/common"),
    stringUtils = require("../core/utils/string"),

    translator = require("./translator"),
    support = require("../core/utils/support");

var horzRe = /left|right/,
    vertRe = /top|bottom/,
    collisionRe = /fit|flip|none/;

var normalizeAlign = function(raw) {
    var result = {
        h: "center",
        v: "center"
    };

    var pair = commonUtils.splitPair(raw);

    if(pair) {
        $.each(pair, function() {
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
    return stringUtils.pairToObject(raw);
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
            var inverseData = $.extend({}, data, {
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
        result = $.extend(true, {}, defaultPositionResult, {
            h: { location: currentOffset.left },
            v: { location: currentOffset.top }
        });

    if(!options) {
        return result;
    }

    var my = normalizeAlign(options.my),
        at = normalizeAlign(options.at),
        of = options.of || window,
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
        if($.isWindow(of[0])) {
            h.atLocation = of.scrollLeft();
            v.atLocation = of.scrollTop();
            h.atSize = of.width(); //Vertical scrollbar should not be included
            v.atSize = of[0].innerHeight; //Including horizontal scrollbar is better than incorrect positioning on mobile safari
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
            hScrollbar = document.width > document.documentElement.clientWidth,
            vScrollbar = document.height > document.documentElement.clientHeight,
            hZoomLevel = support.touch ? document.documentElement.clientWidth / (vScrollbar ? windowWidth - scrollbarWidth : windowWidth) : 1,
            vZoomLevel = support.touch ? document.documentElement.clientHeight / (hScrollbar ? windowHeight - scrollbarWidth : windowHeight) : 1;

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

    $.extend(true, result, {
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

    translator.resetPosition($what);

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
    if($.isWindow(element)) {
        return null;
    } else if(element instanceof $.Event) {
        return { top: element.pageY, left: element.pageX };
    }

    return $(element).offset();
};

$.extend(position, {
    inverseAlign: inverseAlign,
    normalizeAlign: normalizeAlign
});

module.exports = {
    calculateScrollbarWidth: calculateScrollbarWidth,
    calculate: calculatePosition,
    setup: position,
    offset: offset
};
