import $ from 'jquery';
import 'ui/html_editor';

import ConverterController from '__internal/ui/html_editor/m_converterController';

const { test } = QUnit;

QUnit.module('Converter controller', () => {
    test('Check registered converters', function(assert) {
        const deltaConverter = ConverterController.getConverter('delta');

        assert.ok(deltaConverter, 'Delta converter exists');
    });

    test('Add new converter', function(assert) {
        ConverterController.addConverter('custom', () => {});
        const customConverter = ConverterController.getConverter('custom');

        assert.ok(customConverter, 'Custom converter exists');
    });
});
