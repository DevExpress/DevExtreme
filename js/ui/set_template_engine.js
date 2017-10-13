"use strict";

/**
* @name ui
* @publicName ui
* @hidden
* @namespace DevExpress
*/

/**
* @name ui_setTemplateEngine
* @publicName setTemplateEngine(name)
* @param1 templateEngineName:string
* @static
* @module ui/set_template_engine
* @export default
*/
/**
* @name ui_setTemplateEngine
* @publicName setTemplateEngine(options)
* @param1 templateEngineOptions:object
* @param1_field1 compile:function(html, $element)
* @param1_field2 render:function(template, data, index)
* @static
* @module ui/set_template_engine
* @export default
*/

module.exports = require("./widget/jquery.template").setTemplateEngine;
