"use strict";

exports.validateTemplateSource = exports.templateKey = exports.suitableTemplatesByName = exports.getNormalizedTemplateArgs = exports.findTemplates = exports.defaultCreateElement = exports.addPublicElementNormalization = exports.addOneRenderedCall = exports.acquireTemplate = exports.acquireIntegrationTemplate = void 0;
var _config = _interopRequireDefault(require("../config"));
var _devices = _interopRequireDefault(require("../devices"));
var _element = require("../element");
var _errors = _interopRequireDefault(require("../errors"));
var _renderer = _interopRequireDefault(require("../renderer"));
var _child_default_template = require("../templates/child_default_template");
var _empty_template = require("../templates/empty_template");
var _template = require("../templates/template");
var _template_base = require("../templates/template_base");
var _array = require("./array");
var _common = require("./common");
var _dom = require("./dom");
var _extend = require("./extend");
var _type = require("./type");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const findTemplates = (element, name) => {
  const optionsAttributeName = 'data-options';
  const templates = (0, _renderer.default)(element).contents().filter(`[${optionsAttributeName}*="${name}"]`);
  return [].slice.call(templates).map(element => {
    const optionsString = (0, _renderer.default)(element).attr(optionsAttributeName) || '';
    return {
      element,
      options: (0, _config.default)().optionsParser(optionsString)[name]
    };
  }).filter(template => !!template.options);
};
exports.findTemplates = findTemplates;
const suitableTemplatesByName = rawTemplates => {
  const templatesMap = (0, _array.groupBy)(rawTemplates, template => template.options.name);
  if (templatesMap['undefined']) {
    throw _errors.default.Error('E0023');
  }
  const result = {};
  Object.keys(templatesMap).forEach(name => {
    var _findBestMatches$;
    const suitableTemplate = (_findBestMatches$ = (0, _common.findBestMatches)(_devices.default.current(), templatesMap[name], template => template.options)[0]) === null || _findBestMatches$ === void 0 ? void 0 : _findBestMatches$.element;
    if (suitableTemplate) {
      result[name] = suitableTemplate;
    }
  });
  return result;
};
exports.suitableTemplatesByName = suitableTemplatesByName;
const addOneRenderedCall = template => {
  const render = template.render.bind(template);
  return (0, _extend.extend)({}, template, {
    render(options) {
      const templateResult = render(options);
      options && options.onRendered && options.onRendered();
      return templateResult;
    }
  });
};
exports.addOneRenderedCall = addOneRenderedCall;
const addPublicElementNormalization = template => {
  const render = template.render.bind(template);
  return (0, _extend.extend)({}, template, {
    render(options) {
      const $container = (0, _renderer.default)(options.container);
      return render(_extends({}, options, {
        container: (0, _element.getPublicElement)($container)
      }));
    }
  });
};
exports.addPublicElementNormalization = addPublicElementNormalization;
const getNormalizedTemplateArgs = options => {
  const args = [];
  if ('model' in options) {
    args.push(options.model);
  }
  if ('index' in options) {
    args.push(options.index);
  }
  args.push(options.container);
  return args;
};
exports.getNormalizedTemplateArgs = getNormalizedTemplateArgs;
const validateTemplateSource = templateSource => {
  return typeof templateSource === 'string' ? (0, _dom.normalizeTemplateElement)(templateSource) : templateSource;
};
exports.validateTemplateSource = validateTemplateSource;
const templateKey = templateSource => {
  return (0, _type.isRenderer)(templateSource) && templateSource[0] || templateSource;
};
exports.templateKey = templateKey;
const defaultCreateElement = element => new _template.Template(element);
exports.defaultCreateElement = defaultCreateElement;
const acquireIntegrationTemplate = (templateSource, templates, isAsyncTemplate, skipTemplates) => {
  let integrationTemplate = null;
  if (!skipTemplates || skipTemplates.indexOf(templateSource) === -1) {
    integrationTemplate = templates[templateSource];
    if (integrationTemplate && !(integrationTemplate instanceof _template_base.TemplateBase)) {
      if ((0, _type.isFunction)(integrationTemplate.render)) {
        integrationTemplate = addPublicElementNormalization(integrationTemplate);
      }
      if (!isAsyncTemplate) {
        integrationTemplate = addOneRenderedCall(integrationTemplate);
      }
    }
  }
  return integrationTemplate;
};
exports.acquireIntegrationTemplate = acquireIntegrationTemplate;
const acquireTemplate = (templateSource, createTemplate, templates, isAsyncTemplate, skipTemplates, defaultTemplates) => {
  if (templateSource == null) {
    return new _empty_template.EmptyTemplate();
  }
  if (templateSource instanceof _child_default_template.ChildDefaultTemplate) {
    return defaultTemplates[templateSource.name];
  }
  if (templateSource instanceof _template_base.TemplateBase) {
    return templateSource;
  }

  // TODO: templateSource.render is needed for angular2 integration. Try to remove it after supporting TypeScript modules.
  if ((0, _type.isFunction)(templateSource.render) && !(0, _type.isRenderer)(templateSource)) {
    return isAsyncTemplate ? templateSource : addOneRenderedCall(templateSource);
  }
  if (templateSource.nodeType || (0, _type.isRenderer)(templateSource)) {
    return createTemplate((0, _renderer.default)(templateSource));
  }
  return acquireIntegrationTemplate(templateSource, templates, isAsyncTemplate, skipTemplates) || defaultTemplates[templateSource] || createTemplate(templateSource);
};
exports.acquireTemplate = acquireTemplate;