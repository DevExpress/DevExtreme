module.exports = {
    // regex, replacement - replace
    // import, type - additional import (
    //    simple - without 'with'
    'typography': [
        { regex: /\(css\)\s/, replacement: '' },
        { import: '../common', type: 'simple' },
    ],
    'common': [
        { regex: /([^$][\w-].*?:\s.*),$/gm, replacement: '$1;' },
        { regex: /\.user-select\(none\),/, replacement: '@include user-select(none);' },
        { regex: /@mixin badge-settings\(\),/, replacement: '@include badge-settings();' },
        { regex: /@mixin validation-badge-animation\(\),/, replacement: '@include validation-badge-animation();' },
        { import: '../../base/mixins', type: 'simple' },
    ],
    'icons': [
        { regex: /@import \(once\) "..\/base\/icons.scss";/, replacement: '' },
        { import: '../../base/icons', type: 'simple' },
    ],
    'widget': [
        { import: '../common', type: 'simple' },
    ],
    'fieldset': [
        { import: '../common/sizes', type: 'simple' },
        { import: '../common', type: 'simple' },
        { import: '../typography', type: 'simple' },
    ],
    'button': [
        { import: '../../base/icons', type: 'simple' },
        { regex: /@mixin dx-icon-sizing\(\$ICON_SIZE\),/, replacement: '@include dx-icon-sizing($ICON_SIZE);' },
        { regex: /\.dx-icon-margin\(\$ICON_MARGIN\),/, replacement: '@include dx-icon-margin($ICON_MARGIN);' },
        { regex: /@mixin dx-button-onlyicon-sizing\(\),/, replacement: '@include dx-button-onlyicon-sizing();' },
        { regex: /.dx-button-onlyicon-sizing\(\),/, replacement: '@include dx-button-onlyicon-sizing();' },
        { regex: /.dx-button-withtext-sizing\(\),/, replacement: '@include dx-button-withtext-sizing();' },
        { regex: /.dx-button-text-and-icon-sizing\(\),/, replacement: '@include dx-button-text-and-icon-sizing();' },
        { regex: /\$MATERIAL_BUTTON_MIN_WIDTH,/, replacement: '$MATERIAL_BUTTON_MIN_WIDTH;' }
    ]
};
