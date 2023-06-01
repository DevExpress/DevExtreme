import config from '../config';
import devices from '../devices';
import Errors from '../errors';
import $ from '../renderer';
import { ChildDefaultTemplate } from '../templates/child_default_template';
import { EmptyTemplate } from '../templates/empty_template';
import { Template } from '../templates/template';
import { TemplateBase } from '../templates/template_base';
import { groupBy } from './array';
import { findBestMatches } from './common';
import { normalizeTemplateElement } from './dom';
import { extend } from './extend';
import { isFunction, isRenderer } from './type';

export const findTemplates = (element, name) => {
    const optionsAttributeName = 'data-options';
    const templates = $(element).contents().filter(`[${optionsAttributeName}*="${name}"]`);

    return [].slice.call(templates).map((element) => {
        const optionsString = $(element).attr(optionsAttributeName) || '';
        return {
            element,
            options: config().optionsParser(optionsString)[name]
        };
    }).filter(template => !!template.options);
};

export const suitableTemplatesByName = (rawTemplates) => {
    const templatesMap = groupBy(rawTemplates, (template) => template.options.name);

    if(templatesMap['undefined']) {
        throw Errors.Error('E0023');
    }

    const result = {};

    Object.keys(templatesMap).forEach((name) => {
        const suitableTemplate = findBestMatches(
            devices.current(),
            templatesMap[name],
            template => template.options
        )[0]?.element;

        if(suitableTemplate) {
            result[name] = suitableTemplate;
        }
    });

    return result;
};

export const addOneRenderedCall = (template) => {
    const render = template.render.bind(template);
    return extend({}, template, {
        render(options) {
            const templateResult = render(options);
            options && options.onRendered && options.onRendered();
            return templateResult;
        }
    });
};

export const getNormalizedTemplateArgs = (options) => {
    const args = [];

    if('model' in options) {
        args.push(options.model);
    }
    if('index' in options) {
        args.push(options.index);
    }
    args.push(options.container);

    return args;
};

export const validateTemplateSource = (templateSource) => {
    return typeof templateSource === 'string'
        ? normalizeTemplateElement(templateSource)
        : templateSource;
};

export const templateKey = (templateSource) => {
    return (isRenderer(templateSource) && templateSource[0]) || templateSource;
};

export const defaultCreateElement = element => new Template(element);

export const acquireIntegrationTemplate = (templateSource, templates, isAsyncTemplate, skipTemplates) => {
    let integrationTemplate = null;

    if(!skipTemplates || skipTemplates.indexOf(templateSource) === -1) {
        integrationTemplate = templates[templateSource];
        if(integrationTemplate && !(integrationTemplate instanceof TemplateBase) && !isAsyncTemplate) {
            integrationTemplate = addOneRenderedCall(integrationTemplate);
        }
    }

    return integrationTemplate;
};

export const acquireTemplate = (templateSource, createTemplate, templates, isAsyncTemplate, skipTemplates, defaultTemplates) => {
    if(templateSource == null) {
        return new EmptyTemplate();
    }

    if(templateSource instanceof ChildDefaultTemplate) {
        return defaultTemplates[templateSource.name];
    }

    if(templateSource instanceof TemplateBase) {
        return templateSource;
    }

    // TODO: templateSource.render is needed for angular2 integration. Try to remove it after supporting TypeScript modules.
    if(isFunction(templateSource.render) && !isRenderer(templateSource)) {
        return isAsyncTemplate ? templateSource : addOneRenderedCall(templateSource);
    }

    if(templateSource.nodeType || isRenderer(templateSource)) {
        return createTemplate($(templateSource));
    }

    return acquireIntegrationTemplate(templateSource, templates, isAsyncTemplate, skipTemplates)
        || defaultTemplates[templateSource]
        || createTemplate(templateSource);
};
