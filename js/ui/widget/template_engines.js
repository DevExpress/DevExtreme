import { extractTemplateMarkup } from '../../core/utils/dom';
import { registerTemplateEngine } from './template_engine_registry';

registerTemplateEngine('jquery-tmpl', {
    compile: (element) => {
        return extractTemplateMarkup(element);
    },
    render: (template, data) => {
        /* global jQuery */
        return jQuery.tmpl(template, data);
    }
});

registerTemplateEngine('jsrender', {
    compile: (element) => {
        /* global jsrender */
        return (jQuery ? jQuery : jsrender).templates(extractTemplateMarkup(element));
    },
    render: (template, data) => {
        return template.render(data);
    }
});

registerTemplateEngine('mustache', {
    compile: (element) => {
        /* global Mustache */
        return extractTemplateMarkup(element);
    },
    render: (template, data) => {
        return Mustache.render(template, data);
    }
});

registerTemplateEngine('hogan', {
    compile: (element) => {
        /* global Hogan */
        return Hogan.compile(extractTemplateMarkup(element));
    },
    render: (template, data) => {
        return template.render(data);
    }
});

registerTemplateEngine('underscore', {
    compile: (element) => {
        /* global _ */
        return _.template(extractTemplateMarkup(element));
    },
    render: (template, data) => {
        return template(data);
    }
});

registerTemplateEngine('handlebars', {
    compile: (element) => {
        /* global Handlebars */
        return Handlebars.compile(extractTemplateMarkup(element));
    },
    render: (template, data) => {
        return template(data);
    }
});

registerTemplateEngine('doT', {
    compile: (element) => {
        /* global doT */
        return doT.template(extractTemplateMarkup(element));
    },
    render: (template, data) => {
        return template(data);
    }
});
