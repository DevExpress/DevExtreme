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
 * @namespace DevExpress
 * @public
 */
declare function setTemplateEngine(templateEngineOptions: { compile?: Function; render?: Function }): void;

export default setTemplateEngine;
