import $ from 'jquery';
import { TemplateManager } from 'core/template_manager';
import { Template } from 'core/templates/template';
import { EmptyTemplate } from 'core/templates/empty_template';
import { FunctionTemplate } from 'core/templates/function_template';

QUnit.module('TemplateManager');

QUnit.test('should define default anonymous template name', function(assert) {
    const templateManager = new TemplateManager();

    assert.strictEqual(templateManager.anonymousTemplateName, 'template', '`template` is default anonymous template name');
});

QUnit.test('should define custom anonymous template name', function(assert) {
    const templateManager = new TemplateManager(undefined, 'customAnonymousTemplateName');

    assert.strictEqual(templateManager.anonymousTemplateName, 'customAnonymousTemplateName', '`customAnonymousTemplateName` is custom anonymous template name');
});

QUnit.test('should define default createElement function', function(assert) {
    const templateManager = new TemplateManager();

    assert.ok(templateManager._createTemplate(() => undefined) instanceof Template, 'default createElement function should returns a Template instance');
});

QUnit.test('should define custom createElement function', function(assert) {
    const templateManager = new TemplateManager(() => 'customCreateElement');

    assert.strictEqual(templateManager._createTemplate(() => undefined), 'customCreateElement', 'default createElement function should returns a Template instance');
});

QUnit.test('#defaultOptions', function(assert) {
    const defaultOptions = TemplateManager.createDefaultOptions();

    assert.ok(defaultOptions.integrationOptions, 'integrationOptions are defined');
    assert.ok(defaultOptions.integrationOptions.watchMethod, 'watchMethod is defined');
    assert.ok(defaultOptions.integrationOptions.templates, 'templates are defined');
    assert.ok(defaultOptions.integrationOptions.templates['dx-polymorph-widget'], 'default polymorph widget template is defined');
    assert.strictEqual(defaultOptions.integrationOptions.useDeferUpdateForTemplates, true, 'do not use deferUpdate for template rendering');
});

QUnit.module('TemplateManager methods');

QUnit.test('#addDefaultTemplates', function(assert) {
    const templateManager = new TemplateManager();

    templateManager.addDefaultTemplates({ item1: 'item1' });
    assert.strictEqual(templateManager._defaultTemplates.item1, 'item1', 'should add a default template');

    templateManager.addDefaultTemplates({ item1: 'new-template1' });
    assert.strictEqual(templateManager._defaultTemplates.item1, 'new-template1', 'should edit existed default template');

    templateManager.addDefaultTemplates({ item2: 'item2', item3: 'item3' });
    assert.strictEqual(templateManager._defaultTemplates.item1, 'new-template1', 'should keep predefined default templates');
    assert.strictEqual(templateManager._defaultTemplates.item2, 'item2', 'should add multiple default templates');
    assert.strictEqual(templateManager._defaultTemplates.item3, 'item3', 'should add multiple default templates');
});

QUnit.test('#dispose', function(assert) {
    const templateManager = new TemplateManager();
    const dispose = sinon.spy();

    templateManager._tempTemplates = [{ template: { dispose } }, { template: { dispose } }, { template: {} }];

    templateManager.dispose();
    assert.strictEqual(dispose.callCount, 2, 'should call template\'s `dispose` if it exists');
    assert.strictEqual(templateManager._tempTemplates.length, 0, 'should clear `_tempTemplates` array');
});

QUnit.module('TemplateManager method #extractTemplates');

QUnit.test('should work without templates', function(assert) {
    const element = $('<div>');
    const templateManager = new TemplateManager();

    const { templates, anonymousTemplateMeta } = templateManager.extractTemplates(element);
    assert.equal(templates.length, 0, 'should return array without templates');
    assert.equal(Object.keys(anonymousTemplateMeta).length, 0, 'should return empty meta object');
});

QUnit.test('should extract defined templates', function(assert) {
    const element = $('<div><div data-options=dxTemplate:{name:"templateName"}></div>');
    const templateManager = new TemplateManager();

    const { templates, anonymousTemplateMeta } = templateManager.extractTemplates(element);
    assert.equal(templates.length, 1, 'should return array with template');
    assert.equal(Object.keys(anonymousTemplateMeta).length, 0, 'should return empty meta object');
});

QUnit.test('should extract anonymous template', function(assert) {
    const createElement = sinon.stub().returns('element');
    const element = $('<div><div>123</div></div>');
    const templateManager = new TemplateManager(createElement);

    const { templates, anonymousTemplateMeta } = templateManager.extractTemplates(element);
    assert.equal(templates.length, 0, 'should return array without predefined templates');

    assert.equal(anonymousTemplateMeta.name, 'template', 'should return anonymous template name');
    assert.equal(anonymousTemplateMeta.template, 'element', 'should return anonymous template');
    assert.equal(element.children().length, 0, 'initial element should not has children');
});

QUnit.module('TemplateManager method #getTemplate');

QUnit.test('should work if template source is not a function', function(assert) {
    const templateManager = new TemplateManager();
    const templateSource = null;

    const template = templateManager.getTemplate(templateSource, [], {});
    assert.ok(template instanceof EmptyTemplate, 'should return acquireTemplate result');
});

QUnit.test('should work if template source is a function', function(assert) {
    const templates = { item: () => 'item' };
    const templateSource = () => 'item';
    const templateManager = new TemplateManager();

    const template = templateManager.getTemplate(templateSource, templates, { isAsyncTemplate: false, skipTemplates: [] }, {});
    assert.ok(template instanceof FunctionTemplate, 'should return FunctionTemplate instance');
});
