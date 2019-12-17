const $ = require('jquery');

require('ui/select_box');

const TIMEZONES = [
    { 'id': 'Africa/Addis_Ababa', 'title': 'Addis Ababa', 'winIndex': 0, 'link': 7 }, // link to Africa/Abidjan
    { 'id': 'Africa/Asmara', 'title': 'Asmara', 'winIndex': 0, 'link': 7 }, // link to Africa/Abidjan
    { 'id': 'Africa/Dar_es_Salaam', 'title': 'Dar es Salaam', 'winIndex': 0, 'link': 7 }, // link to Africa/Abidjan
    { 'id': 'Africa/Bamako', 'title': 'Bamako', 'winIndex': 1, 'link': 6 }, // link to Africa/Abidjan
    { 'id': 'Africa/Banjul', 'title': 'Banjul', 'winIndex': 1, 'link': 6 }, // link to Africa/Abidjan
    { 'id': 'Africa/Conakry', 'title': 'Conakry', 'winIndex': 1, 'link': 6 }, // link to Africa/Abidjan

    { 'id': 'Africa/Abidjan', 'title': 'Abidjan', 'winIndex': 1, 'offsets': [-0.2688888888888889, 0], 'offsetIndices': '01', 'untils': '-u9rgl4|Infinity' },
    { 'id': 'Africa/Nairobi', 'title': 'Nairobi', 'winIndex': 0, 'offsets': [2.454444444444445, 3, 2.5, 2.75], 'offsetIndices': '01231', 'untils': '-lnsetg|s8mhg|57v020|afrrb0|Infinity' }
];

const DISPLAY_NAMES = ['(UTC+03:00) Nairobi', '(UTC) Monrovia, Reykjavik'];

const NO_TZ = require('localization/message').format('dxScheduler-noTimezoneTitle');

const TimezoneEditor = require('ui/scheduler/timezones/ui.scheduler.timezone_editor');
const SchedulerTimezones = require('ui/scheduler/timezones/ui.scheduler.timezones');

sinon.stub(SchedulerTimezones, 'getTimezones').returns(TIMEZONES);
sinon.stub(SchedulerTimezones, 'getDisplayNames').returns(DISPLAY_NAMES);

const Subscribes = require('ui/scheduler/ui.scheduler.subscribes');

const createEditor = function(options) {
    options = options || {};
    options.observer = {
        fire: function(type, args) {
            return Subscribes[type](args);
        }
    };

    this.instance = new TimezoneEditor($('#timezone-editor'), options);
};

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="timezone-editor"></div>');
});

QUnit.module('Rendering', {
    beforeEach: function() {
        this.createInstance = $.proxy(createEditor, this);
    }
});

QUnit.test('Timezone editor should be initialized', function(assert) {
    this.createInstance();
    assert.ok(this.instance instanceof TimezoneEditor, 'dxSchedulerTimezoneEditor was initialized');

    assert.ok(this.instance.$element().hasClass('dx-timezone-editor'));
});

QUnit.test('Timezone editor should contain tz display name selectbox', function(assert) {
    this.createInstance();
    const $tzDisplayNameSelectBox = this.instance.$element().find('.dx-timezone-display-name');

    assert.equal($tzDisplayNameSelectBox.length, 1, 'Display name editor is rendered');
    assert.ok($tzDisplayNameSelectBox.dxSelectBox('instance'), 'Display name editor is selectbox');
});

QUnit.test('Timezone editor should contain iana id selectbox', function(assert) {
    this.createInstance();

    const $tzIdSelectBox = this.instance.$element().find('.dx-timezone-iana-id');
    const tzIdSelectBox = $tzIdSelectBox.dxSelectBox('instance');

    assert.equal($tzIdSelectBox.length, 1, 'Tz id editor is rendered');
    assert.ok($tzIdSelectBox.dxSelectBox('instance'), 'Tz id editor is selectbox');

    assert.equal(tzIdSelectBox.option('valueExpr'), 'id', 'Value expr is OK');
    assert.equal(tzIdSelectBox.option('displayExpr'), 'displayName', 'Display expr is OK');
});

QUnit.module('Data processing', {
    beforeEach: function() {

        this.createInstance = $.proxy(createEditor, this);

        this.getDisplayNameEditor = function() {
            return this.instance.$element()
                .find('.dx-timezone-display-name')
                .dxSelectBox('instance');
        };

        this.getIdEditor = function() {
            return this.instance.$element()
                .find('.dx-timezone-iana-id')
                .dxSelectBox('instance');
        };
    }
});

QUnit.test('Init without value', function(assert) {
    this.createInstance();

    const displayNameSelectBox = this.getDisplayNameEditor();
    const idSelectBox = this.getIdEditor();

    assert.deepEqual(displayNameSelectBox.option('items'), [
        NO_TZ,
        '(UTC) Monrovia, Reykjavik',
        '(UTC+03:00) Nairobi'], 'Display names are OK');
    assert.equal(idSelectBox.option('items').length, 0, 'Ids are OK');
    assert.strictEqual(idSelectBox.option('disabled'), true, 'Id selectbox is disabled');
    assert.equal(displayNameSelectBox.option('value'), NO_TZ, 'Value is OK');
});

QUnit.test('Init with value', function(assert) {
    this.createInstance({ value: 'Africa/Addis_Ababa' });

    const displayNameSelectBox = this.getDisplayNameEditor();
    const idSelectBox = this.getIdEditor();
    const displayNames = displayNameSelectBox.option('items');

    assert.equal(displayNameSelectBox.option('value'), '(UTC+03:00) Nairobi', 'Display name is OK');

    assert.equal(displayNames[0], NO_TZ, 'Empty item is OK');
    assert.equal(displayNames[1], '(UTC) Monrovia, Reykjavik', 'Display name is OK');
    assert.equal(displayNames[2], '(UTC+03:00) Nairobi', 'Display name is OK');
    assert.equal(displayNames.length, 3, 'Display name count is OK');

    assert.equal(idSelectBox.option('value'), 'Africa/Addis_Ababa', 'Id is OK');
    assert.deepEqual(idSelectBox.option('items'), [
        { id: 'Africa/Addis_Ababa', displayName: 'Addis Ababa' },
        { id: 'Africa/Asmara', displayName: 'Asmara' },
        { id: 'Africa/Dar_es_Salaam', displayName: 'Dar es Salaam' },
        { id: 'Africa/Nairobi', displayName: 'Nairobi' }
    ], 'Ids are OK');
    assert.strictEqual(idSelectBox.option('disabled'), false, 'Id selectbox isn\'t disabled');
});

QUnit.test('Process value changing', function(assert) {
    this.createInstance();

    this.instance.option('value', 'Africa/Addis_Ababa');

    const displayNameSelectBox = this.getDisplayNameEditor();
    const idSelectBox = this.getIdEditor();

    assert.equal(displayNameSelectBox.option('value'), '(UTC+03:00) Nairobi', 'Display name is OK');
    assert.deepEqual(displayNameSelectBox.option('items'), [
        NO_TZ,
        '(UTC) Monrovia, Reykjavik',
        '(UTC+03:00) Nairobi'], 'Display names are OK');

    assert.equal(idSelectBox.option('value'), 'Africa/Addis_Ababa', 'Id is OK');
    assert.deepEqual(idSelectBox.option('items'), [
        { id: 'Africa/Addis_Ababa', displayName: 'Addis Ababa' },
        { id: 'Africa/Asmara', displayName: 'Asmara' },
        { id: 'Africa/Dar_es_Salaam', displayName: 'Dar es Salaam' },
        { id: 'Africa/Nairobi', displayName: 'Nairobi' }
    ], 'Ids are OK');
    assert.strictEqual(idSelectBox.option('disabled'), false, 'Id selectbox isn\'t disabled');
});

QUnit.test('Process display name changing', function(assert) {
    this.createInstance();

    const displayNameSelectBox = this.getDisplayNameEditor();
    const idSelectBox = this.getIdEditor();


    displayNameSelectBox.option('value', '(UTC+03:00) Nairobi');

    assert.equal(this.instance.option('value'), 'Africa/Addis_Ababa');
    assert.equal(idSelectBox.option('value'), 'Africa/Addis_Ababa', 'Id is OK');
    assert.deepEqual(idSelectBox.option('items'), [
        { id: 'Africa/Addis_Ababa', displayName: 'Addis Ababa' },
        { id: 'Africa/Asmara', displayName: 'Asmara' },
        { id: 'Africa/Dar_es_Salaam', displayName: 'Dar es Salaam' },
        { id: 'Africa/Nairobi', displayName: 'Nairobi' }
    ], 'Ids are OK');
});

QUnit.test('Process display name changing if it changes to \'No tz\'', function(assert) {
    this.createInstance({ value: 'Africa/Addis_Ababa' });

    const displayNameSelectBox = this.getDisplayNameEditor();
    const idSelectBox = this.getIdEditor();

    displayNameSelectBox.option('value', NO_TZ);

    assert.equal(this.instance.option('value'), null);
    assert.equal(idSelectBox.option('value'), null, 'Id is OK');
    assert.equal(idSelectBox.option('items').length, 0, 'Ids are OK');
    assert.strictEqual(idSelectBox.option('disabled'), true, 'Ids editor is disabled');
    assert.equal(displayNameSelectBox.option('value'), NO_TZ, 'Display name is OK');

    this.instance.option('value', null);
    assert.equal(displayNameSelectBox.option('value'), NO_TZ, 'Display name is OK');
});

QUnit.test('Display name should be equal to NO_TZ if tz editor value changes to null', function(assert) {
    this.createInstance({ value: 'Africa/Addis_Ababa' });

    const displayNameSelectBox = this.getDisplayNameEditor();

    this.instance.option('value', null);
    assert.equal(displayNameSelectBox.option('value'), NO_TZ, 'Display name is OK');
});

QUnit.test('Process tz id changing', function(assert) {
    this.createInstance({ value: 'Africa/Bamako' });

    const idSelectBox = this.getIdEditor();

    idSelectBox.option('value', 'Africa/Banjul');

    assert.equal(this.instance.option('value'), 'Africa/Banjul');
    assert.deepEqual(idSelectBox.option('items'), [
        { id: 'Africa/Abidjan', displayName: 'Abidjan' },
        { id: 'Africa/Bamako', displayName: 'Bamako' },
        { id: 'Africa/Banjul', displayName: 'Banjul' },
        { id: 'Africa/Conakry', displayName: 'Conakry' }
    ], 'Ids are OK');
});

QUnit.test('Process readOnly state changing', function(assert) {
    this.createInstance({ readOnly: true });

    const displayNameSelectBox = this.getDisplayNameEditor();
    const idSelectBox = this.getIdEditor();

    assert.strictEqual(displayNameSelectBox.option('readOnly'), true, 'ReadOnly is OK');
    assert.strictEqual(idSelectBox.option('readOnly'), true, 'ReadOnly is OK');

    this.instance.option('readOnly', false);

    assert.strictEqual(displayNameSelectBox.option('readOnly'), false, 'ReadOnly is OK');
    assert.strictEqual(idSelectBox.option('readOnly'), false, 'ReadOnly is OK');
});
