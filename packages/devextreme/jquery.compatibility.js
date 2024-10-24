/*!
 * jQuery JavaScript Library v3.7.1
 * https://jquery.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2023-08-28T13:37Z
 */

/*
 * https://blog.jquery.com/2024/02/06/jquery-4-0-0-beta/
 * Deprecated APIs removed
*/
( function( jQuery ) {

"use strict";

var isFunction = function isFunction( obj ) {
    return typeof obj === "function" && typeof obj.nodeType !== "number" &&
        typeof obj.item !== "function";
};
var isWindow = function isWindow( obj ) {
    return obj != null && obj === obj.window;
};

function toType(obj) {
    if ( obj == null ) {
        return obj + "";
    }
}

function nodeName( elem, name ) {
    return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
}

var rmsPrefix = /^-ms-/,
    rdashAlpha = /-([a-z])/g;
function fcamelCase( _all, letter ) {
    return letter.toUpperCase();
}
function camelCase( string ) {
    return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}

var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;

jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;
jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {
    var type = jQuery.type( obj );
    return ( type === "number" || type === "string" ) &&
        !isNaN( obj - parseFloat( obj ) );
};
jQuery.trim = function( text ) {
    return text == null ?
        "" :
        ( text + "" ).replace( rtrim, "$1" );
};

} )(window.jQuery);
