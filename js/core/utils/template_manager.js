import $ from '../renderer';
import { isRenderer, isFunction } from './type';
import { findBestMatches } from './common';
import { extend } from './extend';
import { ChildDefaultTemplate } from '../templates/child_default_template';
import { TemplateBase } from '../templates/template_base';
import { EmptyTemplate } from '../templates/empty_template';
import { getElementOptions, normalizeTemplateElement } from './dom';
import devices from '../devices';
import { Template } from '../templates/template';

export const findTemplateByDevice = (templates) => {
    const suitableTemplate = findBestMatches(
        devices.current(),
        templates,
        template => getElementOptions(template).dxTemplate
    )[0];

    templates.forEach((template) => {
        if(template !== suitableTemplate) {
            $(template).remove();
        }
    });

    return suitableTemplate;
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
        return addOneRenderedCall(templateSource);
    }

    if(templateSource.nodeType || isRenderer(templateSource)) {
        return createTemplate($(templateSource));
    }

    return acquireIntegrationTemplate(templateSource, templates, isAsyncTemplate, skipTemplates)
        || defaultTemplates[templateSource]
        || createTemplate(templateSource);
};
