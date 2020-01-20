module.exports = {
    // regex, replacement - replace
    // import, type - additional import (
    //    simple - without 'with',
    //    useinsizes - use in _sizes.scss,
    //    useincolors - use in _colors.scss)
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
    ]
};
