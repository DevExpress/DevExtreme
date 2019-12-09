import domUtils from 'core/utils/dom';
import type from 'core/utils/type';
import common from 'core/utils/common';
import renderer from 'core/renderer';
import {
    findTemplateByDevice, addOneRenderedCall, templateKey,
    getNormalizedTemplateArgs, validateTemplateSource,
    defaultCreateElement, acquireIntegrationTemplate, acquireTemplate,
} from 'core/utils/template_manager';
import { Template } from 'core/templates/template';
import { TemplateBase } from 'core/templates/template_base';
import { EmptyTemplate } from 'core/templates/empty_template';
import { ChildDefaultTemplate } from 'core/templates/child_default_template';

QUnit.module("TemplateManager utils", {
    beforeEach: function() {
        const $ = renderer;
        this.$remove = sinon.stub($.fn, 'remove');
    },
    afterEach: function() {
        this.$remove.restore();
    }
});

QUnit.test("#validateTemplateSource", function(assert) {
    const normalize = sinon.stub(domUtils, 'normalizeTemplateElement');

    assert.strictEqual(validateTemplateSource(1), 1, "should return value if it is not a string");
    assert.notOk(normalize.called, "should not normalize template element if value is a string");

    validateTemplateSource('template');
    assert.ok(normalize.called, "should normalize template element if value is a string");

    normalize.restore();
});

QUnit.test("#templateKey", function(assert) {
    const templateSource = ['template'];
    const isRenderer = sinon.stub(type, 'isRenderer');

    isRenderer.returns(true);
    assert.strictEqual(templateKey(templateSource), 'template', "should return value if it is not a renderer function");

    isRenderer.returns(false);
    assert.strictEqual(templateKey(templateSource), templateSource, "should return a first array item if if is a renderer function");

    isRenderer.restore();
});

QUnit.test("#findTemplateByDevice", function(assert) {
    const findBestMatches = sinon.stub(common, 'findBestMatches').returns('bestTemplate');
    const templates = ['template1', 'b', 'template2'];

    const result = findTemplateByDevice(templates);

    assert.strictEqual(result, 'b', "should return best matches");
    assert.strictEqual(this.$remove.callCount, 2, "should return calls remove method only for non best matches");

    findBestMatches.restore();
});

QUnit.test("#addOneRenderedCall", function(assert) {
    const render = sinon.spy();
    const template = { render, customField: 'customField' };
    const nextTemplate = addOneRenderedCall(template);

    assert.strictEqual(nextTemplate.customField, 'customField', 'should keep previous fields');

    nextTemplate.render('options');
    assert.ok(render.calledWith('options'), 'should call old `render` method');
});

QUnit.test("#getNormalizedTemplateArgs", function(assert) {
    const options = { model: 'model', index: 'index', container: 'container' };
    const normalizeArgs = getNormalizedTemplateArgs(options);

    assert.strictEqual(normalizeArgs[0], 'model', 'should contains model');
    assert.strictEqual(normalizeArgs[1], 'index', 'should contains index');
    assert.strictEqual(normalizeArgs[2], 'container', 'should contains container');
    assert.strictEqual(normalizeArgs[3], undefined, 'should not append something else');
});

QUnit.test("#defaultCreateElement", function(assert) {
    const template = defaultCreateElement();

    assert.ok(template instanceof Template, 'should return instance of Template');
});

QUnit.test("#acquireIntegrationTemplate", function(assert) {
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

QUnit.test("#acquireTemplate", function(assert) {
    assert.ok(acquireTemplate(null) instanceof EmptyTemplate, 'should return empty template if source is null');

    assert.equal(
        acquireTemplate(new ChildDefaultTemplate('templateName'), undefined, undefined, undefined, undefined, { templateName: 'defaultTemplate' }),
        'defaultTemplate',
        'should return default template if source is ChildDefaultTemplate'
    );

    const templateSource = new TemplateBase();
    assert.strictEqual(acquireTemplate(templateSource), templateSource, 'should return source template if it is TemplateBase');
});
