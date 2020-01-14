(function(factory) {
    /* global define, DevExpress, window */
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            module.exports = factory(
                require('jquery'),
                require('./ui/set_template_engine'),
                require('./ui/widget/ui.template_base').renderedCallbacks,
                require('./core/guid'),
                require('./ui/validation_engine'),
                require('./core/utils/iterator'),
                require('./core/utils/dom').extractTemplateMarkup,
                require('./core/utils/string').encodeHtml
            );
        });
    } else {
        const ui = DevExpress.ui;

        DevExpress.aspnet = factory(
            window.jQuery,
            ui && ui.setTemplateEngine,
            ui && ui.templateRendered,
            DevExpress.data.Guid,
            DevExpress.validationEngine,
            DevExpress.utils.iterator,
            DevExpress.utils.dom.extractTemplateMarkup,
            DevExpress.utils.string.encodeHtml
        );
    }
})(function($, setTemplateEngine, templateRendered, Guid, validationEngine, iteratorUtils, extractTemplateMarkup, encodeHtml) {
    const templateCompiler = createTemplateCompiler();
    let pendingCreateComponentRoutines = [ ];
    let enableAlternateTemplateTags = true;

    function createTemplateCompiler() {
        const OPEN_TAG = '<%';
        const CLOSE_TAG = '%>';
        const ENCODE_QUALIFIER = '-';
        const INTERPOLATE_QUALIFIER = '=';

        const EXTENDED_OPEN_TAG = /[<[]%/g;
        const EXTENDED_CLOSE_TAG = /%[>\]]/g;

        function acceptText(bag, text) {
            if(text) {
                bag.push('_.push(', JSON.stringify(text), ');');
            }
        }

        function acceptCode(bag, code) {
            const encode = code.charAt(0) === ENCODE_QUALIFIER;
            const value = code.substr(1);
            const interpolate = code.charAt(0) === INTERPOLATE_QUALIFIER;

            if(encode || interpolate) {
                bag.push('_.push(');
                bag.push(encode ? 'arguments[1](' + value + ')' : value);
                bag.push(');');
            } else {
                bag.push(code + '\n');
            }
        }

        return function(text) {
            const bag = ['var _ = [];', 'with(obj||{}) {'];
            const chunks = text.split(enableAlternateTemplateTags ? EXTENDED_OPEN_TAG : OPEN_TAG);

            acceptText(bag, chunks.shift());

            for(let i = 0; i < chunks.length; i++) {
                const tmp = chunks[i].split(enableAlternateTemplateTags ? EXTENDED_CLOSE_TAG : CLOSE_TAG);
                if(tmp.length !== 2) {
                    throw 'Template syntax error';
                }
                acceptCode(bag, tmp[0]);
                acceptText(bag, tmp[1]);
            }

            bag.push('}', 'return _.join(\'\')');

            // eslint-disable-next-line no-new-func
            return new Function('obj', bag.join(''));
        };
    }

    function createTemplateEngine() {
        return {
            compile: function(element) {
                return templateCompiler(extractTemplateMarkup(element));
            },
            render: function(template, data) {
                let html = template(data, encodeHtml);

                const dxMvcExtensionsObj = window['MVCx'];
                if(dxMvcExtensionsObj && !dxMvcExtensionsObj.isDXScriptInitializedOnLoad) {
                    html = html.replace(/(<script[^>]+)id="dxss_.+?"/g, '$1');
                }

                return html;
            }
        };
    }

    function getValidationSummary(validationGroup) {
        let result;
        $('.dx-validationsummary').each(function(_, element) {
            const summary = $(element).data('dxValidationSummary');
            if(summary && summary.option('validationGroup') === validationGroup) {
                result = summary;
                return false;
            }
        });
        return result;
    }

    function createValidationSummaryItemsFromValidators(validators, editorNames) {
        const items = [];

        iteratorUtils.each(validators, function(_, validator) {
            const widget = validator.$element().data('dx-validation-target');
            if(widget && $.inArray(widget.option('name'), editorNames) > -1) {
                items.push({
                    text: widget.option('validationError.message'),
                    validator: validator
                });
            }
        });

        return items;
    }

    function createComponent(name, options, id, validatorOptions) {
        const selector = '#' + String(id).replace(/[^\w-]/g, '\\$&');
        pendingCreateComponentRoutines.push(function() {
            const $component = $(selector)[name](options);
            if($.isPlainObject(validatorOptions)) {
                $component.dxValidator(validatorOptions);
            }
        });
    }

    templateRendered.add(function() {
        const snapshot = pendingCreateComponentRoutines.slice();
        pendingCreateComponentRoutines = [ ];
        snapshot.forEach(function(func) { func(); });
    });

    return {
        createComponent: createComponent,

        renderComponent: function(name, options, id, validatorOptions) {
            id = id || ('dx-' + new Guid());
            createComponent(name, options, id, validatorOptions);
            return '<div id="' + id + '"></div>';
        },

        getEditorValue: function(inputName) {
            const $widget = $('input[name=\'' + inputName + '\']').closest('.dx-widget');
            if($widget.length) {
                const dxComponents = $widget.data('dxComponents');
                const widget = $widget.data(dxComponents[0]);

                if(widget) {
                    return widget.option('value');
                }
            }
        },

        setTemplateEngine: function() {
            if(setTemplateEngine) {
                setTemplateEngine(createTemplateEngine());
            }
        },

        enableAlternateTemplateTags: function(value) {
            enableAlternateTemplateTags = value;
        },

        createValidationSummaryItems: function(validationGroup, editorNames) {
            const summary = getValidationSummary(validationGroup);
            let groupConfig;
            let items;

            if(summary) {
                groupConfig = validationEngine.getGroupConfig(validationGroup);
                if(groupConfig) {
                    items = createValidationSummaryItemsFromValidators(groupConfig.validators, editorNames);
                    items.length && summary.option('items', items);
                }
            }
        }
    };
});
