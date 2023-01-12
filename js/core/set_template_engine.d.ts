/**
 * @docid
 * @publicName setTemplateEngine(name)
 * @namespace DevExpress
 * @public
 */
declare function setTemplateEngine(templateEngineName: string): void;

/**
 * @docid
 * @publicName setTemplateEngine(options)
 * @param1_field1 compile:function(html, $element)
 * @param1_field2 render:function(template, data, index)
 * @namespace DevExpress
 * @public
 */
declare function setTemplateEngine(templateEngineOptions: { compile?: Function; render?: Function }): void;

export default setTemplateEngine;
