import $ from '../renderer';
import config from '../config';

const optionsAttributeName = 'data-options';

export const findTemplates = (element, name) => {
    const templates = $(element).contents().filter(`[${optionsAttributeName}*="${name}"]`);

    return [].slice.call(templates).map((element) => {
        const optionsString = $(element).attr(optionsAttributeName) || '';
        return {
            element,
            options: config().optionsParser(optionsString)[name]
        };
    }).filter(template => !!template.options);
};
