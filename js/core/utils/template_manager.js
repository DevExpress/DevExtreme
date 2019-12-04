import $ from '../renderer';
import { isRenderer } from './type';
import { findBestMatches } from './common';
import { extend } from './extend';
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
