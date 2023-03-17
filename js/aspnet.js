// eslint-disable-next-line no-restricted-imports
import $ from 'jquery';
import { setTemplateEngine } from './core/templates/template_engine_registry';
import { renderedCallbacks as templateRendered } from './core/templates/template_base';
import Guid from './core/guid';
import validationEngine from './ui/validation_engine';
import * as iteratorUtils from './core/utils/iterator';
import { extractTemplateMarkup } from './core/utils/dom';
import { encodeHtml } from './core/utils/string';
import ajax from './core/utils/ajax';

const templateCompiler = createTemplateCompiler();
let pendingCreateComponentRoutines = [];

function createTemplateCompiler() {
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
            let expression = value;
            if(encode) {
                expression = 'encodeHtml((' + value + ' !== null && ' + value + ' !== undefined) ? ' + value + ' : "")';
                if(/^\s*$/.test(value)) {
                    expression = 'encodeHtml(' + value + ')';
                }
            }
            bag.push(expression);
            bag.push(');');
        } else {
            bag.push(code + '\n');
        }
    }

    return function(text) {
        const bag = ['const _ = [];', 'with(obj||{}) {'];
        const chunks = text.split(EXTENDED_OPEN_TAG);

        acceptText(bag, chunks.shift());

        for(let i = 0; i < chunks.length; i++) {
            const tmp = chunks[i].split(EXTENDED_CLOSE_TAG);
            if(tmp.length !== 2) {
                throw 'Template syntax error';
            }
            acceptCode(bag, tmp[0]);
            acceptText(bag, tmp[1]);
        }

        bag.push('}', 'return _.join(\'\')');

        // eslint-disable-next-line no-new-func
        return new Function('obj', 'encodeHtml', bag.join(''));
    };
}

function createTemplateEngine() {
    return {
        compile: function(element) {
            return templateCompiler(extractTemplateMarkup(element));
        },
        render: function(template, data) {
            let html = template(data, encodeHtml);

            // eslint-disable-next-line no-undef
            const dxMvcExtensionsObj = window['MVCx'];
            if(dxMvcExtensionsObj && !dxMvcExtensionsObj.isDXScriptInitializedOnLoad) {
                html = html.replace(/(<script[^>]+)id="dxss_.+?"/g, '$1');
            }

            return html;
        },
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
                validator: validator,
            });
        }
    });

    return items;
}

function createComponent(name, options, id, validatorOptions) {
    const selector = '#' + String(id).replace(/[^\w-]/g, '\\$&');
    pendingCreateComponentRoutines.push(function() {
        const $element = $(selector);
        if($element.length) {
            const $component = $(selector)[name](options);
            if($.isPlainObject(validatorOptions)) {
                $component.dxValidator(validatorOptions);
            }
            return true;
        }
        return false;
    });
}

templateRendered.add(function() {
    const snapshot = pendingCreateComponentRoutines.slice();
    const leftover = [];

    pendingCreateComponentRoutines = [];
    snapshot.forEach(function(func) {
        if(!func()) {
            leftover.push(func);
        }
    });
    pendingCreateComponentRoutines = pendingCreateComponentRoutines.concat(leftover);
});

export default {
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

    createValidationSummaryItems: function(validationGroup, editorNames) {
        const summary = getValidationSummary(validationGroup);

        if(summary) {
            const groupConfig = validationEngine.getGroupConfig(validationGroup);
            if(groupConfig) {
                const items = createValidationSummaryItemsFromValidators(groupConfig.validators, editorNames);
                items.length && summary.option('items', items);
            }
        }
    },

    sendValidationRequest: function(propertyName, propertyValue, url, method) {
        const d = $.Deferred();
        const data = {};
        data[propertyName] = propertyValue;

        ajax.sendRequest({
            url: url,
            dataType: 'json',
            method: method || 'GET',
            data: data,
        }).then(function(response) {
            if(typeof response === 'string') {
                d.resolve({
                    isValid: false,
                    message: response,
                });
            } else {
                d.resolve(response);
            }
        }, function(xhr) {
            d.reject({
                isValid: false,
                message: xhr.responseText,
            });
        });

        return d.promise();
    },
};
