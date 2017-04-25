"use strict";

/**
* @name Utils_compileGetter
* @publicName compileGetter(expr)
* @param1 expr:string|array
* @return function
* @module utils
* @export compileGetter
*/
exports.compileGetter = require("./core/utils/data").compileGetter;
/**
* @name Utils_compileSetter
* @publicName compileSetter(expr)
* @param1 expr:string|array
* @return function
* @module utils
* @export compileSetter
*/
exports.compileSetter = require("./core/utils/data").compileSetter;
