const $ = require('jquery');
const messageLocalization = require('localization/message');
const localization = require('localization');
const de = require('localization/messages/de.json!');
const ja = require('localization/messages/ja.json!');
const ru = require('localization/messages/ru.json!');

localization.loadMessages(de);
localization.loadMessages(ja);
localization.loadMessages(ru);

QUnit.module('Locales of DevExtreme');

QUnit.test('Four locales should be linked', function(assert) {
    const result = messageLocalization.getMessagesByLocales();
    assert.ok(result['en'], 'Default (English)');
    assert.ok(result['ru'], 'Russian');
    assert.ok(result['de'], 'Deutch (German)');
    assert.ok(result['ja'], 'Japan');
});

const compareLocales = function(first, second, assert) {
    const cultures = messageLocalization.getMessagesByLocales();
    const firstLocaleMessages = cultures[first];
    const secondLocaleMessages = cultures[second];
    const knownMatchingKeys = [
        'OK',
        'dxDataGrid-editingConfirmDeleteTitle',
        'dxFileUploader-kb',
        'dxFileUploader-Mb',
        'dxFileUploader-Gb',
        'dxDataGrid-summaryMin',
        'dxDataGrid-summaryMax',
        'dxDataGrid-summaryAvg',
        'dxDataGrid-trueText',
        'dxDataGrid-falseText',
        'dxDataGrid-headerFilterOK',
        'dxForm-optionalMark',
        'dxScheduler-switcherAgenda',
        'dxPivotGrid-dataNotAvailable',
        'dxFilterBuilder-and',
        'dxFilterBuilder-or',
        'dxFilterBuilder-notAnd',
        'dxFilterBuilder-notOr',
        'dxHtmlEditor-dialogImageUrlField',
        'dxHtmlEditor-dialogLinkUrlField',
        'dxHtmlEditor-dialogLinkTextField',
        'dxDiagram-uiExport',
        'dxDiagram-uiLayout',
        'dxDiagram-uiText',
        'dxDiagram-unitIn',
        'dxDiagram-unitCm',
        'dxDiagram-unitPx',
        'dxDiagram-dialogButtonOK',
        'dxDiagram-categoryGeneral',
        'dxDiagram-commandConnectorLineOrthogonal',
        'dxDiagram-shapeOr',
        'dxDiagram-shapeText',
        'dxDiagram-shapeEllipse',
        'dxDiagram-shapeContainerDefaultText',
        'dxFileManager-listDetailsColumnCaptionName'
    ];

    $.each(firstLocaleMessages, function(name, value) {
        const otherLocalValue = secondLocaleMessages[name];

        if(value === otherLocalValue) {
            if($.inArray(name, knownMatchingKeys) !== -1) {
                assert.ok(true, name + ' is known to match in this locales');
            } else {
                assert.ok(false, name + ' is present in ' + first + ', but not in ' + second);
            }
        } else {
            if(otherLocalValue === '!TODO!') {
                assert.ok(true, name + ' is marked for translation');
            } else {
                assert.ok(true, name + ' is translated');
            }
        }
    });
};


QUnit.test('en and ru', function(assert) {
    compareLocales('en', 'ru', assert);
});
QUnit.test('en and de', function(assert) {
    compareLocales('en', 'de', assert);
});
QUnit.test('en and ja', function(assert) {
    compareLocales('en', 'ja', assert);
});
