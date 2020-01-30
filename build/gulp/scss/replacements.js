module.exports = {
    // regex, replacement - replace
    // import, type - additional import (
    //    index - in _index.scss file
    //    colors - in _colors.scss file
    //    sizes - in _sizes.scss file)
    'typography': [
        { regex: /\(css\)\s/, replacement: '' },
        { import: '../common', type: 'index' },
    ],
    'common': [
        { regex: /([^$][\w-].*?:\s.*),$/gm, replacement: '$1;' },
        { regex: /\.user-select\(none\),/, replacement: '@include user-select(none);' },
        { regex: /@mixin badge-settings\(\),/, replacement: '@include badge-settings();' },
        { regex: /@mixin validation-badge-animation\(\),/, replacement: '@include validation-badge-animation();' },
        { import: '../../base/mixins', type: 'index' },
    ],
    'icons': [
        { regex: /@import \(once\) "..\/base\/icons.scss";/, replacement: '' },
        { import: '../../base/icons', type: 'index' },
    ],
    'widget': [
        { import: '../common', type: 'index' },
    ],
    'fieldset': [
        { import: '../common/sizes', type: 'index' },
        { import: '../common', type: 'index' },
        { import: '../typography', type: 'index' },
    ],
    'button': [
        { import: '../../base/icons', type: 'index' },
        { regex: /@mixin dx-icon-sizing\(\$ICON_SIZE\),/, replacement: '@include dx-icon-sizing($ICON_SIZE);' },
        { regex: /\.dx-icon-margin\(\$ICON_MARGIN\),/, replacement: '@include dx-icon-margin($ICON_MARGIN);' },
        { regex: /@mixin dx-button-onlyicon-sizing\(\),/, replacement: '@include dx-button-onlyicon-sizing();' },
        { regex: /.dx-button-onlyicon-sizing\(\),/, replacement: '@include dx-button-onlyicon-sizing();' },
        { regex: /.dx-button-withtext-sizing\(\),/, replacement: '@include dx-button-withtext-sizing();' },
        { regex: /.dx-button-text-and-icon-sizing\(\),/, replacement: '@include dx-button-text-and-icon-sizing();' },
        { regex: /\$MATERIAL_BUTTON_MIN_WIDTH,/, replacement: '$MATERIAL_BUTTON_MIN_WIDTH;' }
    ],
    'buttonGroup': [
        { import: '../button', type: 'index' },
        { import: '../button/colors', type: 'index' },
        { import: '../button/colors', type: 'colors' },
    ],
    'scrollView': [
        { import: '../scrollable/colors', type: 'index' },
    ],
    'checkBox': [
        { import: 'colors', type: 'sizes' },
        { import: '../../base/icons', type: 'index' },
    ],
    'switch': [
        { import: '../../base/mixins', type: 'index' },
    ],
    'tabs': [
        { import: '../button', type: 'index' },
        { import: '../button/colors', type: 'index' },
        { import: '../button/colors', type: 'colors' },
        { import: '../../base/icons', type: 'index' },
    ],
    'navBar': [
        { import: '../../base/icons', type: 'index' },
    ]
};
