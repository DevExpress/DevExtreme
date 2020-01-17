/**
 * @name ui
 * @namespace DevExpress
 * @section utils
*/

/**
 * @name ui.setTemplateEngine
 * @publicName setTemplateEngine(name)
 * @param1 templateEngineName:string
 * @static
 * @module ui/set_template_engine
 * @export default
*/
/**
 * @name ui.setTemplateEngine
 * @publicName setTemplateEngine(options)
 * @param1 templateEngineOptions:object
 * @param1_field1 compile:function(html, $element)
 * @param1_field2 render:function(template, data, index)
 * @static
 * @module ui/set_template_engine
 * @export default
*/
module.exports = require('./templates/template_engine_registry').setTemplateEngine;
