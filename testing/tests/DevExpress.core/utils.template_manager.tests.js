import * as domUtils from 'core/utils/dom';
import * as type from 'core/utils/type';
import renderer from 'core/renderer';
import {
    findTemplates, suitableTemplatesByName, addOneRenderedCall, templateKey,
    getNormalizedTemplateArgs, validateTemplateSource,
    defaultCreateElement, acquireIntegrationTemplate, acquireTemplate,
} from 'core/utils/template_manager';
import { Template } from 'core/templates/template';
import { TemplateBase } from 'core/templates/template_base';
import { EmptyTemplate } from 'core/templates/empty_template';
import { ChildDefaultTemplate } from 'core/templates/child_default_template';
import devices from 'core/devices';

QUnit.module('TemplateManager utils', {
    beforeEach: function() {
        const $ = renderer;
        this.$remove = sinon.stub($.fn, 'remove');
    },
    afterEach: function() {
        this.$remove.restore();
    }
});

QUnit.test('#validateTemplateSource', function(assert) {
    const normalize = sinon.stub(domUtils, 'normalizeTemplateElement');

    assert.strictEqual(validateTemplateSource(1), 1, 'should return value if it is not a string');
    assert.notOk(normalize.called, 'should not normalize template element if value is a string');

    validateTemplateSource('template');
    assert.ok(normalize.called, 'should normalize template element if value is a string');

    normalize.restore();
});

QUnit.test('#templateKey', function(assert) {
    const templateSource = ['template'];
    const isRenderer = sinon.stub(type, 'isRenderer');

    isRenderer.returns(true);
    assert.strictEqual(templateKey(templateSource), 'template', 'should return value if it is not a renderer function');

    isRenderer.returns(false);
    assert.strictEqual(templateKey(templateSource), templateSource, 'should return a first array item if it is a renderer function');

    isRenderer.restore();
});

QUnit.test('#findTemplates', function(assert) {
    const container = document.createElement('div');
    const template1 = document.createElement('div');
    template1.setAttribute('data-options', 'optionsName: { name: \'t1\' }');
    const template2 = document.createElement('div');
    template2.setAttribute('data-options', 'optionsName: { name: \'t2\' }');
    const templateWithoutOptions = document.createElement('div');
    templateWithoutOptions.setAttribute('data-options', '');
    const notATemplate = document.createElement('div');

    [ template1, template2, templateWithoutOptions, notATemplate ].forEach((element) => {
        container.appendChild(element);
    });

    const templates = findTemplates(container, 'optionsName');

    assert.deepEqual(templates, [
        {
            element: template1,
            options: { name: 't1' }
        },
        {
            element: template2,
            options: { name: 't2' }
        }
    ]);
});

QUnit.test('#suitableTemplatesByName', function(assert) {
    const currentDeviceMethod = sinon.stub(devices, 'current').returns({ testDevice: true });
    const templates = [
        {
            element: 'el1',
            options: { name: 'a' }
        },
        {
            element: 'el2',
            options: { name: 'a', testDevice: true }
        },
        {
            element: 'el3',
            options: { name: 'b', testDevice: true }
        },
        {
            element: 'el4',
            options: { name: 'c', testDevice: false }
        }
    ];

    const result = suitableTemplatesByName(templates);

    assert.deepEqual(result, { a: 'el2', b: 'el3' }, 'should return suitable templates');

    currentDeviceMethod.restore();
});

QUnit.test('#addOneRenderedCall', function(assert) {
    const render = sinon.spy();
    const template = { render, customField: 'customField' };
    const nextTemplate = addOneRenderedCall(template);

    assert.strictEqual(nextTemplate.customField, 'customField', 'should keep previous fields');

    nextTemplate.render('options');
    assert.ok(render.calledWith('options'), 'should call old `render` method');
});

QUnit.test('#getNormalizedTemplateArgs', function(assert) {
    const options = { model: 'model', index: 'index', container: 'container' };
    const normalizeArgs = getNormalizedTemplateArgs(options);

    assert.strictEqual(normalizeArgs[0], 'model', 'should contains model');
    assert.strictEqual(normalizeArgs[1], 'index', 'should contains index');
    assert.strictEqual(normalizeArgs[2], 'container', 'should contains container');
    assert.strictEqual(normalizeArgs[3], undefined, 'should not append something else');
});

QUnit.test('#defaultCreateElement', function(assert) {
    const template = defaultCreateElement();

    assert.ok(template instanceof Template, 'should return instance of Template');
});

QUnit.test('#acquireIntegrationTemplate', function(assert) {
    const onRendered = sinon.spy();
    const templateSource = 'templateSource';
    const templates = { templateSource: new TemplateBase() };
    const isAsyncTemplate = false;

    assert.equal(
        acquireIntegrationTemplate(templateSource, templates, isAsyncTemplate, ['templateSource']),
        null,
        'should return null if skip template exists'
    );

    assert.ok(
        acquireIntegrationTemplate(templateSource, templates, isAsyncTemplate, []) instanceof TemplateBase,
        'should return template if it is TemplateBase'
    );

    const templates2 = { templateSource: { render: () => 'template render' } };
    const result = acquireIntegrationTemplate(templateSource, templates2, isAsyncTemplate, []);

    result.render({ onRendered });
    assert.strictEqual(
        onRendered.callCount,
        1,
        'should return template if it is async template'
    );
});

QUnit.test('#acquireTemplate', function(assert) {
    assert.ok(acquireTemplate(null) instanceof EmptyTemplate, 'should return empty template if source is null');

    assert.equal(
        acquireTemplate(new ChildDefaultTemplate('templateName'), undefined, undefined, undefined, undefined, { templateName: 'defaultTemplate' }),
        'defaultTemplate',
        'should return default template if source is ChildDefaultTemplate'
    );

    const templateSource = new TemplateBase();
    assert.strictEqual(acquireTemplate(templateSource), templateSource, 'should return source template if it is TemplateBase instance');

    const render = sinon.spy();
    const nextTemplate = acquireTemplate({ render });
    nextTemplate.render('options');
    assert.ok(render.calledWith('options'), 'should add render call if template render is a function and template is not renderer');

    const createTemplate = sinon.stub().returns('value');
    const isRenderer = sinon.stub(type, 'isRenderer').returns(true);

    const result = acquireTemplate({ render }, createTemplate);
    assert.strictEqual(createTemplate.callCount, 1, 'should call `createTemplate` if template is renderer');
    assert.strictEqual(result, 'value', 'should return result if template is renderer');

    isRenderer.restore();

    const result2 = acquireTemplate({ nodeType: true }, createTemplate);
    assert.strictEqual(createTemplate.callCount, 2, 'should call `createTemplate` if template has nodeType');
    assert.strictEqual(result2, 'value', 'should return result if template has nodeTType');

    isRenderer.returns(false);

    const result3 = acquireTemplate('templateSource', createTemplate, { templateSource: 'result3' }, true);
    assert.strictEqual(result3, 'result3', 'should call `acquireIntegrationTemplate` and return right result');

    const result4 = acquireTemplate('templateSource', createTemplate, { templateSource: false }, true, [], { templateSource: 'result4' });
    assert.strictEqual(result4, 'result4', 'should use default templates if `acquireIntegrationTemplate` doesn`t return result');

    createTemplate.returns('result5');
    const result5 = acquireTemplate('templateSource', createTemplate, { templateSource: false }, true, [], { templateSource: false });
    assert.strictEqual(result5, 'result5', 'should call `createTemplate` if all conditions above are false');
    assert.strictEqual(createTemplate.callCount, 3, 'should call `createTemplate` if template has nodeType');
});
