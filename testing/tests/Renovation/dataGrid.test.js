import $ from 'jquery';
import DataGrid from 'ui/data_grid/ui.data_grid';
import RenovatedDataGrid from 'renovation/ui/grids/data_grid/data_grid.j';

const IGNORE_OPTION_NAMES = [
    'integrationOptions.watchMethod',
    'hoveredElement',
    'isActive',
    'onFocusIn',
    'onFocusOut',
    'onKeyboardHandled',
    'ignoreParentReadOnly',
    'loadPanel.animation', // TODO
    'useResizeObserver'
];

function checkDefaultOptions(assert, options, newOptions, prefix = '') {
    Object.keys(options).forEach(name => {
        const value = options[name];
        const newValue = newOptions[name];
        const fullName = prefix ? prefix + '.' + name : name;

        if(IGNORE_OPTION_NAMES.indexOf(fullName) >= 0) {
            return;
        }

        if($.isPlainObject(value) && $.isPlainObject(newValue)) {
            checkDefaultOptions(assert, value, newValue, fullName);
        } else if(typeof value === 'function' && typeof newValue === 'function') {
            assert.deepEqual(newValue(), value(), fullName);
        } else {
            assert.deepEqual(newValue === null ? undefined : newValue, value === null ? undefined : value, fullName);
        }
    });
}

QUnit.module('DataGrid', () => {
    QUnit.skip('Check Default Options', function(assert) {
        const defaultOptions = new DataGrid($('<div>')).option();
        const renovatedDefaultOptions = new RenovatedDataGrid($('<div>')).option();

        checkDefaultOptions(assert, defaultOptions, renovatedDefaultOptions);
    });
});

